import {
  AudioOutputSelectionType,
  AudioModeType,
  AudioMappingType,
  AudioMixModeType,
} from '@brightsign/bscore';

export function stringToBool(s : string) : boolean {
  return (s.toLowerCase() === 'true');
}

export function stringToNumber(s : string) : number {
  return (Number(s));
}

export function getAudioMixMode(bacAudioMixMode : string) : AudioMixModeType {
  switch (bacAudioMixMode) {
    case 'Stereo': {
      return AudioMixModeType.Stereo;
    }
    case 'Left': {
      return AudioMixModeType.Left;
    }
    case 'Right': {
      return AudioMixModeType.Right;
    }
  }
}

export function getAudioMapping(bacAudioMapping : string) : AudioMappingType {
  switch (bacAudioMapping) {
    case 'Audio-1': {
      return AudioMappingType.Audio1;
    }
    case 'Audio-2': {
      return AudioMappingType.Audio2;
    }
    case 'Audio-3': {
      return AudioMappingType.Audio3;
    }
    case '0?': {
      return AudioMappingType.AudioAll;
    }
  }
}

// TODO - Multichannel Surround??
export function getAudioMode(bacAudioMode : string) : AudioModeType {
  switch (bacAudioMode) {
    case 'Multichannel Surround': {
      return AudioModeType.Surround;
    }
    case '0?': {
      return AudioModeType.Stereo;
    }
    case '1?': {
      return AudioModeType.NoAudio;
    }
    case '2?': {
      return AudioModeType.Left;
    }
    case '3?': {
      return AudioModeType.Right;
    }
  }
}

export function getAudioOutput(bacAudioOutput : string) : AudioOutputSelectionType {
  switch (bacAudioOutput) {
    case 'Analog Audio': {
      return AudioOutputSelectionType.Analog;
    }
    case '0?': {
      return AudioOutputSelectionType.Usb;
    }
    case '1?': {
      return AudioOutputSelectionType.DigitalPcm;
    }
    case '2?': {
      return AudioOutputSelectionType.DigitalAc3;
    }
    case '3?': {
      return AudioOutputSelectionType.AnalogHdmiAc3;
    }
  }
}

