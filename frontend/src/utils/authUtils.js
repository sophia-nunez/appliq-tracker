// checks if in dev to return base API url
// no real sitename given yet
function baseURL() {
  return import.meta.env.VITE_DEV
    ? "http://localhost:3000"
    : "https://backend-sitename-here";
}

// checks valid login info and unique username, then attempts to POST
const registerUser = async (loginInfo) => {
  if (!loginInfo.username || !loginInfo.password) {
    throw new Error("Username and password are required.");
  }

  try {
    const response = await fetch(`${baseURL()}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
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

// attempts to log in user, if error the error message is returned
const loginUser = async (loginInfo) => {
  if (!loginInfo.username || !loginInfo.password) {
    throw new Error("Username and password are required.");
  }

  try {
    const response = await fetch(`${baseURL()}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export { registerUser, loginUser, baseURL };
