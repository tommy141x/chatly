import { setTitleBar } from "@/components/titlebar";
import { sessionState } from "@/lib/session";
import { endpointState } from "@/lib/endpoint";
import * as SecureStore from "expo-secure-store";

const isTauri = "__TAURI_INTERNALS__" in window;
export default isTauri; // running on a desktop app or a mobile app - but not in the browser
export const isWeb = !isTauri; // running on the browser on either desktop or mobile - but not as a tauri app

export const isMobile = navigator.maxTouchPoints > 0; // running in mobile either in the browser or as a tauri app
export const isDesktop = !isMobile; // running in desktop either in the browser or as a tauri app

export const isTauriMobile = isTauri && isMobile; // running on mobile as a tauri app - but not on the browser
export const isTauriDesktop = isTauri && isDesktop; // running on desktop as a tauri app - but not on the browser

export const isWebMobile = isWeb && isMobile; // running on mobile in the browser - but not as a tauri app
export const isWebDesktop = isWeb && isDesktop; // running on desktop in the browser - but not as a tauri app

export const pingServer = async () => {
  let endpoint = endpointState.get();
  try {
    const response = await fetch(`${endpoint.url}/api/ping`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return {
      url: endpoint.url,
      name: data.server_name,
      description: data.server_description,
    };
  } catch (error) {
    console.error("Failed to ping server:", error);
    return false;
  }
};

export const validateUser = async () => {
  let endpoint = endpointState.get();
  let session = sessionState.get();

  try {
    const response = await fetch(`${endpoint.url}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${session || ""}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const userData = await response.json();
    if (userData) {
      return userData;
    } else {
      setTitleBar();
      return false;
    }
  } catch (error) {
    setTitleBar();
    console.error("Fetch error:", error.message);
    return false;
  }
};

export const logout = async () => {
  let endpoint = endpointState.get();
  let session = sessionState.get();

  try {
    const response = await fetch(`${endpoint.url}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session || ""}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");

    sessionState.reset();
  } catch (error) {
    sessionState.reset();
    console.error("Logout error:", error);
  }
};
