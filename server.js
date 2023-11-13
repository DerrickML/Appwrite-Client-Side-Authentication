// Importing required modules
// import cors from "codockerrs";
// Importing required modules
import express from "express";
import cors from "cors";
import path from "path";
import crypto from "crypto";

import {
  client,
  users,
  account,
  databases,
  database_id,
  studentTable_id,
  parentsTable_id,
  ENCRYPTION_KEY,
} from "./appwriteServerConfig.js";

// Initializing Express app
const app = express();

/************************************************/
/*From any origin*/
// Use cors middleware with wildcard origin
app.use(
  cors({
    origin: "*",
  }),
);
/************************************************/

// Server is set up to parse JSON bodies
app.use(express.json());

// Serving static files from 'public' directory
app.use(express.static(path.join(process.cwd(), "public")));

/***********************************************/
// ENCRYPTION AND DECRYPTION
// const ENCRYPTION_KEY = crypto.randomBytes(32); // This should ideally be stored securely and not hardcoded
// console.log(ENCRYPTION_KEY.toString("hex")); //For generating the key
const IV_LENGTH = 16; // For AES, this is always 16
/***********************************************/

// Encryption function
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// ===== ROUTE HANDLERS =====
/*ROUTE: Server-side Encryption*/
app.post("/encrypt", (req, res) => {
  try {
    const text = req.body.passcode;
    const encryptedData = encrypt(text);
    res.json({ encryptedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Encryption failed" });
  }
});

/*ROUTE: User Server-Side Decryption and Verification*/
app.post("/verify-passcode", (req, res) => {
  try {
    const encryptedText = req.body.encryptedPasscode;
    const userPasscode = req.body.userPasscode;

    let textParts = encryptedText.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedTextBuffer = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, "hex"),
      iv,
    );
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    if (decrypted.toString() === userPasscode) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Decryption failed" });
  }
});

/*ROUTE: User Listing*/
app.get("/users", async (req, res) => {
  try {
    const usersList = await users.list(); // Assuming nodeAppwriteUsers is available
    res.json({ users: usersList.users }); // Respond with the list of users
    console.log(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" }); // Updated to return JSON
  }
});

/*ROUTE: User Deletion*/
app.post("/delete-user", async (req, res) => {
  const userIds = req.body.userIds;
  if (!userIds || userIds.length === 0) {
    return res.status(400).send("User IDs are required");
  }

  const errors = []; // Array to hold any errors that occur

  for (const userId of userIds) {
    try {
      await users.delete(userId); // Assuming nodeAppwriteUsers is available
    } catch (error) {
      console.error(error);
      errors.push(`Failed to delete user with ID ${userId}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    res.status(500).json({ errors }); // Send back any errors that occurred
  } else {
    res.send("Users deleted successfully");
  }
});

/*ROUTE: Add Created New Parent account to Parents' Collection*/
app.post("/createParentDoc", async (req, res) => {
  const { parent_ID, firstName, secondName, email, phoneNumber, passCode } =
    req.body;

  // Encrypt the passcode
  const encryptedPassCode = encrypt(passCode);

  try {
    await databases.createDocument(database_id, parentsTable_id, "unique()", {
      parID: parent_ID,
      firstName: firstName,
      lastName: secondName,
      email: email,
      phoneNumber: phoneNumber,
      passCode: encryptedPassCode, // Save the encrypted passcode
    });
    res.status(200).send("Parent added successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        `Failed to add parent to the Parent's Table/Collection ${parent_ID}: ${error.message}`,
      );
  }
});

// ===== STARTING THE SERVER =====
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
