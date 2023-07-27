import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { GeistProvider, CssBaseline } from '@geist-ui/core'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
    <GeistProvider>
      <CssBaseline />
        <Component {...pageProps} />
    </GeistProvider>
    </ChakraProvider>
  )
}
