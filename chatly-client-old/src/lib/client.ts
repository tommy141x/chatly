import debounce from "debounce";
import store from "@/lib/store";
import { setTitleBar } from "@/components/titlebar";
import axios from "axios";

const pingServer = debounce(
  async function () {
    let serverURL = store.getState("server").value.url;
    try {
      const response = await axios.get(`${serverURL}/api/ping`);
      let server = {
        url: serverURL,
        name: response.data.server_name,
        description: response.data.server_description,
      };
      return server; // Return the server object
    } catch (error) {
      console.error("Failed to ping server:", error);
      return false; // Return false on error
    }
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
      setTitleBar();
      return false;
    }
  } catch (error) {
    setTitleBar();
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
    setTitleBar();
  } catch (error) {
    store.setState("user", {});
    store.setState("session", "");
    setTitleBar();
    console.error("Logout error:", error);
  }
};

export { pingServer, logout, validateUser };
