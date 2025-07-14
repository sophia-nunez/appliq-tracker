import { baseURL } from "./authUtils";

// uses query params to load matching categories
const getCategories = async (query) => {
  try {
    const response = await fetch(`${baseURL()}/categories`, {
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

// fetches single category by id
const getCategory = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/categories/${id}`, {
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

// converts dates to Date objects and attempts to POST data
const createCategory = async (category) => {
  try {
    const response = await fetch(`${baseURL()}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();
  } catch (error) {
    throw new Error("Failed to create category");
  }
};

// modifies applciation based on updated information
const editCategory = async (changes, id) => {
  try {
    const response = await fetch(`${baseURL()}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Failed to update category");
  }
};

// removes category based on given id
const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};

export {
  getCategories,
  getCategory,
  createCategory,
  editCategory,
  deleteCategory,
};
