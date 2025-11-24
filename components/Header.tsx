import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-stone-200 dark:border-border-dark px-4 sm:px-6 md:px-10 py-3">
      <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
        <div className="size-6 text-primary">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Zaman Makinesi Fotoğrafları</h2>
      </div>
      <nav className="flex flex-1 justify-end gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-9">
          <a className="text-sm font-medium leading-normal text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">Galeri</a>
          <a className="text-sm font-medium leading-normal text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">SSS</a>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 dark:bg-surface-dark border border-stone-200 dark:border-border-dark hover:bg-stone-200 dark:hover:bg-border-dark transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
