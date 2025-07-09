import { baseURL } from "./authUtils";

// uses query params to load matching applications
const getApplications = async (query) => {
  try {
    const response = await fetch(
      `${baseURL()}/applications/?${query.toString()}`,
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

const getFeatured = async () => {
  const query = new URLSearchParams({ status: "featured" });

  try {
    const response = await fetch(
      `${baseURL()}/applications/?${query.toString()}`,
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

// fetches single application by id
const getApplication = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/applications/${id}`, {
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
const createApplication = async (application) => {
  const appliedDate = new Date(application.appliedAt);
  let newInfo = {
    ...application,
    appliedAt: appliedDate,
  };

  if (application.interviewedAt) {
    const interviewDate = new Date(application.interviewAt);
    newInfo = {
      ...application,
      interviewAt: interviewDate,
    };
  }

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
      throw new Error();
    }

    const data = await response.json();
  } catch (error) {
    throw new Error("Failed to Create Application");
  }
};

// modifies applciation based on updated information
const editApplication = async (application, id) => {
  let newInfo = { ...application };
  if (application.appliedAt) {
    const appliedDate = new Date(application.appliedAt);
    newInfo = {
      ...application,
      appliedAt: appliedDate,
    };
  }

  if (application.interviewAt) {
    const interviewDate = new Date(application.interviewAt);
    newInfo = {
      ...application,
      interviewAt: interviewDate,
    };
  }

  try {
    const response = await fetch(`${baseURL()}/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInfo),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Failed to update application");
  }
};

// removes application based on given id
const deleteApplication = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/applications/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error("Failed to delete application");
  }
};

// uses query params to load matching applications
const getApplicationSummary = async () => {
  try {
    const response = await fetch(`${baseURL()}/applications/summary`, {
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

export {
  getApplications,
  getApplication,
  getFeatured,
  createApplication,
  editApplication,
  deleteApplication,
  getApplicationSummary,
};
