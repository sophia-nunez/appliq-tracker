import { baseURL } from "./authUtils";

// uses query params to load matching companies
const getCompanies = async (query) => {
  try {
    const response = await fetch(
      `${baseURL()}/companies/?${query.toString()}`,
      { credentials: "include" }
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

// fetches single company by id
const getCompany = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/companies/${id}`, {
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
const createCompany = async (company) => {
  try {
    const response = await fetch(`${baseURL()}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(company),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();
  } catch (error) {
    throw new Error("Failed to Create Company");
  }
};

// modifies applciation based on updated information
const editCompany = async (changes, id) => {
  try {
    const response = await fetch(`${baseURL()}/companies/${id}`, {
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
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to update company");
  }
};

// removes company based on given id
const deleteCompany = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/companies/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error("Failed to delete company");
  }
};

export { getCompanies, getCompany, createCompany, editCompany, deleteCompany };
