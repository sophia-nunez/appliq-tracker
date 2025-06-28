import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ApplicationModal from "./ApplicationModal";
import "../styles/Modal.css";

const Modal = ({ contents, application, setModalOpen, reloadPage }) => {
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
        // TODO: cause slideout animation here as well? or only clicking close
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

  return (
    <aside id="modal" className="modal" ref={modalRef}>
      <span id="nav-close" className="close">
        <IoMdClose className="close-icon" />
      </span>
      <section id="modal-content">
        {contents === "application" && (
          <ApplicationModal
            setModalOpen={setModalOpen}
            application={application}
            reloadPage={reloadPage}
          />
        )}
      </section>
    </aside>
  );
};

export default Modal;
