import { createStore } from "state-pool";
import debounce from "debounce";

const store = createStore();
store.persist({
  PERSIST_ENTIRE_STORE: true,
  saveState: (key, value, isInitialSet) => {
    const doStateSaving = () => {
      try {
        const serializedState = JSON.stringify(value);
        window.localStorage.setItem(key, serializedState);
      } catch (e) {
        console.error(e);
      }
    };

    if (isInitialSet) {
      // Save initial state immediately
      doStateSaving();
    } else {
      // Debounce subsequent saves
      const debouncedSave = debounce(doStateSaving, 1000, { immediate: true });
      debouncedSave();
    }
  },
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

store.setState("server", {
  url: import.meta.env.VITE_DEFAULT_API_ENDPOINT,
  name: "Chatly",
  description: "",
});

store.setState("user", {
  username: "Guest",
});

store.setState("session", "");
export default store;
