import { useState } from "react";
import List from "../components/List";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";

const ApplicationsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: currently on all, move to applications list
  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <main>
        <SearchBar pageName="Applications" />
        <section className="list-container">
          <h3 onClick={openModal}>All</h3>
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
