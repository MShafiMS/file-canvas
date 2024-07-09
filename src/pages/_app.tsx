import { ErrorBoundary } from '@/components/core';
import { ColorModeContext } from '@config/color-mode-context';
import { getTheme } from '@config/themes';
import { Layout, StorageKey, Theme } from '@enums';
import { SidebarLayout } from '@layouts';
import { createTheme, PaletteMode, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Store } from '@services';
import '@styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  layout: string;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { route, push, isReady } = useRouter();
  const { layout } = Component;

  const [mode, setMode] = useState<PaletteMode>();
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
        localStorage.setItem(StorageKey.THEME, newMode);
        setMode(newMode);
      },
    }),
    [mode],
  );

  const theme = useMemo(() => {
    if (mode) return createTheme(getTheme(mode));
  }, [mode]);

  const getLayout = () => {
    switch (layout) {
      case Layout.AUTH:
        return <Component {...pageProps} />;
      case Layout.SIDEBAR:
        return (
          <SidebarLayout>
            <Component {...pageProps} />
          </SidebarLayout>
        );
      default:
        return <Component {...pageProps} />;
    }
  };

  useEffect(() => {
    const selectedTheme = Store.get(StorageKey.THEME) as PaletteMode;
    const systemMode: PaletteMode = prefersDarkMode ? Theme.DARK : Theme.LIGHT;
    setMode(selectedTheme || systemMode);
  }, [prefersDarkMode]);

  if (!theme || !isReady) return null;
  return (
    <ErrorBoundary>
      <Head>
        <title>FileCanvas</title>
        <meta name="description" content="FileCanvas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <div data-theme={mode}>{getLayout()}</div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ErrorBoundary>
  );
}
