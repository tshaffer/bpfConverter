import isomorphicPath from 'isomorphic-path';
import thunkMiddleware from 'redux-thunk';

import { cloneDeep } from 'lodash';
import { isObject } from 'lodash';

import { AssetLocation, AssetType } from '@brightsign/bscore';
import { BsAssetCollection, getBsAssetCollection } from '@brightsign/bs-content-manager';
import {
  dmOpenSign,
  DmState,
} from '@brightsign/bsdatamodel';

import {
  bpfToJson,
  isXml,
} from './bpfToJson';

import { generateDmStateFromBpf } from './bpfToDmStateConverter';

export function bsBpfCConvertPresentation(buffer: Buffer) : Function {

  return (dispatch : Function, getState : Function) : Promise<void> => {

    return new Promise((resolve, reject) => {

      // determine whether data in buffer represents bpf
      isXml(buffer).then( (bufferIsXml : boolean) => {

        if (bufferIsXml) {

          // buffer contains xml. assume it's a BA classic presentation.
          // TODO - further verification / validation required.

          // if bpf xml, convert to json
          bpfToJson(buffer).then( (bpf : any) => {

            // convert bpf json to dmState.
            dispatch(generateDmStateFromBpf(bpf)).then( () => {
              resolve();
            });
          });
        }
      });
    });
  };
}

function getLocalContentCollection(path: string): BsAssetCollection {
  return getBsAssetCollection(AssetLocation.Local, [
      AssetType.Content,
      AssetType.Project,
      AssetType.ProjectBpf,
      AssetType.BrightScript,
      AssetType.HtmlSite,
      AssetType.Font,
      AssetType.Folder
    ],
    path, {folders: false});
}

const createProjectFileState = (bsDmState: DmState): Object => {
  if (!isObject(bsDmState)){
    throw 'TODO error'; // TODO implement error;
  }
  return {
    bsdm: bsDmState
  };
};

