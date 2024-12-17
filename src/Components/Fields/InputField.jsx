// InputField.jsx
import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  validation,
  error,
}) => {
  return (
    <div className="flex flex-col justify-start">
      <label

        htmlFor={name}
        class="text-start mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        {...register(name, validation)}
        class="w-full border border-gray-400 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        style={{borderRadius: "1rem"}}
      />
      {error && <p className="mt-1 text-start text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

const SelectField = ({ label, name, options, register, validation, error }) => (
  <div className="mb-4 flex flex-col justify-start items-start">
    <label
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      htmlFor={name}
    >
      {label}
    </label>
    <select
      id={name}
      {...register(name, validation)}
      className=" border border-gray-400 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      style={{borderRadius: "1rem"}}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);
export { InputField, SelectField };
