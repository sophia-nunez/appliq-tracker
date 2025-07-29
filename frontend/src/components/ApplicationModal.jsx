import { useState, useEffect } from "react";
import { DateTimePicker } from "@mantine/dates";
import { createApplication, editApplication } from "../utils/applicationUtils";
import { Status } from "../data/enums";
import "../styles/Modal.css";
import DropdownSearch from "./DropdownSearch";
import { getCategories } from "../utils/categoryUtils";
import { getCompanies } from "../utils/companyUtils";

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
  const [catError, setCatError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [allCategories, setAllCategories] = useState(Array());
  const [allCompanies, setAllCompanies] = useState(Array());
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
      const linkedCompanyName =
        application.company && application.company.name
          ? application.company.name
          : "";
      setFormInput((prev) => ({
        ...prev,
        ...application,
        companyName: linkedCompanyName,
      }));
    }

    // get all categories and set dropdown list to these values
    const getDropdownLists = async () => {
      const categories = await getCategories();
      setAllCategories(categories.map((category) => category.name));

      const companyData = await getCompanies("");
      setAllCompanies(companyData.companies.map((company) => company.name));
    };

    getDropdownLists();
  }, []);

  // works for all but date pickers and dropdowns, updates the given formInput field
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

  const handleCompanyChange = (val) => {
    setFormInput((previous) => ({
      ...previous,
      companyName: val,
    }));
  };

  const updateTags = (val) => {
    const newCat = { name: val };
    if (formInput.categories.some((cat) => cat.name === newCat.name)) {
      setCatError("Tag cannot be duplicate.");
      setCategory("");
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

    if (!formInput.companyName) {
      setCompanyError("Please fill out this field");
      return;
    }

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
          company: returnedApplication.company.name,
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

  const handleDelete = async () => {
    try {
      const deleted = await deleteApplication(application.id);
      setMessage({ type: "success", text: "Application deleted." });
      setStatusOpen(true);
      setModalOpen(false);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete application." });
      setStatusOpen(true);
    }
  };

  return (
    <form
      className="application-form"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <section className="application-header">
        <div className="header-input">
          <label htmlFor="title">
            Job Title<span className="required-asterisk">*</span>
          </label>

          <input
            type="text"
            id="title"
            name="title"
            placeholder="Job Title"
            value={formInput.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="header-input">
          <label htmlFor="companyName">
            {" "}
            Company<span className="required-asterisk">*</span>
          </label>
          <DropdownSearch
            data={allCompanies}
            id="companyName"
            name="companyName"
            label="Company"
            value={formInput.companyName}
            setValue={handleCompanyChange}
            addItem={handleCompanyChange}
            error={companyError}
            setError={setCompanyError}
            required
          />
        </div>
      </section>
      <section className="application-details">
        <div className="description-input">
          <label htmlFor="description">Job Description </label>
          <textarea
            maxLength="500"
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
              <h3>Status |</h3>
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
              <option value={Status.Applied}>Applied</option>
              <option value={Status.Interview}>Interview</option>
              <option value={Status.Offer}>Offer</option>
              <option value={Status.Rejected}>Rejected</option>
              <option value={Status.Signed}>Signed</option>
              <option value={Status.Other}>Other</option>
            </select>
            <span className="required-asterisk">*</span>
          </section>
          <section className="list-content">
            <article className="child notes">
              <label htmlFor="notes">Notes </label>
              <textarea
                maxLength="400"
                id="notes"
                name="notes"
                value={formInput.notes}
                onChange={handleChange}
              ></textarea>
            </article>
            <article className="child tags">
              <label htmlFor="categories">Tags</label>
              <div className="tag-input">
                <DropdownSearch
                  data={allCategories}
                  id="categories"
                  name="categories"
                  label="Tags"
                  placeholder="Add tag"
                  error={catError}
                  value={category}
                  setValue={setCategory}
                  addItem={updateTags}
                  setError={setCatError}
                />
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
                  valueFormat="MM/DD/YYYY hh:mm A"
                  onChange={(value) => handleDateChange("appliedAt", value)}
                  withAsterisk
                  description="Time is optional"
                  timePickerProps={{
                    withDropdown: true,
                    popoverProps: { withinPortal: false },
                    format: "12h",
                  }}
                  required
                />
              </div>
              <div>
                <DateTimePicker
                  label="Interview Date"
                  id="interviewAt"
                  name="interviewAt"
                  value={formInput.interviewAt}
                  valueFormat="MM/DD/YYYY hh:mm A"
                  onChange={(value) => {
                    handleDateChange("interviewAt", value);
                    setChange(true);
                  }}
                  timePickerProps={{
                    withDropdown: true,
                    popoverProps: { withinPortal: false },
                    format: "12h",
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
          {application && application.id && (
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </section>
      </section>
    </form>
  );
};

export default ApplicationModal;
