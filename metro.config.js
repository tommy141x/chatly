// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// --- burnt ---
config.resolver.sourceExts.push("mjs");
config.resolver.sourceExts.push("cjs");
// --- end burnt ---

module.exports = withNativeWind(config, { input: "./global.css" });
