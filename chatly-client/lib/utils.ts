import { setTitleBar } from "@/components/titlebar";
import { sessionState } from "@/lib/session";
import { endpointState } from "@/lib/endpoint";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Network from "expo-network";
import * as Cellular from "expo-cellular";
// Determine if running within a Tauri app
const isTauri = "__TAURI_INTERNALS__" in window;

// Determine if running in a web environment (browser)
export const isWeb = Platform.OS === "web" && !isTauri;

// Determine if running on a mobile device
export const isMobile = !isWeb && !isTauri;

// Determine if running on a desktop device
export const isDesktop = isTauri;

// Specific cases
export const isTauriMobile = isTauri && isMobile; // Tauri app on mobile
export const isTauriDesktop = isTauri && isDesktop; // Tauri app on desktop

export const isWebMobile = isWeb && isMobile; // Browser on mobile
export const isWebDesktop = isWeb && isDesktop; // Browser on desktop

export default isTauri; // True if running in a Tauri app

export const isWindowSmall = () => {
  return window.innerWidth < 700;
};

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
    //console.error("Failed to ping server:", error);
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
    //console.error("Fetch error:", error.message);
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
    //if (!response.ok) throw new Error("Network response was not ok");
    sessionState.reset();
    //console.log("Reset session", sessionState.get());
  } catch (error) {
    sessionState.reset();
    //console.error("Logout error:", error);
  }
};

export const getDeviceInfo = async () => {
  let deviceInfo = {};

  deviceInfo.ipAddr = (await Network.getIpAddressAsync()) || false;
  deviceInfo.state = (await Network.getNetworkStateAsync()) || false;
  deviceInfo.brand = Device.brand || false;
  deviceInfo.name = Device.deviceName || false;
  deviceInfo.model = Device.modelName || false;

  // TODO: Detect macOS
  deviceInfo.osName = Device.osName || false;

  deviceInfo.osVersion = Device.osVersion || false;

  const allowsVoip = await Cellular.allowsVoipAsync();
  deviceInfo.allowsVoip =
    allowsVoip !== null ? allowsVoip : isDesktop ? true : false;

  deviceInfo.isWeb = isWeb || false;
  deviceInfo.isMobile = isMobile || false;
  deviceInfo.isDesktop = isDesktop || false;
  deviceInfo.isTauri = isTauri || false;

  return deviceInfo;
};

export const fetchPlugins = async () => {
  let endpoint = endpointState.get();
  let session = sessionState.get();

  try {
    const response = await fetch(`${endpoint.url}/api/plugins`, {
      headers: {
        Authorization: `Bearer ${session || ""}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    //load plugins
  } catch (error) {}
};
