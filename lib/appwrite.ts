import { Client, Account, ID } from "react-native-appwrite";
import { useEndpointStore } from "@/lib/endpoint";
const { endpoint } = useEndpointStore.getState();
export const client = new Client()
  .setEndpoint(endpoint.url)
  .setProject("chatly")
  .setPlatform("tg.chatly");
