export as namespace bsPlayerObjects;

export class BSTicker {
  constructor(left: number, top: number, width: number, height: number, rotation: number);

  SetRectangle(left: number, top: number, width: number, height: number): boolean;
  AddString(str: string): boolean;
  PopStrings(count: number): boolean;
  SetForegroundColor(argb: number): boolean;
  SetForegroundColor(a: number, r: number, g: number, b: number): boolean;
  SetBackgroundColor(argb: number): boolean;
  SetBackgroundColor(a: number, r: number, g: number, b: number): boolean;
  SetSeparatorString(str: string): boolean;
  SetSeparatorCircle(): boolean;
  SetSeparatorDiamond(): boolean;
  SetSeparatorSquare(): boolean;
  SetPixelsPerSecond(pps: number): number;
  SetFont(filePath: string): boolean;
  SetMultiscreen(offset: number, size: number, ipAddress: string, port: number): boolean;
  Shutdown(): void;
}
