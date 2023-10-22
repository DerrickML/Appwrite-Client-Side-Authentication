// Importing required modules and dotenv package
import { Client, Users, Account } from 'node-appwrite'

// Init SDK
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Setting your Appwrite endpoint from env var
  .setProject(process.env.APPWRITE_PROJECT_ID) // Setting your project ID from env var
  .setKey(process.env.APPWRITE_API_KEY) // Setting your secret API key from env var
;

const account = new Account(client)
const users = new Users(client)

export { client, account, users }
