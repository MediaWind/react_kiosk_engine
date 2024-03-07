import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import resources from "./lib/i18nTranslations.json";
import route from "./route_template.json";

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: route.languages[0],
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
