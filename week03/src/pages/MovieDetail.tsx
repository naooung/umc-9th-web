// src/pages/MovieDetail.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api, { TMDB_IMAGE } from '../apis/tmdb';
import type { MovieDetails, Credits } from '../types/movie';

export default function MovieDetail() {
  const { movieId } = useParams();
  const id = useMemo(() => Number(movieId), [movieId]);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [m, c] = await Promise.all([
          api.get<MovieDetails>(`/movie/${id}`, { signal: ac.signal }),
          api.get<Credits>(`/movie/${id}/credits`, { signal: ac.signal }),
        ]);
        setMovie(m.data);
        setCredits(c.data);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setErr('상세 정보를 불러오지 못했습니다.');
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;
  if (loading || !movie) return <div className="h-64 grid place-items-center">로딩 중…</div>;

  const director = credits?.crew.find((p) => p.job === 'Director')?.name;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={TMDB_IMAGE(movie.poster_path, 'w300')}
          alt={movie.title}
          className="rounded-xl shadow-lg bg-neutral-200"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-600 mb-2">
            {movie.release_date?.slice(0, 4)} · 평점 {movie.vote_average.toFixed(1)} {director && `· 감독 ${director}`}
          </p>
          <p className="leading-relaxed">{movie.overview}</p>
          {movie.genres?.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              장르: {movie.genres.map((g) => g.name).join(', ')}
            </p>
          )}
          {movie.runtime ? <p className="mt-1 text-sm text-gray-600">러닝타임: {movie.runtime}분</p> : null}
        </div>
      </div>

      {credits?.cast?.length ? (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">감독/출연</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {credits.cast.slice(0, 10).map((p) => (
              <div key={p.id} className="text-center">
                <img
                  src={TMDB_IMAGE(p.profile_path, 'w200')}
                  alt={p.name}
                  className="rounded-full w-24 h-24 object-cover mx-auto mb-2 bg-neutral-200"
                />
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">{p.character}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}