import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Script from 'next/script';
import { AuthProvider } from '../src/features/auth/context/AuthContext';
import { AppProvider, useAppContext } from '../src/shared/context/AppContext';
import '../styles/globals.css';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useAppContext();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <AppProvider>
          <ThemeWrapper>
            <Component {...pageProps} />
          </ThemeWrapper>
        </AppProvider>
      </AuthProvider>
    </>
  );
}
