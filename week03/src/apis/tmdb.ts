// src/apis/tmdb.ts
import axios from 'axios';

export const TMDB_IMAGE = (
  path?: string | null,
  size: 'w200'|'w300'|'w500'|'original' = 'w300'
) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.png');

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { language: 'ko-KR' },
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_TMDB_TOKEN?.trim();
  
  if (token) 
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;