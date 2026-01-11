import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Settings, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-stone-200 dark:border-border-dark px-4 sm:px-6 md:px-10 py-3">
      <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
        <div className="size-6 text-primary">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Zaman Makinesi Fotoğrafları</h2>
        {user && (
          <div className="flex items-center gap-2 ml-4">
            <div className="px-3 py-1 bg-yellow-400/20 dark:bg-yellow-400/30 rounded-lg border border-yellow-400">
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-300">
                💎 {user.credits} Kredi
              </span>
            </div>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-3 py-1 bg-primary text-background-dark text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Kredi Yükle
            </button>
          </div>
        )}
      </div>
      <nav className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
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
            <Sun className="w-5 h-5 text-primary" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </button>
        {user && isAdmin && (
          <button
            onClick={() => window.location.href = '/admin'}
            className="flex items-center justify-center gap-2 bg-primary text-background-dark font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Admin Paneli
          </button>
        )}
        {user && (
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 text-sm font-medium text-text-light dark:text-text-dark hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
