import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

const i18nextInstance = i18next.createInstance();
const initI18n = async () => {
  try {
    await i18nextInstance.use(initReactI18next).init({
      lng: 'ru',
      resources,
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error('Ошибка при инициализации i18next:', error);
  }
};

export default i18nextInstance;
export { initI18n };
