import { createContext, useContext } from "react";

type languageContext = {
	defaultLangue: string,
	language: string,
	setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export const LanguageContext = createContext<languageContext>({
	defaultLangue: "fr",
	language: "fr",
	setLanguage: () => "fr",
});

export const useLanguageContext = () => useContext(LanguageContext);
