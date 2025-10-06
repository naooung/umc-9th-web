import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { TMDB_IMAGE } from '../apis/tmdb';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="block">
      <article
        className="
          relative w-full
          overflow-hidden rounded-2xl shadow-lg bg-black/5
          transition-transform duration-300 hover:scale-[1.03]
          group
        "
        title={movie.title}
      >
        <img
          src={TMDB_IMAGE(movie.poster_path, 'w300')}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-300 group-hover:blur-sm"
          loading="lazy"
        />
        <div
          className="
            absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 flex flex-col justify-end p-4
          "
        >
          <h3 className="text-white text-lg font-semibold mb-1">{movie.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-3">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </article>
    </Link>
  );
}