import PresentationToSchedule from './presentationToSchedule';

export default class ScheduledPresentation {

  presentationToSchedule: PresentationToSchedule;
  dateTime: Date;                         // date/time of event start: 2017-02-23T08:00:00
  duration: number;                       // duration in minutes
  allDayEveryDay: boolean;                //
  recurrence: boolean;                    //
  recurrencePattern: string;              // Daily or Weekly
  recurrencePatternDaily: string;         // EveryDay, EveryWeekday, EveryWeekend
  recurrencePatternDaysOfWeek: number;    // bitmask indicating days of week when recurrencePattern is weekly
                                          // Sunday=1, Monday=2, Tuesday=4, etc.
  recurrenceStartDate: Date;              // midnight of day recurring event starts: 2017-02-20T00:00:00
  recurrenceGoesForever: boolean;         //
  recurrenceEndDate: Date;                // midnight of day recurring event ends
  interruption: boolean;                  //

  constructor(presentationToSchedule: PresentationToSchedule,
              dateTime: Date,
              duration: number,
              allDayEveryDay: boolean,
              recurrence: boolean,
              recurrencePattern: string,
              recurrencePatternDaily: string,
              recurrencePatternDaysOfWeek: number,
              recurrenceStartDate: Date,
              recurrenceGoesForever: boolean,
              recurrenceEndDate: Date,
              interruption: boolean) {

    this.presentationToSchedule = presentationToSchedule;
    this.dateTime = dateTime;
    this.duration = duration;
    this.allDayEveryDay = allDayEveryDay;
    this.recurrence = recurrence;
    this.recurrencePattern = recurrencePattern;
    this.recurrencePatternDaily = recurrencePatternDaily;
    this.recurrencePatternDaysOfWeek = recurrencePatternDaysOfWeek;
    this.recurrenceStartDate = recurrenceStartDate;
    this.recurrenceGoesForever = recurrenceGoesForever;
    this.recurrenceEndDate = recurrenceEndDate;
    this.interruption = interruption;
  }

}