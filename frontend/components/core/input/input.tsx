import React from 'react';
import classNames from "classnames";
import { ChangeHandler } from 'react-hook-form';

type InputProps = {
  id: string,
  name: string,
  type?: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange: ChangeHandler;
  onBlur?: ChangeHandler;
};

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  id,
  name,
  type = "text",
  label,
  helperText,
  placeholder,
  disabled = false,
  error,
  onChange,
  onBlur,
}, ref) => {
  return (
    <div className="flex flex-col">
      {label ? (
        <label htmlFor={id} className="pb-1 text-gray-700 text-sm font-medium">{label}</label>
      ) : null}
      <input
        ref={ref}
        id={id}
        name={name}
        className={classNames(
          "py-2 px-3 shadow-xs border rounded-lg text-gray-900 text-md disabled:text-gray-500 focus:outline-none focus:shadow-focus",
          {
            "border-gray-300 focus:shadow-primary-100 focus:border-primary-300":
              !error,
            "border-error-300 focus:shadow-error-100": error,
          }
        )}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? (
        <span className="pt-1 text-error-500 text-sm">{error}</span>
      ) : null}
      {helperText && !error ? (
        <span className="pt-1 text-gray-500 text-sm">{helperText}</span>
      ) : null}
    </div>
  );
});
