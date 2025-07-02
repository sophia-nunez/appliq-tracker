import { baseURL, getUserInfo } from "./authUtils";

const getMessages = async () => {
  // get user information based on current session
  const user = await getUserInfo();

  if (!user.google_id) {
    // not linked to a google account, no action necessary
    return;
  }

  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?includeSpamTrash=true&q=interview`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getMessages };
