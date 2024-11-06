import { create } from "zustand";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "apiendpoint";

// Define the type for the endpoint object
interface Endpoint {
  name: string;
  description: string;
  url: string;
}

interface EndpointState {
  endpoint: Endpoint | null;
  setEndpoint: (newState: Endpoint | null) => void;
}

export const useEndpointStore = create<EndpointState>((set) => ({
  endpoint: {
    name: "Chatly",
    description: "A chat application",
    url: Constants.expoConfig?.endpoint || "",
  },
  setEndpoint: async (newState: Endpoint | null) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(newState));
      set({ endpoint: newState });
    } catch (e) {
      console.error("Error saving endpoint state:", e);
    }
  },
}));

// Function to set initial endpoint state
async function setInitialEndpointState() {
  try {
    const savedEndpoint = await AsyncStorage.getItem(KEY);
    const { setEndpoint } = useEndpointStore.getState();
    if (savedEndpoint) {
      setEndpoint(JSON.parse(savedEndpoint));
    } else {
      setEndpoint({
        name: "Chatly",
        description: "A chat application",
        url: Constants.expoConfig?.endpoint || "",
      });
    }
  } catch (e) {
    console.error("Error loading initial endpoint state:", e);
  }
}

setInitialEndpointState();

export { setInitialEndpointState };
