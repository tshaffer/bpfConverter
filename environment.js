const config = {
  env: process.env.NODE_ENV || 'development',
  platform: process.env.PLATFORM || 'desktop'
};

// ------------------------------------
// ENVIRONMENT / DEPENDENCY VARIABLES
// ------------------------------------

const BS_DEVICE_ARTIFACT_PATH = JSON.stringify('./build/static');//TODO windows dev case
const TMP = JSON.stringify('./temp');//TODO windows dev case

config.globals = {
  'process.env': {
    'BS_DEVICE_ARTIFACT_PATH': BS_DEVICE_ARTIFACT_PATH,
    'TMP': TMP,
  },
  '__DEV__': config.env === 'development',
  '__PLATFORM__': JSON.stringify(config.platform)
};

module.exports = config;
