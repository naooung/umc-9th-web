// src/components/MovieCard.tsx
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
        "
        >
        <img
            src={TMDB_IMAGE(movie.poster_path, 'w300')}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
        />
  </article>
    </Link>
  );
}