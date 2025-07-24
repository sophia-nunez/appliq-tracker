// information can be found from TimeZone API at https://timeapi.io/documentation/iana-timezones

const timeZoneAbbr = {
  // US Time Zones
  EST: "America/New_York",
  EDT: "America/New_York",
  CST: "America/Chicago",
  CDT: "America/Chicago",
  MST: "America/Denver",
  MDT: "America/Denver",
  PST: "America/Los_Angeles",
  PDT: "America/Los_Angeles",
  AKST: "America/Anchorage",
  AKDT: "America/Anchorage",
  HST: "Pacific/Honolulu",

  // Canada
  AST: "America/Halifax",
  ADT: "America/Halifax",
  NST: "America/St_Johns",
  NDT: "America/St_Johns",

  // Europe
  GMT: "Europe/London",
  BST: "Europe/London",
  CET: "Europe/Paris",
  CEST: "Europe/Paris",
  EET: "Europe/Athens",
  EEST: "Europe/Athens",

  // Asia
  IST: "Asia/Kolkata",
  JST: "Asia/Tokyo",
  KST: "Asia/Seoul",
  CST_China: "Asia/Shanghai",

  // Australia
  AEST: "Australia/Sydney",
  AEDT: "Australia/Sydney",
  ACST: "Australia/Adelaide",
  ACDT: "Australia/Adelaide",
  AWST: "Australia/Perth",

  // UTC
  UTC: "Etc/UTC",
};

export { timeZoneAbbr };
