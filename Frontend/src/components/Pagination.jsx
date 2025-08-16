
const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }
    
    return [
      1,
      '...',
      ...pages.slice(currentPage - 2, currentPage + 1),
      '...',
      totalPages
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Previous
      </button>

      {visiblePages.map((page, index) => (
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium border ${
              currentPage === page
                ? 'text-primary-600 bg-primary-50 border-primary-500'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;