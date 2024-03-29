import { useState, useEffect } from 'react';

const useForm = (initial = {}) => {
  const [inputs, setInputs] = useState(initial);
  const initialvalues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initialvalues]);

  const handleChange = (e) => {
    let { value, name, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }

    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
};

export default useForm;
