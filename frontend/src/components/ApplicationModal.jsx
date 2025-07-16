import { useState, useEffect } from "react";
import { DateTimePicker } from "@mantine/dates";
import { FaCirclePlus } from "react-icons/fa6";
import { createApplication, editApplication } from "../utils/applicationUtils";
import "../styles/Modal.css";

const ApplicationModal = ({
  application,
  setModalOpen,
  reloadPage,
  setStatusOpen,
  setInterviewChanged,
  setMessage,
}) => {
  // input for application creation/modfication - currently excluded category functionality
  const [category, setCategory] = useState("");
  const [change, setChange] = useState(false);
  const [formInput, setFormInput] = useState({
    companyName: "",
    title: "",
    description: "",
    notes: "",
    status: "",
    categories: Array(),
    removedCategories: Array(),
    appliedAt: new Date(),
    interviewAt: null,
  });

  // if editing existing application, loads in current data to the form
  useEffect(() => {
    if (application.id) {
      // TODO currently adds userId and all other fields to payload, should this be avoided?
      setFormInput((prev) => ({ ...prev, ...application }));
    }
  }, []);

  // works for all but date pickers, updates the given formInput field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    const date = new Date(value).toISOString();

    setFormInput((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleTag = (e) => {
    setCategory(e.target.value);
  };

  const updateTags = (e) => {
    const newCat = { name: category.trim() };
    if (formInput.categories.includes(newCat)) {
      alert("Tag cannot be duplicate.");
      return;
    }
    const newCategories = [...formInput.categories, newCat];

    setFormInput((prev) => ({
      ...prev,
      categories: newCategories,
    }));

    setCategory("");
  };

  const removeTag = (e) => {
    // information on removed category
    const index = e.target.dataset.idx;
    const removed = formInput.categories[index];
    // remove tag from categories array
    const updatedCategories = formInput.categories.toSpliced(index, 1);

    if (removed.id) {
      // if it's an existing tag (not new), add to removal list for db
      setFormInput((prev) => ({
        ...prev,
        categories: updatedCategories,
        removedCategories: [...prev.removedCategories, { id: removed.id }],
      }));
    } else {
      // only remove string if category isn't connected already
      setFormInput({ ...formInput, categories: updatedCategories });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let returnedApplication;
      if (application.id) {
        returnedApplication = await editApplication(formInput, application.id);
        setMessage({
          type: "success",
          text: change
            ? "Application saved! A new interview date was added."
            : "Application saved!",
        });
      } else {
        returnedApplication = await createApplication(formInput);
        setMessage({
          type: "success",
          text: change
            ? "Application added! A new interview date was added."
            : "Application added!",
        });
      }
      // if the interview date changed, set state var for calendar update
      if (change) {
        setInterviewChanged({
          title: returnedApplication.title,
          company: returnedApplication.companyName,
          date: new Date(returnedApplication.interviewAt),
        });
      }

      reloadPage();
      setStatusOpen(true);
      setModalOpen(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
      setStatusOpen(true);
    }
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <section className="application-header">
        <h2>
          <label htmlFor="title"></label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Job Title"
            value={formInput.title}
            onChange={handleChange}
            required
          />
        </h2>
        <p>
          <label htmlFor="companyName"></label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Company"
            value={formInput.companyName}
            onChange={handleChange}
            required
          />
        </p>
      </section>
      <section className="application-details">
        <div className="description-input">
          <label htmlFor="description">Job Description </label>
          <textarea
            id="description"
            name="description"
            placeholder="Required Skills, Location, etc."
            value={formInput.description}
            onChange={handleChange}
          />
        </div>
        <div className="list-container user-details">
          <section className="status-details">
            <label htmlFor="status">
              <h3>Status | </h3>
            </label>
            <select
              id="status"
              name="status"
              value={formInput.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled={true}>
                Select
              </option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Signed">Signed</option>
              <option value="Other">Other</option>
            </select>
          </section>
          <section className="list-content">
            <article className="child notes">
              <label htmlFor="notes">Notes </label>
              <textarea
                id="notes"
                name="notes"
                value={formInput.notes}
                onChange={handleChange}
              ></textarea>
            </article>
            <article className="child tags">
              <label htmlFor="categories">Tags</label>
              <div className="tag-input">
                <input
                  id="categories"
                  name="categories"
                  placeholder="Add tag"
                  value={category}
                  onChange={handleTag}
                />
                <FaCirclePlus
                  className="add-tag-btn"
                  type="button"
                  onClick={updateTags}
                >
                  +
                </FaCirclePlus>
              </div>
              <div className="category-list">
                {formInput.categories &&
                  formInput.categories.map((category, index) => {
                    return (
                      <p className="tag" key={index}>
                        {category.name}{" "}
                        <span
                          className="remove-tag-btn"
                          data-idx={index}
                          onClick={removeTag}
                        >
                          x
                        </span>
                      </p>
                    );
                  })}
              </div>
            </article>
            <article className="child dates">
              <div>
                <DateTimePicker
                  label="Application Date"
                  id="appliedAt"
                  name="appliedAt"
                  value={formInput.appliedAt}
                  onChange={(value) => handleDateChange("appliedAt", value)}
                  withAsterisk
                  description="Time is optional"
                  required
                />
              </div>
              <div>
                <DateTimePicker
                  label="Interview Date"
                  id="interviewAt"
                  name="interviewAt"
                  value={formInput.interviewAt}
                  onChange={(value) => {
                    handleDateChange("interviewAt", value);
                    setChange(true);
                  }}
                />
              </div>
            </article>
          </section>
        </div>
        <section className="application-btns">
          <button className="edit-btn" type="submit">
            Submit
          </button>
          {application && (
            <button type="button" className="delete-btn">
              Delete
            </button>
          )}
        </section>
      </section>
    </form>
  );
};

export default ApplicationModal;
