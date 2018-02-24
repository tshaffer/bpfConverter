import * as fse from 'fs-extra';
import * as path from 'path';

import {
  bscAssetLocatorForLocalAsset,
  AssetLocation,
  AssetType,
  projectFileSuffixes,
  projectBpfFileSuffixes
} from '@brightsign/bscore';

import {
  biDeleteOpenPresentationSession,
  biFindBrokenLinks,
  biCreateOpenPresentationFromBpfxStateSession,
  biCreateOpenPresentationFromBufferSession,
  biFixBrokenLinks,
  biLaunchPresentationOpener,
  biGetPresentationOpenerStatus,
  biGetNumberOfBrokenLinks,
  biGetBrokenLinksExist,
  biGetBrokenLinkFilePath,
  biGetProjectFileState,
  BiPresentationOpenState,
} from '@brightsign/bpfimporter';

import {
  BsAssetLocator,
} from '@brightsign/bscore';

import {
  BsAsset,
  getBsAssetForLocalFile,
} from '@brightsign/bs-content-manager';

let bsPresentationPath: string = '';
let bsPresentationAsset: BsAsset = null;
let bsPresentationAssetLocator: BsAssetLocator = null;

// import { getLocalSystemScopeId } from '@brightsign/fsconnector';

export const convertBpf = (path: string) => {
  return (dispatch: any) => {
    bsPresentationPath = path;
    readFileAsBuffer(path)
      .then((buf: any) => {
        const token : string = biCreateOpenPresentationFromBufferSession(buf);
        biLaunchPresentationOpener(token).then(() => {
          // const localScopeId = getLocalSystemScopeId();
          const bsAsset: BsAsset = getBsAssetForLocalFile(path);
          const assetLocator : BsAssetLocator = bscAssetLocatorForLocalAsset(AssetType.Project, path);

          bsPresentationAsset = bsAsset;
          bsPresentationAssetLocator = assetLocator;

          // dispatch(onPresentationOpenerStatusUpdated(token, assetLocator, false));
          dispatch(onPresentationOpenerStatusUpdated(token, null, false));
        }).catch((err: any) => {
          console.log(err);
          debugger;
        });
      }).catch((err: any) => {
      console.log(err);
      debugger;
    });
  };
}

function onPresentationOpenerStatusUpdated(token : string, assetLocator : BsAssetLocator, dialogOpen : boolean) {

  return (dispatch: Function) => {

    const presentationOpenState: BiPresentationOpenState = biGetPresentationOpenerStatus(token);

    if (presentationOpenState === BiPresentationOpenState.Complete) {

      // if no broken links, close dialog box
      // if (dialogOpen) {
      //   dispatch(closeFixBrokenLinksDialog());
      // }

      const bpfxState = biGetProjectFileState(token);

      console.log(bsPresentationAsset);
      console.log(bsPresentationAssetLocator);

      debugger;

      const dirname: string = path.dirname(bsPresentationPath);
      const presentationName: string = path.basename(bsPresentationPath, '.bpf');
      const newPath: string = path.join(dirname, presentationName + '.bpfx');

      const bpfxStr = JSON.stringify(bpfxState, null, '\t');
      fse.writeFile(newPath, bpfxStr, (err: any) => {
        if (err) {
          console.log(err);
          debugger;
        }
        console.log('write complete');
      });

      // hashHistory.push({
      //   pathname: '/presentation/edit',
      //   state: {
      //     isSaved: true,
      //     assetLocator,
      //     bpfxState,
      //   }
      // });
      // dispatch(clearPresentationOpenStatus());
      // dispatch(setPresentationLoaded());
      biDeleteOpenPresentationSession(token);
    }
    else if (presentationOpenState === BiPresentationOpenState.BrokenLinksPending) {
      // set presentation opener status and open / update dialog box

      // TODO - Review!
      // getBsAssetForAssetLocator(assetLocator).then( (bsAsset: BsAsset) => {
      //   if (isObject(bsAsset)) {
      //     dispatch(setPresentationOpenStatus(token,
      //       {
      //         numberOfBrokenLinks: biGetNumberOfBrokenLinks(token),
      //         brokenLinksExist: biGetBrokenLinksExist(token),
      //         brokenLinkFilePath: biGetBrokenLinkFilePath(token),
      //         presentationFilePath: bsAsset.fullPath,
      //       }));
      //     if (!dialogOpen) {
      //       dispatch(openFixBrokenLinksDialog());
      //     }
      //   }
      // });
    }
  };
}

function readFileAsBuffer(filePath = '') {
  return new Promise((resolve) => {
    readFsFileAsBuffer(filePath).then((buf) => {
      resolve(buf);
    });
  });
}

const readFsFileAsBuffer = (filePath = '') => {
  return new Promise((resolve, reject) => {
    fse.readFile(filePath, (err: any, buf: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
};

