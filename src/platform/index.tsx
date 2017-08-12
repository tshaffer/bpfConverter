
let platform;

platform = 'desktop';

// platform = 'brightsign';

console.log('attempt to create BS javascript object.');
try {
  var VideoModeClass = require("@brightsign/videomodeconfiguration");
  var vm = new VideoModeClass();
  const deviceInfo = new BSDeviceInfo();
  console.log('deviceInfo creation succeeded, running on a brightSign');
  console.log(deviceInfo);
  platform = 'brightsign';

  vm.getBestMode("hdmi").then((bestMode : any) => {
    console.log(bestMode);
  });

  // test bs object requires

  // const VideoOutputConfiguration = require('@brightsign/videooutput');
  // const voc = new VideoOutputConfiguration('hdmi');
  // voc.getEdid().then((monitorEdid: any) => {
  //   console.log('received edid');
  //   console.log(monitorEdid);
  // });

  // const VideoOutputConfiguration = require('@brightsign/videooutputconfiguration');
  // const voc = new VideoOutputConfiguration('hdmi');
  // voc.getEdid().then((monitorEdid: any) => {
  //   console.log('received edid');
  //   console.log(monitorEdid);
  // });

  // const bsClass0 = require("@brightsign/networkhost");
  // const bsClass1= require("@brightsign/utils");
  // const bsClass2 = require("@brightsign/dws");
  // const bsClass3 = require("@brightsign/networkdiagnostics");
  // const bsClass4 = require("@brightsign/touchscreen");
  // const bsClass5 = require("@brightsign/videoinputconfiguration");
  // const bsClass6 = require("@brightsign/systemtime");
  // const bsClass7 = require("@brightsign/registry");
}
catch (e) {
  console.log('deviceInfo creation failed, not a brightSign');
  platform = 'desktop';
}

let loadedModule = null;
if(platform === 'brightsign'){
  loadedModule = require('./brightsign/index.tsx');
}else{
  loadedModule = require('./desktop/index.tsx');
}
export default loadedModule;
