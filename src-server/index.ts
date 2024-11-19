import { init } from "@/lib/init";

const sdk = require("node-appwrite");
const client = new sdk.Client();

client
  .setEndpoint("http://appwrite/v1")
  .setProject(process.env._APPWRITE_PROJECT_ID)
  .setKey(process.env._APPWRITE_API_KEY);

// Init Appwrite
init(client);
