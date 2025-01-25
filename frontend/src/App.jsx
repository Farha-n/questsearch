import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [isCheckingAnswer, setIsCheckingAnswer] = useState({});
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const pageSize = 10;

  const questionTypes = ["ALL", "MCQ", "ANAGRAM", "READ_ALONG"];

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/search", { query, page, pageSize });
      let filteredQuestions = response.data.questions;
      if (selectedType !== "ALL") {
        filteredQuestions = filteredQuestions.filter(q => q.type === selectedType);
      }
      setQuestions(filteredQuestions);
      setTotal(selectedType === "ALL" ? response.data.total : filteredQuestions.length);
      // Reset answers when new questions are fetched
      setSelectedAnswers({});
      setCheckedAnswers({});
      setAttemptedQuestions({});
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        fetchQuestions();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, page, selectedType]);

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    // Reset checked status when new option is selected
    setCheckedAnswers(prev => ({
      ...prev,
      [questionId]: null
    }));
  };

  const checkAnswer = async (questionId) => {
    setIsCheckingAnswer(prev => ({...prev, [questionId]: true}));
    
    const selectedOption = questions
      .find(q => q.id === questionId)
      ?.options[selectedAnswers[questionId]];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (selectedOption) {
      setCheckedAnswers(prev => ({
        ...prev,
        [questionId]: selectedOption.isCorrectAnswer
      }));
      setAttemptedQuestions(prev => ({
        ...prev,
        [questionId]: true
      }));
    }
    
    setIsCheckingAnswer(prev => ({...prev, [questionId]: false}));
  };

  const totalPages = Math.ceil(total / pageSize);
  const showPagination = questions.length > 0 && totalPages > 1;

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading questions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>QuestSearch</h1>
        <div style={styles.searchContainer}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && <div style={styles.loader}></div>}
        </div>
        <div style={styles.filterContainer}>
          {questionTypes.map(type => (
            <button
              key={type}
              style={{
                ...styles.filterButton,
                ...(selectedType === type ? styles.activeFilter : {})
              }}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </header>
      <main style={styles.main}>
        {questions.length > 0 ? (
          <ul style={styles.questionList}>
            {questions.map((q) => (
              <li key={q.id} style={styles.questionItem}>
                <span style={styles.questionType}>{q.type}</span>
                <p style={styles.questionTitle}>{q.title}</p>
                {q.type === "MCQ" && (
                  <div style={styles.optionsContainer}>
                    {q.options.map((option, index) => (
                      <div key={index} style={styles.option}>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          id={`${q.id}-option-${index}`}
                          style={styles.optionInput}
                          checked={selectedAnswers[q.id] === index}
                          onChange={() => handleOptionSelect(q.id, index)}
                        />
                        <label 
                          htmlFor={`${q.id}-option-${index}`}
                          style={styles.optionLabel}
                        >
                          {option.text}
                        </label>
                      </div>
                    ))}
                    <div style={styles.submitContainer}>
                      {isCheckingAnswer[q.id] ? (
                        <div style={styles.miniLoader}></div>
                      ) : (
                        <button
                          style={{
                            ...styles.submitButton,
                            ...(selectedAnswers[q.id] === undefined && styles.disabledSubmit)
                          }}
                          onClick={() => checkAnswer(q.id)}
                          disabled={selectedAnswers[q.id] === undefined}
                        >
                          Check Answer
                        </button>
                      )}
                      {attemptedQuestions[q.id] && checkedAnswers[q.id] !== null && (
                        <span style={{
                          ...styles.resultMessage,
                          color: checkedAnswers[q.id] ? '#059669' : '#dc2626'
                        }}>
                          {checkedAnswers[q.id] ? 'Correct!' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noResults}>
            {query ? "No results found." : "Start searching to see results."}
          </p>
        )}
      </main>
      {showPagination && (
        <footer style={styles.pagination}>
          <button
            style={{
              ...styles.pageButton,
              ...(page === 1 ? styles.disabledButton : {}),
            }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                style={{
                  ...styles.pageButton,
                  ...(page === pageNum ? styles.activePageButton : {}),
                }}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            style={{
              ...styles.pageButton,
              ...(page === totalPages ? styles.disabledButton : {}),
            }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </footer>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#1a1a1a", 
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fafafa",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "1.2rem",
    color: "#4b5563",
  },
  miniLoader: {
    width: "24px",
    height: "24px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "24px",
    background: "linear-gradient(45deg, #2563eb, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  searchContainer: {
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    color: "#374151",
  },
  activeFilter: {
    backgroundColor: "#2563eb",
    color: "white",
    borderColor: "#2563eb",
  },
  searchInput: {
    padding: "16px 20px",
    width: "100%",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "1.1rem",
    transition: "all 0.2s ease",
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    outline: "none",
    "&:focus": {
      borderColor: "#2563eb",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
    },
  },
  loader: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  main: {
    marginTop: "32px",
  },
  questionList: {
    listStyleType: "none",
    padding: 0,
    display: "grid",
    gap: "16px",
  },
  questionItem: {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  },
  questionType: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "8px",
  },
  questionTitle: {
    margin: "0",
    fontSize: "1.1rem",
    color: "#374151",
    lineHeight: "1.5",
  },
  optionsContainer: {
    marginTop: "16px",
    display: "grid",
    gap: "12px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  optionInput: {
    margin: 0,
    cursor: "pointer",
    width: "18px",
    height: "18px",
  },
  optionLabel: {
    fontSize: "1rem",
    color: "#4b5563",
    cursor: "pointer",
    flex: 1,
  },
  submitContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  submitButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#1d4ed8",
    },
  },
  disabledSubmit: {
    opacity: 0.5,
    cursor: "not-allowed",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  },
  resultMessage: {
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  noResults: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#6b7280",
    padding: "40px 0",
  },
  pagination: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    alignItems: "center",
  },
  pageButton: {
    padding: "8px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.95rem",
    color: "#374151",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  activePageButton: {
    backgroundColor: "#2563eb",
    color: "white",
    borderColor: "#2563eb",
    "&:hover": {
      backgroundColor: "#1d4ed8",
    },
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
    "&:hover": {
      backgroundColor: "white",
    },
  },
};

export default App;