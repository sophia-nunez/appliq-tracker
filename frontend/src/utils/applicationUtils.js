import { baseURL } from "./authUtils";

const getApplications = async (query) => {
  try {
    const response = await fetch(
      `${baseURL()}/applications/?${query.toString()}`
    );
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

const getApplication = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/applications/${id}`);
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

const createApplication = async (newInfo) => {
  try {
    const response = await fetch(`${baseURL()}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInfo),
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
    //throw new Error("Failed to Create Application");
  }
};

export { getApplications, getApplication, createApplication };
