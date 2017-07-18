import fs = require('fs');
// import path = require('path');
const xml2js = require('xml2js');

export function importBPF(pathToBpf: string): Promise<any> {
  return new Promise((resolve) => {
    readBPF(pathToBpf).then((bpf : any) => {
      console.log(bpf);
      resolve();
    });
  });
}

function readBPF(bpfFilePath: string = '') : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(bpfFilePath, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        try {
          let parser = new xml2js.Parser();
          parser.parseString(buf, (err: any, bpf: any) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(bpf);
          });
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}


