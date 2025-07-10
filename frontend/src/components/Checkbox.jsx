import { useState } from "react";

const Checkbox = ({ label, valueName, initial, handleFilter }) => {
  const [checked, setChecked] = useState(initial ? true : false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div>
      <input
        type="checkbox"
        id={valueName}
        name={valueName}
        value={valueName}
        onChange={handleChange}
        onClick={handleFilter}
        checked={checked}
      />
      <label htmlFor={valueName}>{label}</label>
    </div>
  );
};

export default Checkbox;
