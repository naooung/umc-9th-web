import { useEffect, useState } from 'react';
import api from '../apis/tmdb';
import type { Category, Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';

export default function MoviePage({ category }: { category: Category }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const { data } = await api.get<MovieResponse>(`/movie/${category}`, {
          params: { page },
          signal: ac.signal,
        });
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setErr('영화 목록을 불러오지 못했습니다.');
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [category, page]);

  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;

  if (loading) {
    return (
      <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-44 aspect-[2/3] animate-pulse rounded-2xl bg-neutral-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div
        className="
          grid gap-6
          [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] 
          mx-auto max-w-7xl p-6                                        
        "
      >
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          이전
        </button>

        <span className="flex items-center">{page} / {totalPages}</span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded ${page >= totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          다음
        </button>
      </div>
    </div>
  );
}