import { useJsonForms } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';

const PercentageControl = (props: ControlProps) => {
  const { data, handleChange } = useJsonForms();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    handleChange(props.path, isNaN(newValue) ? 0 : newValue);
  };

  return (
    <input
      type="number"
      value={data[props.path] || 0}
      onChange={handleInputChange}
      min={0}
      max={100}
    />
  );
};

export default PercentageControl;
