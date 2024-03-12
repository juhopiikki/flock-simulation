import React from 'react';

const SliderInput = ({ label, name, value, onChange, min = "0", max = "10", step="0.1" }) => {
  return (
    <label>
      {label}: {value}
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        step={step}
        style={{ display: 'block', width: '50%' }}
      />
    </label>
  );
};

export default SliderInput;
