
const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary-200 border-t-primary-600`}></div>
    </div>
  );
};

export default LoadingSpinner;