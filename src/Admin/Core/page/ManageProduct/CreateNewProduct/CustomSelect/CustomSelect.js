import Select from 'react-select';

const CustomSelect = ({ keyChange, options, onChange, isMulti, placeholder, isOptionDisabled, isClearable }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(249 250 251)',
      borderRadius: '8px',
      height: '42px',
    }),
  };

  return (
    <Select
      key={keyChange}
      styles={customStyles}
      isMulti={isMulti}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      isOptionDisabled={isOptionDisabled}
      isClearable={isClearable}
    />
  );
};

export default CustomSelect;
