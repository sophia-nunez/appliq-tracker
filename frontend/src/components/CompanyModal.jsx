import { useState, useEffect } from "react";
import {
  createCompany,
  deleteCompany,
  editCompany,
} from "../utils/companyUtils";
import "../styles/Modal.css";

const CompanyModal = ({
  company,
  setModalOpen,
  reloadPage,
  setMessage,
  setStatusOpen,
}) => {
  // input for company creation/modfication - currently excluded category functionality
  const [formInput, setFormInput] = useState({
    name: "",
    industry: "",
    description: "",
    careerPage: "",
    isFavorite: false,
  });

  // if editing existing company, loads in current data to the form
  useEffect(() => {
    if (company.id) {
      setFormInput((prev) => ({ ...prev, ...company }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (company.id) {
        const edit = await editCompany(formInput, company.id);
        setMessage({ type: "success", text: "Company saved!" });
      } else {
        const added = await createCompany(formInput);
        setMessage({
          type: "success",
          text: "Company added successfully!",
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
      const deleted = await deleteCompany(company.id);
      setMessage({ type: "success", text: "Company deleted." });
      setStatusOpen(true);
      setModalOpen(false);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete company." });
      setStatusOpen(true);
    }
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <section className="company-header">
        <h2>
          <label htmlFor="name"></label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Company Name..."
            value={formInput.name}
            onChange={handleChange}
            required
          />
        </h2>
      </section>
      <section className="company-body">
        <div className="list-container user-details">
          <section className="list-content">
            <article className="child careerPage">
              <label htmlFor="notes">
                <h4>Career Page URL</h4>
              </label>
              <input
                type="text"
                id="careerPage"
                name="careerPage"
                value={formInput.careerPage}
                onChange={handleChange}
              ></input>
            </article>
            <article className="child">
              <label htmlFor="industry">
                <h4>Industry</h4>
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formInput.industry}
                onChange={handleChange}
              />
            </article>
            <article className="child description-input">
              <label htmlFor="description">
                <h4>Company Description</h4>
              </label>
              <textarea
                maxLength="500"
                id="description"
                name="description"
                placeholder="Company values, mission statement, etc."
                value={formInput.description}
                onChange={handleChange}
              />
            </article>
          </section>
        </div>
      </section>
      <section className="company-btns">
        <button className="edit-btn" type="submit">
          Submit
        </button>
        {company && company.id && (
          <button type="button" className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </section>
    </form>
  );
};

export default CompanyModal;
