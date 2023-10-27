// Importing required modules and dotenv package
import { Client, Users, Account } from 'node-appwrite'

// Init SDK
const client = new Client()
  //   .setEndpoint(process.env.APPWRITE_ENDPOINT) // Setting your Appwrite endpoint from env var
  //   .setProject(process.env.APPWRITE_PROJECT_ID) // Setting your project ID from env var
  //   .setKey(process.env.APPWRITE_API_KEY) // Setting your secret API key from env var
  // ;
 
  // .setEndpoint('https://cloud.appwrite.io/v1') // Setting your Appwrite endpoint from env var
  // .setProject('651413f38aee140189c2') // Setting your project ID from env var
  // .setKey(
  //   '70d1462daa53310a65f8f7294464190bd60cbb8ca1a2b5f2b94763b086be5459463c75ae23eeef1e2804ecc8110de3cdc7d9457f15e2608700b8aa1a8db83bd44da2e93d5bbf4f8918dadc2d1f596b74c0e44ac07c9e7296228728e986060f29057a739c2ff62f426ff5cb8c26a1d2eb61af30ba048122b326378df46080aef2'
  // ) // Setting your secret API key from env var
  
  .setEndpoint('http://localhost/v1') // Setting your Appwrite endpoint from env var
  .setProject('651c19d1dfd60ba38d55') // Setting your project ID from env var
  .setKey(
    'c629e40ea639c36aadc2a83fca61b8b789d1a3041dbfc7939218bc3f02c193fde85d3f962b7dcd33e0a13f1c4d3ab13b23f0578c398db1137a4fd8b236c1b4f6c970c8874254e2984b3681edf44c903cc9427d20299a131b971b47276d863db7dd2725b7ba6b25751f355ffd2fd875b665bf19f3244392d4f129ce0e815fa603'
  ) // Setting your secret API key from env var

const account = new Account(client)
const users = new Users(client)

export { client, account, users }
