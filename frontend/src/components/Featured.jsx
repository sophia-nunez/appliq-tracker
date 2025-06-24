import "../styles/Featured.css";

const Featured = () => {
  return (
    <section className="featured-container">
      <h3> Featured </h3>
      <section className="featured-background">
        <div className="featured-content">
          <article className="featured">
            <h4>Title</h4>
            <p>Description</p>
          </article>
          <article className="featured">
            <h4>Title</h4>
            <p>Description</p>
          </article>
          <article className="featured">
            <h4>Title</h4>
            <p>Description</p>
          </article>
          <article className="featured">
            <h4>Title</h4>
            <p>Description</p>
          </article>
        </div>
      </section>
    </section>
  );
};

export default Featured;
