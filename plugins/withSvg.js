const { withPlugins } = require("@expo/config-plugins");

/**
 * Config plugin to automatically configure react-native-svg
 */
const withSvg = (config) => {
  // No custom configuration needed for react-native-svg as it's auto-linked
  // in the Expo managed workflow. This plugin serves as a placeholder to
  // ensure the package is recognized in the Expo config.
  console.log("Configuring react-native-svg...");
  return config;
};

module.exports = withSvg;
