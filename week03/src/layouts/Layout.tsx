// src/components/Layout.tsx
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  const base = 'text-black hover:text-blue-600 transition-colors';
  const active = 'text-blue-600 font-bold';

  return (
    <div className="min-h-dvh">
      <nav className="fixed top-0 left-0 w-full h-14 px-5 flex items-center bg-white shadow-md z-50">
        <ul className="flex gap-6 mx-auto">
          <li><NavLink to="/" end className={({isActive}) => isActive ? active : base}>홈</NavLink></li>
          <li><NavLink to="/popular" className={({isActive}) => isActive ? active : base}>인기 영화</NavLink></li>
          <li><NavLink to="/upcoming" className={({isActive}) => isActive ? active : base}>개봉 예정</NavLink></li>
          <li><NavLink to="/top-rated" className={({isActive}) => isActive ? active : base}>평점 높은</NavLink></li>
          <li><NavLink to="/now-playing" className={({isActive}) => isActive ? active : base}>상영 중</NavLink></li>
        </ul>
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}