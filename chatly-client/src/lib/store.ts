import { createStore } from "state-pool";
const store = createStore();
store.setState("count", 0);
store.setState("server", {
  url: "http://localhost:3000",
  name: "My Server",
  description: "This is my server.",
});

export default store;
