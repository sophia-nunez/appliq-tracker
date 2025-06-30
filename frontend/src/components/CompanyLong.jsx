import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/List.css";
import { useState } from "react";
import { editCompany } from "../utils/companyUtils";

const CompanyLong = ({
  openPage,
  id,
  name,
  industry,
  description,
  careerPage,
  isFavorite,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const toggledFav = !favorite;

    const company = await editCompany({ isFavorite: toggledFav }, id);

    setFavorite((prev) => !prev);
  };

  return (
    <article className="company long" onClick={(e) => openPage(e, id)}>
      <div className="text">
        <h4>{name}</h4>
        <p>{industry}</p>
        <p className="ellipsis-overflow">{description}</p>
      </div>
      <div className="details" onClick={toggleFavorite}>
        {favorite ? (
          <FaHeart className="favorite" />
        ) : (
          <FaRegHeart className="not-favorite" />
        )}
      </div>
    </article>
  );
};

export default CompanyLong;
