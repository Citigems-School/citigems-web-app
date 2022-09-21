import React from 'react';
import useCheckAuth from './hooks/useCheckAuth';
import Routes from "./routes"
import './index.less';
import { initReactI18next } from 'react-i18next';
import i18n from "i18next";
import i18n_en from "./i18n/locales/en.json";
import i18n_fr from "./i18n/locales/fr.json";
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: { order: ["localStorage","navigator", "path"] },
    resources: {
      en: {
        translation: i18n_en
      },
      fr: {
        translation: i18n_fr
      }
    },
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
