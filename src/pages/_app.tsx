import "@/styles/globals.css"
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import type { AppProps } from "next/app"
import router from "next/router"
import { useEffect } from "react"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (router.pathname === "/") {
      router.replace("/valorant")
    }
  }, [])
  const client = new QueryClient()
  return (
    <QueryClientProvider client={client}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}
