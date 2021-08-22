const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  webpack: config => {
    config.resolve.plugins = [
      ...config.resolve.plugins,
      new TsconfigPathsPlugin({
        configFile: './tsconfig.paths.json',
      }),
    ];
    config.plugins = [...config.plugins];
    return config;
  },
};

module.exports = config;