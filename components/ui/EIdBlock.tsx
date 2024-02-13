import styles from "../../styles/ui/EIdBlock.module.scss";

import { useLanguageContext } from "../../contexts/languageContext";

import { IErrorManagement, LANGUAGE } from "../../interfaces";

import BackgroundImage from "./BackgroundImage";

interface IEIdBlockProps {
	customImages?: IErrorManagement
}

function getDefaultText(lng?: LANGUAGE): string {
	switch (lng) {
		case LANGUAGE.DUTCH: return "Haal je kaart op";
		case LANGUAGE.ENGLISH: return "Please remove your card";
		case LANGUAGE.SPANISH: return "Recoja su tarjeta";
		case LANGUAGE.FRENCH:
		default: return "Veuillez retirer votre carte";
	}
}

export default function EIdBlock(props: IEIdBlockProps): JSX.Element {
	const { customImages, } = props;
	const { language, } = useLanguageContext();

	if (customImages?.eIdRead) {
		return (
			<div className={styles.custom_image}>
				<BackgroundImage image={customImages.eIdRead} />
			</div>
		);
	}

	return (
		<div className={styles.main}>
			<div className={styles.container}>
				<p>{getDefaultText(language)}</p>
			</div>
		</div>
	);
}
