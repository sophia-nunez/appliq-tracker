import { useNavigate } from "react-router";
import { loginPath, userInfoURL } from "../data/links.js";
import { useTheme } from "../components/ThemeContext.jsx";
import { Scheme } from "../data/enums.js";

// checks if in dev to return base API url
// no real sitename given yet
function baseURL() {
  return import.meta.env.VITE_DEV
    ? "http://localhost:3000"
    : import.meta.env.VITE_BACKEND_URL;
}

function checkLogin(response) {
  const navigate = useNavigate();
  if (response.status === 401) {
    navigate(loginPath);
  }
}

// checks valid login info and unique username, then attempts to POST
const registerUser = async (loginInfo) => {
  if (!loginInfo.username || !loginInfo.password) {
    throw new Error("Username and password are required.");
  }

  let colorScheme = Scheme.LIGHT;
  if (typeof window !== "undefined" && window.matchMedia) {
    colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Scheme.DARK
      : Scheme.LIGHT;
  }

  const userProfile = { colorScheme, ...loginInfo };

  try {
    const response = await fetch(`${baseURL()}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userProfile),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed.");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// attempts to log in user, if error the error message is returned
const loginUser = async (loginInfo) => {
  const { setTheme } = useTheme();

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
      throw new Error(data.error || "Login failed.");
    }

    // update color scheme to user preference
    if (data.colorScheme) {
      setTheme(data.colorScheme);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const getGoogleToken = async (code) => {
  try {
    const response = await fetch(`${baseURL()}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(code),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Google authentication failed.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const getGoogleProfile = async (tokenResponse) => {
  try {
    const response = await fetch(userInfoURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Google profile creation failed.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const loginGoogleUser = async (tokenResponse) => {
  const profile = await getGoogleProfile(tokenResponse);
  const userInfo = { ...profile, ...tokenResponse };
  try {
    const response = await fetch(`${baseURL()}/auth/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Google authentication failed.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const getUserInfo = async () => {
  try {
    const response = await fetch(`${baseURL()}/user`, {
      credentials: "include",
    });
    if (!response.ok) {
      const text = await response.json();
      checkLogin(response);
      throw new Error(text.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUserScheme = async (colorScheme) => {
  if (Object.values(Scheme).includes(colorScheme)) {
    try {
      const response = await fetch(`${baseURL()}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ colorScheme }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "User profile update failed.");
      }
    } catch (error) {
      // log error with logging
    }
  }
};

// attempts update user's timestamp for lastLogin
const trackLogin = async () => {
  try {
    const response = await fetch(`${baseURL()}/track/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "User profile update failed.");
    }
  } catch (error) {
    // log error with logging
  }
};

export {
  registerUser,
  loginUser,
  getGoogleToken,
  loginGoogleUser,
  getUserInfo,
  updateUserScheme,
  baseURL,
  checkLogin,
  trackLogin,
};
