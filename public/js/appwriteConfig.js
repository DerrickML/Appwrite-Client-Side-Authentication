// appwriteConfig.js
import { Client, Account, Databases, Permission, Role, Query } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Setting your Appwrite endpoint from env var
  .setProject('651413f38aee140189c2') // Setting your project ID from env var
// .setEndpoint('http://localhost/v1') // Setting your Appwrite endpoint from env var
// .setProject('651c19d1dfd60ba38d55') // Setting your project ID from env var
// .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint from env var
// .setProject(process.env.APPWRITE_PROJECT_ID); // Your project ID from env var

const account = new Account(client)
const databases = new Databases(client)

const database_id = '651417820a07629ea837';
const studentTable_id = '65420efe2297cbf6acf0';

export { client, account, databases, database_id, studentTable_id, Permission, Role, Query }
