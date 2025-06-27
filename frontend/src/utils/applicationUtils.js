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

export { getApplications, getApplication };
