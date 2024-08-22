import { ExpoConfig, ConfigContext } from "expo/config";
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  endpoint: "http://localhost:3000",
  socket: "http://localhost:3000",
});
