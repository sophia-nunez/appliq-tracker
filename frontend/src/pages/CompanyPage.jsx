import { useState } from "react";
import List from "../components/List.jsx";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";

const CompanyPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: currently on all, move to company list
  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <main className="company-page">
        <SearchBar pageName="Companies" />
        <section className="company-list">
          <h3 onClick={openModal}>All</h3>
          <List />
        </section>
      </main>
      {modalOpen && <Modal contents="company" setModalOpen={setModalOpen} />}
    </>
  );
};

export default CompanyPage;
