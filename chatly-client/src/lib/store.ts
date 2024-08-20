import { createStore } from "state-pool";
import debounce from "debounce";

const store = createStore();

store.persist({
  PERSIST_ENTIRE_STORE: false, // Change this to true if you want to persist the entire store
  saveState: debounce((key, value, isInitialSet) => {
    const doStateSaving = () => {
      try {
        const serializedState = JSON.stringify(value);
        window.localStorage.setItem(key, serializedState);
      } catch {
        // Ignore write errors
      }
    };

    if (isInitialSet) {
      // Save initial state immediately
      doStateSaving();
    } else {
      // Debounce subsequent saves
      doStateSaving();
    }
  }, 1000), // Adjust debounce time as needed
  loadState: function (key, noState) {
    try {
      const serializedState = window.localStorage.getItem(key);
      if (serializedState === null) {
        // No state saved
        return noState;
      }
      return JSON.parse(serializedState);
    } catch {
      // Failed to load state
      return noState;
    }
  },
  removeState: function (key) {
    window.localStorage.removeItem(key);
  },
  clear: function () {
    window.localStorage.clear();
  },
});

store.setState(
  "server",
  {
    url: import.meta.env.VITE_DEFAULT_API_ENDPOINT,
    name: "Chatly",
    description: "A chat application.",
  },
  { persist: true },
);

store.setState(
  "user",
  {
    username: "Guest",
    token: "",
  },
  { persist: true },
);

export default store;
