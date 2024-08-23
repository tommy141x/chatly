process.env.EXPO_ROUTER_APP_ROOT = "../../src";
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["module:react-native-dotenv"],
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./",
          },
        },
      ],
    ],
  };
};
