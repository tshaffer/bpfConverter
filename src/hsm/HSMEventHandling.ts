import {
  EventType,
  ButtonPanelName,
} from '@brightsign/bscore';

import { BSP } from '../app/bsp';

import {
  ArEventType,
} from '../types/index';

export function addEventHandlers(bsp : any) {
    
  if (bsp.bp900ControlPort0) {
    bsp.bp900ControlPort0.oncontroldown = function(e : any){
      console.log('### oncontroldown ' + e.code);
      const newtext = " DOWN: " + e.code + "\n";
      console.log(newtext);

      const event : ArEventType = {
        EventType: EventType.Bp,
        EventData: {
          ButtonPanelName: ButtonPanelName.Bp900a,
          ButtonIndex: e.code
        }
      };

      bsp.dispatchPostMessage(event);
    };
  }  
}



  