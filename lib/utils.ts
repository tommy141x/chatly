import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { setTitleBar } from "@/components/titlebar";
import { useSessionStore } from "@/lib/session";
import { useEndpointStore } from "@/lib/endpoint";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { Client, Account, Session } from "react-native-appwrite";
import { client } from "@/lib/appwrite";
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}

export const isWindowSmall = () => {
  return window.innerWidth < 700;
};

export const pingServer = async () => {
  const { endpoint } = useEndpointStore.getState();
  try {
    const response = await fetch(`${endpoint.url}/health/version`);
    return response.ok;
  } catch (error) {
    console.error("Failed to ping server:", error);
    return false;
  }
};

export const validateUser = async () => {
  try {
    const account = new Account(client);
    const userData = await account.get();
    console.log(userData);
    if (userData) {
      return userData;
    } else {
      setTitleBar();
      return false;
    }
  } catch (error) {
    setTitleBar();
    return false;
  }
};

export const logout = async () => {
  const { session, clearSession } = useSessionStore.getState();
  try {
    const account = new Account(client);
    await account.deleteSession(session);
    clearSession();
  } catch (error) {
    clearSession();
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
