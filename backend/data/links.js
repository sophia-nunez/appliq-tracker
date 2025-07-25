// google API URLs
const refreshTokenURL = "https://oauth2.googleapis.com/token";
const userInfoURL = "https://www.googleapis.com/oauth2/v3/userinfo";
const createCalendarURL = "https://www.googleapis.com/calendar/v3/calendars";
const Scopes = {
  USER_EMAIL: "https://www.googleapis.com/auth/userinfo.email",
  USER_INFO: "https://www.googleapis.com/auth/userinfo.profile",
  GMAIL: "https://www.googleapis.com/auth/gmail.readonly",
  CALENDAR: "https://www.googleapis.com/auth/calendar.app.created",
};

module.exports = { refreshTokenURL, userInfoURL, createCalendarURL, Scopes };
