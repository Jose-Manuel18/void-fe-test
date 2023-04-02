import "@/styles/globals.css"

import type { AppProps } from "next/app"
import router from "next/router"
import { useEffect } from "react"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (router.pathname === "/") {
      router.replace("/valorant")
    }
  }, [])

  return <Component {...pageProps} />
}
