import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // Use window.location.pathname or hash
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    // If hash routing is used or pathname
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', path);
    } catch {
      // Fallback for iframe restrictions
      window.location.hash = path;
    }
    setCurrentPath(path);
  }, []);

  // Parse dynamic params
  const params: Record<string, string> = {};
  if (currentPath.startsWith('/materials/')) {
    params.id = currentPath.replace('/materials/', '').split('?')[0];
  } else if (currentPath.startsWith('/building/')) {
    params.id = currentPath.replace('/building/', '').split('?')[0];
  } else if (currentPath.startsWith('/green-plan/')) {
    params.id = currentPath.replace('/green-plan/', '').split('?')[0];
  }

  return (
    <NavigationContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useRouter must be used within NavigationProvider');
  return context;
}
