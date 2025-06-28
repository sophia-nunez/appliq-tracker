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

const editApplication = async (application, id) => {
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

const deleteApplication = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/applications/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error("Failed to delete application");
  }
};

export {
  getApplications,
  getApplication,
  createApplication,
  editApplication,
  deleteApplication,
};
