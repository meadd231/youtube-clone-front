import { useState } from "react";

/**
 * input 태그의 값을 저장하는 유틸 컴포넌트
 */
const useInput = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = (e) => setValue(e.target.value);

  return { value, setValue, onChange };
};

export default useInput;
