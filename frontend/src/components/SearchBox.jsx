import React, { useState } from "react";

const SearchBox = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input);
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        className="search-input"
        placeholder="Search questions..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBox;