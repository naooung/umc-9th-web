import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';

export enum THEME {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

type TTheme = THEME;

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = (): void => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) 
    throw new Error("useTodo를 사용하기 위해서는, 무조선 TodoProvider로 감싸야 합니다.");

  return context;
};