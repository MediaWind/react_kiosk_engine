import { useContext } from "react";

import styles from "../../styles/ui/Error.module.scss";

import { LanguageContext } from "../../contexts/languageContext";

import { ERROR_CODE, LANGUAGE } from "../../interfaces";

interface IDisplayErrorProps {
	errorCode?: ERROR_CODE
	message?: string
	onClick: CallableFunction
}

function getTranslatedTitle() {
	const { language, } = useContext(LanguageContext);

	switch (language) {
		case LANGUAGE.FRENCH: return "Une erreur est survenue";
		case LANGUAGE.DUTCH: return "Er is een fout opgetreden";
		case LANGUAGE.ENGLISH: return "Something went wrong";
		default: return "Une erreur est survenue";
	}
}

function getTranslatedDefaultMessage() {
	const { language, } = useContext(LanguageContext);

	switch (language) {
		case LANGUAGE.FRENCH: return "Veuillez réessayer ou vous adresser au guichet";
		case LANGUAGE.DUTCH: return "Probeer het nog eens opnieuw of ga naar het loket";
		case LANGUAGE.ENGLISH: return "Please try again or contact the reception";
		default: return "Veuillez réessayer ou vous adresser au guichet";
	}
}

export default function DisplayError(props: IDisplayErrorProps): JSX.Element {
	const { errorCode, message, onClick, } = props;

	return (
		<div className={styles.main}>
			<div className={styles.message}>
				<div>
					<h1>{getTranslatedTitle()}</h1>
					<p>{message ? "Message: " + message : getTranslatedDefaultMessage()}</p>
				</div>
				<button onClick={() => onClick()}>OK</button>
				{errorCode && <p id={styles.error_code}>Code erreur: <b>{errorCode}</b></p>}
			</div>
		</div>
	);
}
