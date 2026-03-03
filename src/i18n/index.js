import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import pa from './locales/pa.json';

// Language code mapping — maps native language names (used in LanguageContext) to i18n codes
export const LANGUAGE_MAP = {
    'English (India)': 'en',
    'हिन्दी': 'hi',
    'తెలుగు': 'te',
    'मराठी': 'mr',
    'বাংলা': 'bn',
    'தமிழ்': 'ta',
    'ਪੰਜਾਬੀ': 'pa',
};

// Reverse map: i18n code -> native name
export const CODE_TO_NATIVE = Object.fromEntries(
    Object.entries(LANGUAGE_MAP).map(([native, code]) => [code, native])
);

// Full language list for UI selectors
export const LANGUAGES = [
    { code: 'en', name: 'English (India)', native: 'English (India)', short: 'EN' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', short: 'HI' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', short: 'TE' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', short: 'MR' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', short: 'BN' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', short: 'TA' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', short: 'PA' },
];

// Helper to get i18n code from native language name
export const getCodeFromNative = (native) => LANGUAGE_MAP[native] || 'en';

// Helper to get native name from i18n code
export const getNativeFromCode = (code) => CODE_TO_NATIVE[code] || 'English (India)';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            te: { translation: te },
            mr: { translation: mr },
            bn: { translation: bn },
            ta: { translation: ta },
            pa: { translation: pa },
        },
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        react: {
            useSuspense: false, // Prevents Suspense issues during initial render
        },
    });

export default i18n;
