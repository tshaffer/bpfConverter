import {
  AudioOutputSelectionType,
  AudioModeType,
  AudioMappingType,
  AudioMixModeType,
  TransitionType,
  ViewModeType,
} from '@brightsign/bscore';

export function stringToBool(s : string) : boolean {
  return (s.toLowerCase() === 'true');
}

export function stringToNumber(s : string) : number {
  return (Number(s));
}

/*
next appropriate step might be to create a mapping from
  UI choices in BA -> parameters set in bpf and associated values
 */

/*
List the different audio player functions. For each function, list their parameters in
    docs.brightsign.biz (if it exists)
    autorun.brs
    bscore/index.d.ts

 http://docs.brightsign.biz/display/DOC/roAudioPlayer

 SetPcmAudioOutputs

 SetCompressedAudioOutputs

 SetMultichannelAudioOutputs

 SetAudioOutput

 SetAudioMode

 MapStereoOutput

 MapDigitalOutput

 SetStereoMappingSpan
 */

/*
  autorun / BA
    SetAudioOutputAndMode
      Arrays
        pcm
        compressed
        multichannel

      roAudioOutput - instances can be pushed onto pcm, compressed, multichannel arrays
        Analog:1 - analogOutput in the xml - one of AudioOutputType enums (true for all under roAudioOutput)
        Analog:2 - analog2Output
        Analog:3 - analog3Output
        HDMI - hdmiOutput
        SPDIF - spdifOutput
        USB:A.0 - usbOutputA
        USB:B.0 - usbOutputB
        USB:C.0 - usbOutputC
        USB:D.0 - usbOutputD

      SetPcmAudioOutputs(pcm)
      SetCompressedAudioOutputs(compressed)
      SetMultichannelAudioOutputs(multichannel)

      AudioModeSelection
        MultichannelSurround
        MixedDownToStereo
        NoAudio
        MonoLeftMixdown
        MonoRightMixdown

      SetAudioMode(0) - passthrough
      SetAudioMode(3) - left
      SetAudioMode(4) - right
      SetAudioMode(1) - default

      online docs:
          0: AC3 Surround
          1: AC3 mixed down to stereo
          2: No audio
          3: Left
          4: Right

      Do these different labels for Audio Mode imply an inconsistency? No, I think they're okay.

    SetAudioOutput - obsolete?
      BA / autorun
        AudioOutputType
          PCM
          Passthrough
          Multichannel
          None

    MapStereoOutput - ** these are inconsistent
      0: Stereo audio is mapped to onboard analog output.
      1: Stereo audio is mapped to left output of the expansion module.
      2: Stereo audio is mapped to middle output of the expansion module.
      3: Stereo audio is mapped to right output of the expansion module.

      "Audio-1" = AudioZone.AudioMappingSelection.Audio1 - 0
      "Audio-2" = AudioZone.AudioMappingSelection.Audio2 - 1
      "Audio-3" = AudioZone.AudioMappingSelection.Audio3 - 2
      "Audio-all" = AudioZone.AudioMappingSelection.AudioAll - 3

    MapDigitalOutput
      0: Onboard HDMI
      1: SPDIF from expansion module

SetStereoMappingSpan
      1: normal
      3: audio all and other requirements (see GetAudioMappingSpan)
 */
export function getAudioMixMode(bacAudioMixMode : string) : AudioMixModeType {
  /*
      Stereo, Left, Right correspond to AudioZone enum AudioMixMode

      however, the following is the code in autorun

       if lcase(m.audioMixMode$) = "passthrough" then
          player.SetAudioMode(0)
       else if lcase(m.audioMixMode$) = "left" then
          player.SetAudioMode(3)
       else if lcase(m.audioMixMode$) = "right" then
          player.SetAudioMode(4)
       else
          player.SetAudioMode(1)
       endif

      and see the notes above. seems like the choices ought to be
        0: AC3 Surround
        1: AC3 mixed down to stereo
        2: No audio
        3: Left
        4: Right

      bscore seems wrong

      how does this work in BA? seems wrong.

      well, BrightAuthorUtils.cs#GetAudioModeSpec returns the appropriate values

      definitely confusing - need to examine through debugger
   */
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

export function getTransitionType(bacTransition : string) : TransitionType {
  switch (bacTransition) {
    case 'No effect':
      return TransitionType.NoEffect;
    default:
      return TransitionType.NoEffect;
  }
}

export function getViewMode(bpfViewMode : string) : ViewModeType {

  let viewMode: ViewModeType;
  switch (bpfViewMode) {
    case 'Fill Screen and Centered': {
      viewMode = ViewModeType.FillAndCenter;
      break;
    }
    case 'Scale to Fill': {
      viewMode = ViewModeType.ScaleToFill;
      break;
    }
    default: {
      viewMode = ViewModeType.Letterboxed;
      break;
    }
  }
  return viewMode;
}

export function getAudioOutput(bpfAudioOutput : string) : AudioOutputSelectionType {
  switch (bpfAudioOutput) {
    case 'Analog Audio':
    default:
      return AudioOutputSelectionType.Analog;
    case 'USB Audio':
      return AudioOutputSelectionType.Usb;
    case 'SPDIF Audio with Stereo PCM (HDMI Audio)':
      return AudioOutputSelectionType.DigitalPcm;
    case 'SPDIF Audio, Raw Multichannel':
      return AudioOutputSelectionType.DigitalAc3;
    case 'Analog Audio with Raw Multichannel on SPDIF':
      return AudioOutputSelectionType.AnalogHdmiAc3;
  }
}

export function getAudioMode(bpfAudioMode : string) : AudioModeType {
  switch (bpfAudioMode) {
    case 'Multichannel Surround':
      return AudioModeType.Surround;
    case 'Multichannel Mixed Down to Stereo':
    default:
      return AudioModeType.Stereo;
    case 'No Audio':
      return AudioModeType.NoAudio;
    case 'Mono Left Mixdown':
      return AudioModeType.Left;
    case 'Mono Right Mixdown':
      return AudioModeType.Right;
  }
}

export function getAudioMapping(bpfAudioMapping : string) : AudioMappingType {
  switch (bpfAudioMapping) {
    case 'Audio-1':
      return AudioMappingType.Audio1;
    case 'Audio-2':
      return AudioMappingType.Audio2;
    case 'Audio-3':
      return AudioMappingType.Audio3;
    case 'Audio-all':
      return AudioMappingType.AudioAll;
  }
}