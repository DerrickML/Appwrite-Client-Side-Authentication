// Importing required modules and dotenv package
import { Client, Users, Account, Databases } from "node-appwrite";

// Init SDK
const client = new Client()
  .setEndpoint("http://localhost/v1") // Setting your Appwrite endpoint from env var
  .setProject("651c19d1dfd60ba38d55") // Setting your project ID from env var
  .setKey(
    "c629e40ea639c36aadc2a83fca61b8b789d1a3041dbfc7939218bc3f02c193fde85d3f962b7dcd33e0a13f1c4d3ab13b23f0578c398db1137a4fd8b236c1b4f6c970c8874254e2984b3681edf44c903cc9427d20299a131b971b47276d863db7dd2725b7ba6b25751f355ffd2fd875b665bf19f3244392d4f129ce0e815fa603",
  ); // Setting your secret API key from env var
const account = new Account(client);
const users = new Users(client);
const databases = new Databases(client);

const database_id = '651c1d7b8872bb9d837d';
const studentTable_id = '6548e21e893779dbcca3';
const parentsTable_id = '6548e10fc68f20dd704b';
const ENCRYPTION_KEY =
  "52df024d6e080b90d6b2c03816793613a52e5a54d5ca7d6fad39fc8a3e339c69";

export {
  client,
  account,
  users,
  databases,
  database_id,
  studentTable_id,
  parentsTable_id,
  ENCRYPTION_KEY,
};
