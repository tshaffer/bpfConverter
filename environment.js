// const config = {
//   env: process.env.NODE_ENV || 'development',
//   mode: process.env.DEPLOYMENT_MODE || 'hmr',
//   port: process.env.PORT || 3000,
//   platform: process.env.PLATFORM || 'desktop'
// };

// // ------------------------------------
// // ENVIRONMENT / DEPENDENCY VARIABLES
// // ------------------------------------

// let TMP = JSON.stringify('');//webtop no-op
// if(config.platform === 'desktop' && config.env === 'development'){//dev desktop variable
//   TMP = JSON.stringify('./temp');//TODO windows dev case
// } else if(config.platform === 'desktop' && config.env === 'production'){//production desktop variable
//   TMP = `require('electron').remote.app.getAppPath().replace('app.asar', 'app.asar.unpacked')`;
// }

// let BS_DEVICE_ARTIFACT_PATH = JSON.stringify('./static');//webtop case
// if(config.platform === 'desktop' && config.env === 'development'){//dev desktop variable
//   BS_DEVICE_ARTIFACT_PATH = JSON.stringify('./dist/static');//TODO windows dev case
// } else if(config.platform === 'desktop' && config.env === 'production'){//production desktop variable
//   BS_DEVICE_ARTIFACT_PATH = `require('electron').remote.app.getAppPath() + (navigator.userAgent.indexOf('Windows') > -1 ? '\\\\static' : '/static')`;
// }
// config.globals = {
//   'process.env': {
//     'BS_DEVICE_ARTIFACT_PATH': BS_DEVICE_ARTIFACT_PATH,
//     'TMP': TMP,
//   },
//   '__DEV__': config.env === 'development',
//   '__PLATFORM__': JSON.stringify(config.platform)
// };

var bsDeviceArtifactPath = JSON.stringify('./dist/static');

var bsDeviceArtifactPathElement = {};
bsDeviceArtifactPathElement['BS_DEVICE_ARTIFACT_PATH'] = bsDeviceArtifactPath;

var config = {};
config.globals = {};
config.globals['process.env'] = bsDeviceArtifactPathElement;

module.exports = config;
