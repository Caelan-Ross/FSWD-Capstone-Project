import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* _app.js is loaded here */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
