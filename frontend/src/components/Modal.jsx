import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ApplicationModal from "./ApplicationModal";
import "../styles/Modal.css";
import CompanyModal from "./CompanyModal";

const Modal = ({ contents, item, setModalOpen, reloadPage }) => {
  const modalRef = useRef(null);

  // closes modal on window click off of modal or on span
  useEffect(() => {
    function handleWindowClick(event) {
      const span = document.getElementById("modal-close");
      if (event.target === span) {
        closeModal();
      }
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  // modal loads content based on prop passed in by parent page
  return (
    <aside id="modal" className="modal" ref={modalRef}>
      <span id="nav-close" className="close">
        <IoMdClose className="close-icon" />
      </span>
      <section className="modal-content">
        {contents === "application" && (
          <ApplicationModal
            setModalOpen={setModalOpen}
            application={item}
            reloadPage={reloadPage}
          />
        )}
        {contents === "company" && (
          <CompanyModal
            setModalOpen={setModalOpen}
            company={item}
            reloadPage={reloadPage}
          />
        )}
      </section>
    </aside>
  );
};

export default Modal;
