import List from "./List";

const ApplicationModal = () => {
  return (
    <section className="application-details">
      <h2>Job Title</h2>
      <button>Company</button>
      <p>Description of the job position, including the...</p>
      <section className="application-status">
        <h3>Status</h3>
        <div className="status-details">
          <List />
        </div>
      </section>
      <section className="application-btns">
        <button>Edit</button>
        <button>Delete</button>
      </section>
    </section>
  );
};

export default ApplicationModal;
