const fs = require('fs');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');

const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHosts) {
  return {
    host,
    proxy,
    hot: true,
    allowedHosts: [
      ...allowedHosts,
      'b0d3-31-154-29-254.ngrok-free.app',
    ],
    compress: true,
    https: getHttpsConfig(),
    historyApiFallback: { disableDotRule: true, index: paths.publicUrlOrPath },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) throw new Error('webpack-dev-server is not defined');

      if (fs.existsSync(paths.proxySetup)) require(paths.proxySetup)(devServer.app);
      middlewares.push(
          errorOverlayMiddleware(),
          evalSourceMapMiddleware(devServer),
          redirectServedPath(paths.publicUrlOrPath),
          noopServiceWorkerMiddleware(paths.publicUrlOrPath),
      );

      return middlewares;
    },
    // sockPath,
    // sockPort,
    // sockHost,
    // quiet: true,
    // overlay: false,
    // transportMode: 'ws',
    // injectClient: false,
    // clientLogLevel: 'none',
    // watchContentBase: true,
    // contentBase: paths.appPublic,
    // contentBasePublicPath: paths.publicUrlOrPath,
    // publicPath: paths.publicUrlOrPath.slice(0, -1),
    // watchOptions: { ignored: ignoredFiles(paths.appSrc) },
    // disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
  };
};
