function baseURL() {
  return import.meta.env.VITE_DEV
    ? "http://localhost:3000"
    : "https://backend-sitename-here";
}

const registerUser = async (loginInfo) => {
  try {
    if (!loginInfo.username || !loginInfo.password) {
      throw new Error("Username and password are required.");
    }
    const response = await fetch(`${baseURL()}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }
  } catch (error) {
    throw error;
  }
};

const loginUser = async (loginInfo) => {
  try {
    if (!loginInfo.username || !loginInfo.password) {
      throw new Error("Username and password are required.");
    }
    const response = await fetch(`${baseURL()}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });
    if (!response.ok) {
      const text = await response.json();
      throw new Error(text.error);
    }
  } catch (error) {
    throw error;
  }
};

export { registerUser, loginUser };
