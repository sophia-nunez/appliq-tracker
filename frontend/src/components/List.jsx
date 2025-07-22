import { Link } from "react-router";
import "../styles/List.css";
import { applicationsPath } from "../data/links";
import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "../utils/noteUtils";
import { useLoading } from "./LoadingContext";

const List = () => {
  const { loading } = useLoading();
  const [notes, setNotes] = useState(Array());
  const [formInput, setFormInput] = useState({
    task: "",
    description: "",
  });

  useEffect(() => {
    loadList();
  }, []);

  // updates the given formInput field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const loadList = async () => {
    loading.setTrue();
    const notesList = await getNotes();
    setNotes(notesList);
    loading.setFalse();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // create new task
    const created = await createNote(formInput);
    // reload notes list
    loadList();

    setFormInput({
      task: "",
      description: "",
    });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    // delete task
    const deleted = await deleteNote(id);
    // reload notes list
    loadList();
  };

  return (
    <section className="list-content notes-list" to={`${applicationsPath}/1`}>
      <form className="child" onSubmit={handleSubmit}>
        <div className="text">
          <label htmlFor="task" />
          <input
            type="text"
            id="task"
            name="task"
            placeholder="New task..."
            value={formInput.task}
            onChange={handleChange}
            required
          />
          <label htmlFor="description" />
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Task description, deadlines, etc."
            value={formInput.description}
            onChange={handleChange}
          />
        </div>
        <div className="buttons">
          <button type="submit">Add Task</button>
        </div>
      </form>
      {notes && notes.length > 0
        ? notes.map((note) => {
            return (
              <article key={note.id} className="child">
                <div className="text">
                  <h4>{note.task}</h4>
                  <p>{note.description}</p>
                </div>
                <div className="buttons">
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, note.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        : "No notes to display."}
    </section>
  );
};

export default List;
