import { ExpoConfig, ConfigContext } from "expo/config";

// 🌐 Server API endpoint
const SERVER_API_ENDPOINT = "http://localhost:3000";

// 🔌 Socket server endpoint
const SOCKET_SERVER_ENDPOINT = "http://localhost:7880";

// 📝 Expo configuration (Don't need to change)
const expoConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  endpoint: SERVER_API_ENDPOINT,
  socket: SOCKET_SERVER_ENDPOINT,
});

export default expoConfig;
