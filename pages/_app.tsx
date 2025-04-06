import "@/styles/_global.scss";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import { Nunito } from "next/font/google";
import { ToastContainer } from "react-toastify";

const nunito = Nunito({ subsets: ["vietnamese"] });

export default function App({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}>
    <main className={nunito.className}>
      <Component {...pageProps} />
      <ToastContainer />
    </main>
  </SessionProvider>
}