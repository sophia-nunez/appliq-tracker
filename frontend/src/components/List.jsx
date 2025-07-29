import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { applicationsPath } from "../data/links";
import { getNotes, createNote, deleteNote } from "../utils/noteUtils";
import { useLoading } from "./LoadingContext";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  SimpleGrid,
} from "@mantine/core";
import "../styles/List.css";

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
      <form className="child add-task-container" onSubmit={handleSubmit}>
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
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 5 }}>
        {notes && notes.length > 0
          ? notes.map((note) => {
              return (
                <Card
                  key={note.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <div className="text">
                    <h4>{note.task}</h4>
                    <p className="description-text">{note.description}</p>
                  </div>
                  <div className="buttons">
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, note.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </Card>
              );
            })
          : "No notes to display."}
      </SimpleGrid>
    </section>
  );
};

export default List;
