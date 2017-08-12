
export interface BsDeviceInfo {
  model : string;
  version : string;
  deviceUptime : number;
  deviceLifetime : number;
  deviceBootCount : number;
  bootVersion : string;
  deviceUniqueId : string;
  family : string;
};

export interface BSNetworkInterfaceConfig {
  metric : number;
  dhcpServerConfig : any;
  dnsServerList : string[];
  ipAddressList : any[];
  inboundShaperRate : number;
  mut: number;
  vlanIdList : number[];
  clientIdentifier : string;
  domain : string;
}

export interface BsRegistry {
  read(sectionName : string, key : string) : Promise<string>;
  write(sectionName : string, key : string, value : string) : Promise<any>;
}