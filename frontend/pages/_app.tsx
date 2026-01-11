import type { AppProps } from 'next/app';
import { AuthProvider } from '../src/shared/context/AuthContext';
import { AppProvider } from '../src/shared/context/AppContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  );
}
