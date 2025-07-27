import MovieCard from "./components/MovieCard";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [movieList, setmovieList] = useState([]);
  const [debounceSearchTerm, setdebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendLoading, settrendLoading] = useState(true);
  const [errorTrendLoading, seterrorTrendLoading] = useState(false);

  useDebounce(() => setdebounceSearchTerm(searchTerm), [500]);

  const trendImage = (movieId, url) => {
    return !errorTrendLoading[movieId] ? url : "no-movie.png";
  };

  const fetchMovies = async (query = "") => {
    setisLoading(true);

    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Fail to fetch movies");
      }
      const data = await response.json();
      if (data.Response === "False") {
        seterrorMessage(data.Error || "Fail to fetch movies");
      }
      setmovieList(data.results);

      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(error);
      seterrorMessage(`Error fetching movie data ${error}`);
    } finally {
      setisLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies ${error}`);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    const mainLoader = document.getElementById("global-loader");
    if (mainLoader) {
      mainLoader.style.display = "none";
    }
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  return (
    <main className="overflow-x-hidden">
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero.webp" alt="" className=" w-[300px] sm:w-2xl " />
          <h1 className="uppercase leading-none cursor-pointer mt-8">
            Discover your next{" "}
            <span className="text-gradient">favorite movie</span> with ease
          </h1>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 className="uppercase">trending movies</h2>

              <ul className="mt-10">
                {trendingMovies.map((movies, index) => {
                  return (
                    <li key={movies.$id} className="relative">
                      <p>{index + 1}</p>
                      {trendLoading && (
                        <div className="w-full h-full bg-dark-100 absolute z-99 top-0 left-0 flex justify-center items-center">
                          <Spinner />
                        </div>
                      )}
                      <img
                        src={trendImage(movies.$id, movies.poster_url)}
                        alt=""
                        onLoad={() => settrendLoading(false)}
                        onError={() => {
                          settrendLoading(false), seterrorTrendLoading(true);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
