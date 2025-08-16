import { useController } from 'react-hook-form';

const Input = ({
  name,
  control,
  label,
  type = 'text',
  placeholder = '',
  className = '',
  ...props
}) => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    defaultValue: ''
  });

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <input
        {...field}
        {...props}
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
        }`}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default Input;