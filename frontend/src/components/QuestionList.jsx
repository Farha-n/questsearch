import React from "react";
import ReactPaginate from "react-paginate";

const QuestionList = ({ questions, total, currentPage, pageSize, onPageChange }) => {
  const pageCount = Math.ceil(total / pageSize);

  const handlePageClick = (event) => {
    onPageChange(event.selected + 1);
  };

  return (
    <div>
      <ul className="question-list">
        {questions.map((q) => (
          <li key={q.id} className="question-item">
            <strong>{q.type}:</strong> {q.title}
          </li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default QuestionList;