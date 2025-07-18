import { baseURL } from "./authUtils";
import { Periods } from "../data/enums";

// uses query params to load matching applications
const getApplicationGroupData = async (type) => {
  let routeURL = `${baseURL()}/applications/data/group/${type}`;

  // if searching for activity chart, use dateRange route
  if (type === Periods.ALL) {
    routeURL = `${baseURL()}/applications/data/dateRange/all`;
  } else if (type === Periods.YEAR) {
    routeURL = `${baseURL()}/applications/data/dateRange/year`;
  } else if (type === Periods.MONTH) {
    routeURL = `${baseURL()}/applications/data/dateRange/month`;
  }

  try {
    const response = await fetch(routeURL, {
      credentials: "include",
    });
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// uses given order to get company names with application count by status
const getCompanyData = async (orderBy) => {
  let routeURL = `${baseURL()}/applications/data/company/${orderBy}`;

  try {
    const response = await fetch(routeURL, {
      credentials: "include",
    });
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export { getApplicationGroupData, getCompanyData };
