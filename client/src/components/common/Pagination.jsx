import React from 'react';
import Button from './Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage, endPage;
      
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </Button>
      )}
      
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
      )}
      
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      )}
      
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      )}
    </div>
  );
};

export default Pagination;