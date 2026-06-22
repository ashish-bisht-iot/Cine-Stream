function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      className="search-input"
      placeholder={placeholder || "Search movies..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;
