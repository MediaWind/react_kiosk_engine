import { createContext, useContext } from "react";

import { LANGUAGE } from "../interfaces";

type languageContext = {
	defaultLangue: LANGUAGE,
	language: LANGUAGE | undefined,
	setLanguage: React.Dispatch<React.SetStateAction<LANGUAGE | undefined>>
}

export const LanguageContext = createContext<languageContext>({
	defaultLangue: LANGUAGE.FRENCH,
	language: undefined,
	setLanguage: () => undefined,
});

export const useLanguageContext = () => useContext(LanguageContext);
