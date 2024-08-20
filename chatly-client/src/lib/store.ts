import { createStore } from "state-pool";
const store = createStore();
store.setState("count", 0);

export default store;
