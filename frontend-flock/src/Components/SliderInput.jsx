import React from 'react';

const SliderInput = ({ label, name, value, onChange, min = "0", max = "10" }) => {
  return (
    <label>
      {label}:
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ display: 'block', width: '50%' }}
      />
      {value}
    </label>
  );
};

export default SliderInput;