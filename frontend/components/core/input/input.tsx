import classNames from "classnames";

type InputProps = {
  type?: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
};

export const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  helperText,
  placeholder,
  disabled = false,
  error,
}) => {
  return (
    <div className="flex flex-col">
      {label ? (
        <label className="pb-1 text-gray-700 text-sm">{label}</label>
      ) : null}
      <input
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
      />
      {error ? (
        <span className="pt-1 text-error-500 text-sm">{error}</span>
      ) : null}
      {helperText && !error ? (
        <span className="pt-1 text-gray-500 text-sm">{helperText}</span>
      ) : null}
    </div>
  );
};
