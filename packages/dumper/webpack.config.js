const { merge } = require('webpack-merge');
const { BannerPlugin } = require('webpack');

module.exports = (config) => {
  return merge(config, {
    plugins: [
      new BannerPlugin({
        banner: '#!/usr/bin/env node',
        include: ['cli.js'],
        raw: true,
      }),
    ],
  });
};
