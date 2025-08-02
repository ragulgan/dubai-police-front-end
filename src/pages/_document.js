import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load language config and initialization before interactive */}
        <Script src="/assets/lang-config.js" strategy="beforeInteractive" />
        <Script src="/assets/translation.js" strategy="beforeInteractive" />

        {/* Load Google Translate after the app becomes interactive */}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      </Head>
      <body>
        {/* Google Translate renders its widget into this div */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
