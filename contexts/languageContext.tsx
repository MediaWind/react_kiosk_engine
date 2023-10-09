import { createContext, useContext } from "react";

import { LANGUAGE } from "../interfaces";

type languageContext = {
	language: LANGUAGE,
	setLanguage: React.Dispatch<React.SetStateAction<LANGUAGE>>
}

export const LanguageContext = createContext<languageContext>({
	language: LANGUAGE.ENGLISH,
	setLanguage: () => {return;},
});

export const useFlowContext = () => useContext(LanguageContext);
