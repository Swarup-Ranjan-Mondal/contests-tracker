
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-l-lg disabled:opacity-50 cursor-pointer"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-700 text-white">{currentPage} / {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-r-lg disabled:opacity-50 cursor-pointer"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
 };
  
export default Pagination;
  