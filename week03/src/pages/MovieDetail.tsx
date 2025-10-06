import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

class NavIndicator {
  private ul: HTMLUListElement;
  private indicator: HTMLSpanElement;

  constructor(ul: HTMLUListElement) {
    this.ul = ul;
    this.indicator = document.createElement('span');
    this.indicator.className =
      'absolute -bottom-1 h-[2px] bg-red-600 rounded-full transition-all duration-300';
    this.ul.appendChild(this.indicator);
  }

  update() {
    const active = this.ul.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!active) return;
    const ulRect = this.ul.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    this.indicator.style.left = `${aRect.left - ulRect.left}px`;
    this.indicator.style.width = `${aRect.width}px`;
  }

  destroy() {
    this.indicator.remove();
  }
}

export default function Layout() {
  const { pathname } = useLocation();
  const ulRef = useRef<HTMLUListElement | null>(null);
  const indicatorRef = useRef<NavIndicator | null>(null);

  useEffect(() => {
    if (!ulRef.current) return;
    indicatorRef.current = new NavIndicator(ulRef.current);
    indicatorRef.current.update();

    const handleResize = () => indicatorRef.current?.update();
    window.addEventListener('resize', handleResize);

    return () => {
      indicatorRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    indicatorRef.current?.update();
  }, [pathname]);

  const navItems = [
    { to: '/', label: '홈', exact: true },
    { to: '/popular', label: '인기 영화' },
    { to: '/upcoming', label: '개봉 예정' },
    { to: '/top-rated', label: '평점 높은' },
    { to: '/now-playing', label: '상영 중' },
  ];

  const base = 'text-black hover:text-red-600 transition-colors';
  const active = 'text-red-600 font-bold';

  return (
    <div className="min-h-dvh">
      <nav className="fixed top-0 left-0 w-full h-14 px-5 flex items-center bg-white shadow-md z-50">
        <ul ref={ulRef} className="relative flex gap-6 mx-auto">
          {navItems.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink to={to} end={exact} className={({ isActive }) => (isActive ? active : base)}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}