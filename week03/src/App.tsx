import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import MoviePage from './pages/MoviePage';
import MovieDetail from './pages/MovieDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MoviePage category="popular" />} />
        <Route path="popular" element={<MoviePage category="popular" />} />
        <Route path="upcoming" element={<MoviePage category="upcoming" />} />
        <Route path="top-rated" element={<MoviePage category="top_rated" />} />
        <Route path="now-playing" element={<MoviePage category="now_playing" />} />

        <Route path="movies/:movieId" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
}