import type { AppProps } from 'next/app';
import { Nunito } from "next/font/google";
import "@/styles/_global.scss";

const nunito = Nunito({ subsets: ["vietnamese"] });

export default function App({ Component, pageProps }: AppProps) {
  return <main className={nunito.className}>
    <Component {...pageProps} />
  </main>
}