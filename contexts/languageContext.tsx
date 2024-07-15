import { createContext, useContext } from "react";

import { LANGUAGE } from "../interfaces";

type languageContext = {
	defaultLangue: LANGUAGE,
	language: LANGUAGE,
	setLanguage: React.Dispatch<React.SetStateAction<LANGUAGE>>
}

export const LanguageContext = createContext<languageContext>({
	defaultLangue: LANGUAGE.FRENCH,
	language: LANGUAGE.FRENCH,
	setLanguage: () => LANGUAGE.FRENCH,
});

export const useLanguageContext = () => useContext(LanguageContext);
