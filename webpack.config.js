const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = (env) => {
  let userEnv = 'development';

  if (env.NODE_ENV !== undefined) {
    userEnv = env.NODE_ENV;
  }

  const target = 'site';

  if (target === 'umd') {
    return {
      mode: userEnv,
      devtool: env.DEV_TOOL,
      entry: './src/nanno.js',
      output: {
        path: path.resolve(__dirname, 'site/nanno-js/dist/umd/'),
        filename: 'nanno.js',
        library: 'nanno',
        libraryTarget: 'umd',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                cacheDirectory: true,
              },
            },
          }
        ],
      }
    };
  } else if (target === 'window') {
    return {
      mode: userEnv,
      devtool: env.DEV_TOOL,
      entry: './src/nanno-standalone.js',
      output: {
        path: path.resolve(__dirname, 'site/nanno-js/dist/window/'),
        filename: 'nanno.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                cacheDirectory: true,
              },
            },
          }
        ],
      }
    };
  } else if(target === 'site') {
    const BASE_PATH = `site/nanno-js/dist/site/`;

    return {
      mode: userEnv,
      devtool: env.DEV_TOOL,
      entry: {
        playground: './src/site/playground.js',
        'demo-import': './src/site/demo-import.js',
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, BASE_PATH),
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                cacheDirectory: true,
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          }, {
            test: /\.ttf$/,
            use: ['file-loader'],
          },
        ],
      },
      plugins: [
        new MonacoWebpackPlugin(),
      ],
    };
  }
};
