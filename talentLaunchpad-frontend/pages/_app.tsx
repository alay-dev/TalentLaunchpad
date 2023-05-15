import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Jost } from 'next/font/google'
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Provider } from 'react-redux';
import store from '@/config/store';

const jost = Jost({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"]
})

const theme = createTheme({
  typography: {
    fontFamily: [
      '__Jost_98c16d',
      'sans-serif'
    ].join(",")
  }
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className={jost.className}>
        <ThemeProvider theme={theme} >
          <Component {...pageProps} />
        </ThemeProvider>
      </main >
    </Provider>

  )
}
