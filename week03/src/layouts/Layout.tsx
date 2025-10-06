// src/components/Layout.tsx
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function Layout() {
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [style, setStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const nav = [
    { to: '/', label: '홈', exact: true },
    { to: '/popular', label: '인기 영화' },
    { to: '/upcoming', label: '개봉 예정' },
    { to: '/top-rated', label: '평점 높은' },
    { to: '/now-playing', label: '상영 중' },
  ];

  const base = 'text-black hover:text-red-600 transition-colors';
  const active = 'text-red-600 font-bold';

  // 활성 링크 위치를 <ul> 기준으로 계산
  const measure = () => {
    const ul = listRef.current;
    if (!ul) return;
    // NavLink가 활성일 때 a[aria-current="page"]가 붙음
    const activeA = ul.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!activeA) return;
    const ulRect = ul.getBoundingClientRect();
    const aRect = activeA.getBoundingClientRect();
    setStyle({ left: aRect.left - ulRect.left, width: aRect.width });
  };

  useLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-dvh">
      <nav className="fixed top-0 left-0 w-full h-14 px-5 flex items-center bg-white shadow-md z-50">
        <ul ref={listRef} className="relative flex gap-6 mx-auto">
          {nav.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink to={to} end={exact} className={({ isActive }) => (isActive ? active : base)}>
                {label}
              </NavLink>
            </li>
          ))}
          {/* 슬라이딩 밑줄: 한 줄만 두고 위치/너비만 바꿈 */}
          <span
            className="absolute -bottom-1 h-[2px] bg-red-600 rounded-full transition-all duration-300"
            style={{ left: style.left, width: style.width }}
          />
        </ul>
      </nav>

      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}