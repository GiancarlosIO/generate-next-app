const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  env: {
    REST_ENDPOINT: process.env.REST_ENDPOINT,
    GRAPHQL_ENDPOINT: process.env.REST_ENDPOINT,
  },
  webpack: config => {
    config.resolve.plugins = [
      ...config.resolve.plugins,
      new TsconfigPathsPlugin({
        configFile: './tsconfig.paths.json',
      }),
    ];
    config.plugins = [...config.plugins];

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      include: [/src/],
      loader: 'graphql-tag/loader',
    });

    return config;
  },
};

module.exports = config;