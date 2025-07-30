import { FaSpinner } from "react-icons/fa6";
import "../styles/Modal.css";
import "../styles/LoadingModal.css";

const LoadingModal = (mini) => {
  return (
    <aside
      className={mini === "true" ? "mini-modal" : "modal"}
      id="loading-modal"
    >
      <section className="modal-content">
        <FaSpinner className="loading-spinner" />
        <p> Loading...</p>
      </section>
    </aside>
  );
};
export default LoadingModal;
