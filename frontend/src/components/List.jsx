import "../styles/List.css";

const List = () => {
  return (
    <section className="list-content">
      <article className="child">
        <div className="text">
          <h4>Title</h4>
          <p>Description</p>
        </div>
        <div className="buttons">
          <button>Delete</button>
        </div>
      </article>
      <article className="child">
        <div className="text">
          <h4>Title</h4>
          <p>Description</p>
        </div>
        <div className="buttons">
          <button>Delete</button>
        </div>
      </article>
      <article className="child">
        <div className="text">
          <h4>Title</h4>
          <p>Description</p>
        </div>
        <div className="buttons">
          <button>Delete</button>
        </div>
      </article>
    </section>
  );
};

export default List;
