import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClerkProvider>
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
}
