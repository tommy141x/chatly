import debounce from "debounce";
import store from "@/lib/store";
import axios from "axios";

const pingServer = debounce(
  function () {
    return new Promise(async (resolve, reject) => {
      let serverURL = store.getState("server").value.url;
      try {
        const response = await axios.get(`${serverURL}/api/ping`);
        //server.url = import.meta.env.VITE_DEFAULT_API_ENDPOINT;
        let server = {};
        server.url = serverURL;
        server.name = response.data.server_name;
        server.description = response.data.server_description;
        store.setState("server", server);
        resolve(server); // Resolve with the fetched data
      } catch (error) {
        console.error("Failed to ping server:", error);
        reject(error.response?.data || error); // Reject with the error data or error
      }
    });
  },
  1000,
  { immediate: true },
);

const validateUser = async () => {
  let serverURL = store.getState("server").value.url;
  let session = store.getState("session").value;

  try {
    const userResponse = await axios.get(`${serverURL}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${session || ""}`,
        "Content-Type": "application/json",
      },
    });
    const userData = userResponse.data;
    if (userData) {
      return userData;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Fetch error:", error.message, error.response?.data);
    return false;
  }
};

const logout = async () => {
  const server = store.getState("server").value;
  const session = store.getState("session").value;

  try {
    await axios.post(`${server.url}/api/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    store.setState("user", {});
    store.setState("session", "");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export { pingServer, logout, validateUser };
