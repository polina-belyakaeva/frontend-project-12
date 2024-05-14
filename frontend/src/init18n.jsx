import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

const init18n = i18next
  .use(initReactI18next)
  .init({
        lng: 'ru',
        resources,
        debug: false,
        interpolation: {
          escapeValue: false,
        },
  });

export default init18n;