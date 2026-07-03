import { useEffect, useState } from 'react';

const STORAGE_KEY = 'catalogo-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme) return storedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button className="icon-button" type="button" onClick={() => setTheme(nextTheme)}>
      {theme === 'dark' ? 'Claro' : 'Escuro'}
    </button>
  );
}
