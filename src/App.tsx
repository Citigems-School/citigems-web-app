import React from 'react';
import useCheckAuth from './hooks/useCheckAuth';
import Routes from "./routes"
import './index.less';
import { initReactI18next } from 'react-i18next';
import i18n from "i18next";
import i18n_en from "./i18n/locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    debug: true, // React already does escaping
    resources: {
      en: {
        translation: i18n_en
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    saveMissing: true,
    missingKeyHandler: (languages, ns, key) => {
      if (!key.startsWith("assets/"))
        console.warn(key + " is missing in this language");
    }
  })
  .then();

function App() {

  useCheckAuth();


  return (
    <>
      <Routes />
    </>
  );
}

export default App;
