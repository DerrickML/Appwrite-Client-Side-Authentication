// Importing required modules
import express from 'express'
import session from 'express-session'
import path from 'path'
import {
  nodeAppWriteClient,
  nodeAppwriteUsers,
  appwriteAccount,
  appwriteClient
} from './appwriteconfig.js'

// Initializing Express app
const app = express()

// ======= MIDDLEWARE SETUP ======
// Server is set up to parse JSON bodies
app.use(express.json())

// Setting up session middleware
app.use(
  session({ secret: 'your-secret-key', resave: false, saveUninitialized: true })
)

// Serving static files from 'public' directory
app.use(express.static(path.join(process.cwd(), 'public')))

// Parsing URL-encoded data
app.use(express.urlencoded({ extended: true }))

// Middleware to check login status
function checkLoginStatus (req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/')
  }
  next()
}

/*Admin Check Middleware*/
function checkAdmin (req, res, next) {
  console.log(req.session) // log the session object
  console.log(req.session.userInfo) // log the userInfo object
  if (
    !req.session ||
    !req.session.userInfo ||
    !req.session.userInfo.labels.includes('admin')
  ) {
    return res.status(403).send('Access denied')
  }
  next()
}

// ======= ROUTE HANDLERS ======

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
})

// Route to serve the home page
app.get('/home', checkLoginStatus, (req, res) => {
  // Redirect to login if not authenticated
  if (!req.session || !req.session.userId) return res.redirect('/')
  res.sendFile(path.join(process.cwd(), 'public', 'home.html'))
})

// Route to serve the profile page
app.get('/profile', checkLoginStatus, (req, res) => {
  // Redirect to login if not authenticated
  if (!req.session || !req.session.userId) return res.redirect('/')
  res.sendFile(path.join(process.cwd(), 'public', 'profile.html'))
})

// Route to handle user signup
app.post('/signup', async (req, res) => {
  const { email, password, phone, username } = req.body;

  // Validate phone number format
  if (!phone.startsWith('+')) {
    return res
      .status(400)
      .send(
        'Phone number must start with a "+" and be followed by the country code and local number.'
      );
  }

  try {
    // const jwtToken = await createJWT();
    // req.session.jwtToken = jwtToken;  // Store the JWT token in the session
    // Creating a new user
    await nodeAppwriteUsers
      .create('unique()', email, phone, password, username)
      .then(response => {
        console.log(response); // Logging success response
        req.session.userId = response['$id'];  // Save user ID to the session
        res.json({ message: 'Signup successful' }); // Sending success response to client
      })
      .catch(error => {
        console.error(error); // Logging error
        res.status(500).send('Signup failed'); // Sending error response to client
      });
  } catch (error) {
    console.error('Registration failed:', error); // Logging error
    res.status(500).json({ message: 'Signup Failed' }); // Sending error response to client
  }
});

///////////////////////////////////////////
// Route to create verification
app.post('/createVerification', async (req, res) => {
  try {
      const verificationResponse = await appwriteAccount.createVerification('http://localhost:3000/verifyEmail');
      console.log('Verification created:', verificationResponse);
      res.json({ success: true });
  } catch (error) {
      console.error('Error creating verification:', error);
      res.json({ success: false, message: error.message });
  }
});

// Route to check verification status
app.get('/verificationStatus', async (req, res) => {
  try {
      const userInfo = await appwriteAccount.get();
      res.json({ verified: userInfo.emailVerification });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
  }
});

// Route to handle email verification
app.get('/verifyEmail', async (req, res) => {
  const verificationToken = req.query.token;  // Get the verification token from the URL parameters
  try {
      const verificationResponse = await appwriteAccount.updateVerification(verificationToken);
      console.log('Verification successful:', verificationResponse);
      res.redirect('/profile');  // Redirect to the profile page or a page indicating successful verification
  } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).send('Error verifying email');
  }
});
///////////////////////////////////////////

// Route to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const userSession = await appwriteAccount.createEmailSession(
      email,
      password
    )
    const userId = userSession.userId // Get user ID from user session
    req.session.userId = userId // Save user ID to Express session

    // Fetch user information from Appwrite
    const userInfo = await nodeAppwriteUsers.get(userId)

    // Save user info to Express session
    req.session.userInfo = {
      userID: userId,
      providerUid: userSession.providerUid,
      provider: userSession.provider,
      countryName: userSession.countryName,
      labels: userInfo.labels // Populate labels from user information
    }

    res.json({ message: 'Login successful' })
  } catch (error) {
    console.error(error) // Logging error
    res.status(500).json({ message: 'Login failed', error })
  }
})

// Fetch user info
app.get('/userinfo', checkLoginStatus, (req, res) => {
  
  // nodeAppWriteClient.setJWT(req.session.jwtToken);  // Set the JWT token before making a request

  // Check authentication
  if (!req.session || !req.session.userId)
    return res.status(403).send('Not authenticated')

  // New method: Request user information from Appwrite
  const uID = req.session.userId // Assuming userID is stored in req.session.userId
  console.log('userID: ' + uID)
  nodeAppwriteUsers
    .get(uID)
    .then(response => {
      console.log('User Information:')
      console.log(response) // Log the response to the console
      res.json(response) // Send the response to the client
    })
    .catch(error => {
      console.error(error) // Log the error to the console
      res.status(500).send('Failed to fetch user info') // Send an error response to the client
    })
})

// Route to handle user logout
app.get('/logout', checkLoginStatus, (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout failed:', err) // Logging error
        return res.status(500).send('Logout failed')
      }
      res.redirect('/')
    })
  } else {
    res.redirect('/')
  }
})

////////////////////////////////
/*ROUTE: Admin Page*/
app.get('/admin', checkAdmin, checkLoginStatus, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'admin.html'))
})

/*ROUTE: User Listing*/
app.get('/users', checkAdmin, checkLoginStatus, async (req, res) => {
  try {
    const usersList = await nodeAppwriteUsers.list()
    console.log(usersList)

    // Filter out the currently logged-in user
    const filteredUsersList = usersList.users.filter(
      user => user.$id !== req.session.userId
    )

    // Send the filtered list of users to the client
    res.json({ users: filteredUsersList })
  } catch (error) {
    console.error(error)
    res.status(500).send('Failed to fetch users')
  }
})

/*ROUTE: User Deletion*/
app.post('/delete-user', checkAdmin, checkLoginStatus, async (req, res) => {
  const userIds = req.body.userIds
  if (!userIds || userIds.length === 0) {
    return res.status(400).send('User IDs are required')
  }

  const errors = [] // Array to hold any errors that occur

  for (const userId of userIds) {
    try {
      await nodeAppwriteUsers.delete(userId)
    } catch (error) {
      console.error(error)
      errors.push(`Failed to delete user with ID ${userId}: ${error.message}`)
    }
  }

  if (errors.length > 0) {
    res.status(500).json({ errors }) // Send back any errors that occurred
  } else {
    res.send('Users deleted successfully')
  }
})
////////////////////////////////
// Create a function to generate JWT
async function createJWT() {
  try {
    const jwtResponse = await appwriteAccount.createJWT();
    return jwtResponse.jwt;
  } catch (error) {
    console.error('Error creating JWT:', error);
    throw error;
  }
}


// ===== STARTING THE SERVER =====
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
