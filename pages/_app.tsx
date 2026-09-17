import type { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Quarter Spoon Entertainment | QSE Umbrella Solutions</title>
        <meta name="description" content="Official platform for Quarter Spoon Entertainment and Mr Du Low umbrella brands." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/QS%20NETWORK%201.png" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
