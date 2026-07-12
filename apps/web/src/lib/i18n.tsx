import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '~/locales/en/common.json' with { type: 'json' };
import frCommon from '~/locales/fr/common.json' with { type: 'json' };

const resources = {
  en: {
    translation: enCommon,
  },
  fr: {
    translation: frCommon,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
