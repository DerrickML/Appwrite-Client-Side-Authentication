// appwriteConfig.js
import { Client, Account} from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint from env var
  .setProject(process.env.APPWRITE_PROJECT_ID); // Your project ID from env var

const account = new Account(client);

export { client, account };
