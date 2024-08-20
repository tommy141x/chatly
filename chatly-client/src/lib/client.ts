import debounce from "debounce";
import store from "@/lib/store";

const pingServer = debounce(
  function () {
    return new Promise(async (resolve, reject) => {
      let server = store.getState("server").value;

      try {
        const response = await fetch(`${server.url}/api/ping`);
        const data = await response.json();

        server.name = data.server_name;
        server.description = data.server_description;

        if (response.ok) {
          store.setState("server", server);
          console.log("Updated state " + server.name);
          resolve(data); // Resolve with the fetched data
        } else {
          console.error("Failed to ping server:", data);
          reject(data); // Reject with the error data
        }
      } catch (error) {
        console.error("Error pinging server:", error);
        reject(error); // Reject with the error
      }
    });
  },
  1000,
  { immediate: true },
);

export { pingServer };
