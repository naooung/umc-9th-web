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
    const backdrop = TMDB_IMAGE(movie.backdrop_path ?? movie.poster_path, 'original');

    return (
        <>
        <section className="relative w-screen left-1/2 -translate-x-1/2">
    {/* 흐린 배경 */}
    <div className="relative h-[520px] overflow-hidden">
        <img
        src={backdrop}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover blur-lg brightness-50"
        loading="lazy"
        />
    </div>

    {/* 포스터 + 텍스트 콘텐츠 */}
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        {/* 🎬 포스터 왼쪽 */}
        <div className="relative">
            <img
            src={TMDB_IMAGE(movie.poster_path, 'w500')}
            alt={movie.title}
            className="rounded-2xl shadow-2xl w-[240px] md:w-[340px] border-4 border-white/10"
            />
            {/* 살짝 빛나는 효과 */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 shadow-[0_0_25px_rgba(255,255,255,0.15)] pointer-events-none" />
        </div>

        {/* 🎞 오른쪽 텍스트 */}
        <div className="text-white max-w-2xl">
            <h1 className="text-4xl font-bold drop-shadow-lg mb-3">
            {movie.title}
            </h1>

            <p className="text-white/90 text-sm sm:text-base mb-2">
            ⭐ {movie.vote_average.toFixed(1)} · {movie.release_date?.slice(0, 4)}
            {movie.runtime ? ` · ${movie.runtime}분` : ''}
            {director ? ` · 감독 ${director}` : ''}
            </p>

            {movie.genres?.length > 0 && (
            <p className="text-white/80 text-sm mb-2">
                장르: {movie.genres.map((g) => g.name).join(', ')}
            </p>
            )}

            {movie.tagline && (
            <p className="italic text-white/70 mb-2">"{movie.tagline}"</p>
            )}

            {movie.overview && (
            <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                {movie.overview}
            </p>
            )}
        </div>
        </div>
    </div>
    </section>

    {credits?.cast?.length ? (
    <div className="p-6 mt-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6">감독/출연</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
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
    </>
  );
}