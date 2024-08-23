import { newRidgeState } from "react-ridge-state";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_STORAGE_KEY = "session";

export const sessionState = newRidgeState<string | null>(null, {
  onSet: async (newState) => {
    try {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, newState);
    } catch (e) {
      console.error("Error saving session state:", e);
    }
  },
});

async function setInitialSessionState() {
  try {
    const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      sessionState.set(storedSession);
    }
  } catch (e) {
    console.error("Error loading initial session state:", e);
  }
}

setInitialSessionState();

export { setInitialSessionState };
