import debounce from "debounce";
import store from "@/lib/store";
import axios from "axios";

const pingServer = debounce(
  function () {
    return new Promise(async (resolve, reject) => {
      let server = store.getState("server").value;
      try {
        const response = await axios.get(`${server.url}/api/ping`);
        server.name = response.data.server_name;
        server.description = response.data.server_description;
        store.setState("server", server);
        resolve(response.data); // Resolve with the fetched data
      } catch (error) {
        console.error("Failed to ping server:", error);
        reject(error.response?.data || error); // Reject with the error data or error
      }
    });
  },
  1000,
  { immediate: true },
);

const logout = async () => {
  const server = store.getState("server").value;
  const user = store.getState("user").value;

  try {
    await axios.post(`${server.url}/api/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${user.sessionToken}`,
      },
    });

    store.setState("user", {});
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export { pingServer, logout };
