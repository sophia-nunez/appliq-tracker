import { baseURL } from "./authUtils";

// uses query params to load matching notes
const getNotes = async (query) => {
  try {
    const response = await fetch(`${baseURL()}/notes`, {
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

// creates a note
const createNote = async (note) => {
  try {
    const response = await fetch(`${baseURL()}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();
  } catch (error) {
    throw new Error("Failed to create note");
  }
};

// removes note based on given id
const deleteNote = async (id) => {
  try {
    const response = await fetch(`${baseURL()}/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error("Failed to delete note");
  }
};

export { getNotes, createNote, deleteNote };
