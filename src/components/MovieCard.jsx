import { useState } from "react";
import Spinner from "./Spinner";

const MovieCard = ({
  movie: { title, vote_average, original_language, poster_path, release_date },
}) => {
  const [isLoading, setisLoading] = useState(true);
  const [isImageLoaded, setisImageLoaded] = useState(false);

  const imageSrc =
    poster_path && !isImageLoaded
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : "/no-movie.png";

  return (
    <div className="movie-card relative p-3">
      {isLoading && (
        <div className="w-full h-full bg-dark-100 absolute top-0 left-0 flex justify-center items-center rounded-2xl">
          <Spinner />
        </div>
      )}
      <img
        src={imageSrc}
        alt={title}
        onLoad={() => setisLoading(false)}
        onError={() => {
          setisLoading(false), setisImageLoaded(true);
        }}
      />

      <div className="p-3">
        <div className="mt-5">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="" />
              <p className="text-sm text-gray-400 font-medium">
                {vote_average ? vote_average.toFixed(1) : 0.0}
              </p>
              <span>•</span>
              <p className="text-sm text-gray-300 uppercase font-medium">
                {original_language ? original_language : "NN/A"}
              </p>
              <span>•</span>
              <p className="text-sm text-gray-400 uppercase font-medium">
                {release_date ? release_date.split("-")[0] : "NN/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
