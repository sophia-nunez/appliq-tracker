import { useState, useCallback } from "react";

// hook example referenced and modified from https://dev.to/iamludal/react-custom-hooks-useboolean-3m6c
function useBoolean(defaultValue = false) {
  const [value, setValue] = useState(defaultValue);

  const setTrue = useCallback(() => setValue(true));
  const setFalse = useCallback(() => setValue(false));
  const toggle = useCallback(() => setValue((prev) => !prev));

  const updateValue = { setTrue, setFalse, toggle };

  return [value, updateValue];
}

export default useBoolean;
