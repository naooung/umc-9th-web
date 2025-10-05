export type Category = 'popular' | 'upcoming' | 'top_rated' | 'now_playing';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  backdrop_path: string | null;
  tagline?: string;
}

export interface Credits {
  cast: { id: number; name: string; character?: string; profile_path: string | null }[];
  crew: { id: number; name: string; job?: string }[];
}