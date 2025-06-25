import { useState } from "react";
import List from "../components/List";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router";

const ApplicationsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // TODO: currently on all, move to applications list
  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  return (
    <>
      <main>
        <SearchBar pageName="Applications" />
        <section className="list-container">
          <h3>All</h3>
          <List />
        </section>
      </main>
      {modalOpen && (
        <Modal contents="application" setModalOpen={setModalOpen} />
      )}
    </>
  );
};

export default ApplicationsPage;
