import { AlertCircle } from "lucide-react";

const TextAreaField = ({ id, label, value, onChange, placeholder, error, helperText, required = false, disabled = false, rows = 6, ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2.5 border rounded-lg text-base transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        } resize-none`}
        style={{ minHeight: "150px" }}
        {...props}
      />

      {error && (
        <div className="flex items-center text-sm text-red-600 mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && <div className="text-sm text-gray-500 mt-1">{helperText}</div>}
    </div>
  );
};

export default TextAreaField;
