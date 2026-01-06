const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prefer CJS entry points so packages like Zustand don't pull ESM builds
// that rely on import.meta in web bundles.
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
