import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import pushService from '../push';
import '../styles/globals.css';
import Swr from '../swr';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    pushService.init("/sw.js");
  }, [])

  return (
    <Swr>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: false,
            initialColorMode: 'light'
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Swr>
  )
}

export default MyApp


