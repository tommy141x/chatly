import { newRidgeState } from "react-ridge-state";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "endpoint";

export const endpointState = newRidgeState<string | null>(null, {
  onSet: async (newState) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(newState));
    } catch (e) {
      console.error("Error saving endpoint state:", e);
    }
  },
});

async function setInitialEndpointState() {
  try {
    const endpoint = await AsyncStorage.getItem(KEY);
    if (endpoint) {
      endpointState.set(JSON.parse(endpoint));
    } else {
      endpointState.set({
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
