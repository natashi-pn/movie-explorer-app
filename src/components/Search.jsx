const Search = ({ searchTerm, setsearchTerm }) => {
  return (
    <div className="search my-15">
      <div>
        <img src="./search.svg" alt="" />
        <input
          type="text"
          placeholder="Search movies of your likings"
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
