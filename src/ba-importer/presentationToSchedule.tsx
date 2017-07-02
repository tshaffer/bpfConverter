export default class PresentationToSchedule {

  name: string;
  fileName: string;
  filePath: string;
  autorunAutoplay: Object;
  bsdm: Object;

  constructor(name: string, fileName: string, filePath: string, autorunAutoplay: Object) {

    this.name = name;
    this.fileName = fileName;
    this.filePath = filePath;
    this.autorunAutoplay = autorunAutoplay;
  }
}
