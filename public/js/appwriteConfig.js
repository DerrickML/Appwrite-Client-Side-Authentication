// appwriteConfig.js
import { Client, Account } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Setting your Appwrite endpoint from env var
  .setProject('651413f38aee140189c2') // Setting your project ID from env var
// .setEndpoint('http://localhost/v1') // Setting your Appwrite endpoint from env var
// .setProject('651c19d1dfd60ba38d55') // Setting your project ID from env var
// .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint from env var
// .setProject(process.env.APPWRITE_PROJECT_ID); // Your project ID from env var

const account = new Account(client)

export { client, account }
