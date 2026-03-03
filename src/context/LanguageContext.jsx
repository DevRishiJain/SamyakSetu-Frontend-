import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCodeFromNative, getNativeFromCode } from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const { i18n } = useTranslation();

    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('language') || 'English (India)';
    });

    // Sync i18next language on mount and whenever `language` changes
    useEffect(() => {
        localStorage.setItem('language', language);
        const code = getCodeFromNative(language);
        if (i18n.language !== code) {
            i18n.changeLanguage(code);
        }
    }, [language, i18n]);

    // Wrapper that accepts either a native name or a language code
    const setLanguage = (value) => {
        // If it's a 2-letter code, convert to native name for backwards compat
        const native = value.length <= 3 ? getNativeFromCode(value) : value;
        setLanguageState(native);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
