import type { ReactElement, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import RootLayout from './layout';
import "./globals.css";
import "../components/index.scss";
import "./staff.scss";
import type { NextPage } from 'next'

// Custom type for pages with layout support
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={store}>
      <RootLayout>
        {getLayout(<Component {...pageProps} />)}
      </RootLayout>
    </Provider>
  );
};

export default MyApp;
