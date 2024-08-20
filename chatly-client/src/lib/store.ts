import { createStore } from "state-pool";
const store = createStore();
store.setState("server", {
  url: import.meta.env.VITE_DEFAULT_API_ENDPOINT,
  name: "Chatly",
  description: "A chat application.",
});

export default store;
