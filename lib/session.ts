import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_STORAGE_KEY = "session";

// Define the interface for the session state
interface SessionState {
  session: string | null;
  setSession: (newState: string | null) => void;
  clearSession: () => void;
}

// Create the zustand store
export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: async (newState: string | null) => {
    try {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, newState || "");
      set({ session: newState });
    } catch (e) {
      console.error("Error saving session state:", e);
    }
  },
  clearSession: async () => {
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      set({ session: null });
    } catch (e) {
      console.error("Error clearing session state:", e);
    }
  },
}));

// Function to initialize the session state from AsyncStorage
async function setInitialSessionState() {
  try {
    const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    const { setSession } = useSessionStore.getState(); // Access the setSession function
    if (storedSession) {
      setSession(storedSession);
    }
  } catch (e) {
    console.error("Error loading initial session state:", e);
  }
}

setInitialSessionState();

export { setInitialSessionState };
