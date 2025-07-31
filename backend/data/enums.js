const Order = {
  ALPHABETICAL: "alphabetical",
  RECENT: "recent",
  INTERVIEW: "interviewDate",
};

const Status = {
  Applied: "Applied",
  Interview: "Interview",
  Offer: "Offer",
  Rejected: "Rejected",
  Signed: "Signed",
  Other: "Other",
};

const OrderStatus = {
  Interview: "Interview",
  Offer: "Offer",
};

const Periods = {
  ALL: "all",
  YEAR: "year",
  MONTH: "month",
  DAY: "day",
  CUSTOM: "custom",
};

const Search = {
  ALL: "all",
};

const LogStatus = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};

module.exports = { Order, Status, OrderStatus, Periods, Search, LogStatus };
