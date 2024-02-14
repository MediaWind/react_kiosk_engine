import styles from "../../styles/ui/LoadingScreen.module.scss";

import { eIdStatus } from "../../../core/hooks/useEId";

import { useLanguageContext } from "../../contexts/languageContext";
import { useEIdContext } from "../../contexts/eIdContext";

import { IErrorManagement, LANGUAGE } from "../../interfaces";

import BackgroundImage from "./BackgroundImage";

interface ILoadingScreenProps {
	customImages?: IErrorManagement
}

function getDefaultText(lng?: LANGUAGE): string {
	switch (lng) {
		case LANGUAGE.DUTCH: return "Uw kaart wordt gelezen. Haal de kaart niet uit de terminal.";
		case LANGUAGE.ENGLISH: return "Your card is being read. Please do not remove it from the terminal.";
		case LANGUAGE.SPANISH: return "Su tarjeta está siendo leída. No la retire del terminal.";
		case LANGUAGE.FRENCH:
		default: return "Votre carte est en cours de lecture. Merci de ne pas la retirer du terminal.";
	}
}

export default function LoadingScreen(props: ILoadingScreenProps): JSX.Element {
	const { customImages, } = props;
	const { language, } = useLanguageContext();
	const { status, } = useEIdContext();

	if (status === eIdStatus.INSERTED && customImages?.eIdInserted) {
		return (
			<div className={styles.custom_image}>
				<BackgroundImage image={customImages.eIdInserted} />
			</div>
		);
	}

	return (
		<div className={styles.main}>
			<div className={`${styles.lds_ring}`}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			{status === eIdStatus.INSERTED && <p>{getDefaultText(language)}</p>}
		</div>
	);
}
