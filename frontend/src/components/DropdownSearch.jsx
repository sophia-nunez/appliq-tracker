import { useState } from "react";
import { Combobox, InputBase, useCombobox } from "@mantine/core";

// Generic searchable component from Mantine docs at http://mantine.dev/combobox/?e=SelectCreatable
const DropdownSearch = ({
  data,
  label,
  value,
  setValue,
  addItem,
  error,
  setError,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const exactOptionMatch = data.some((item) => item === value);
  // TODO slice array to top 6 results
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase().trim())
      );

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      error={error}
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        addItem(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={value}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setValue(event.currentTarget.value);
            setError("");
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setValue(value || "");
            setError("");
          }}
          placeholder={`Add ${label}`}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {!exactOptionMatch && value.trim().length > 0 && (
            <Combobox.Option value={value}>+ Create {value}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default DropdownSearch;
