import { useContext } from "react";

import styles from "../../styles/ui/Error.module.scss";

import { LanguageContext } from "../../contexts/languageContext";

import { ERROR_CODE, IBackgroundImage, IErrorManagement, LANGUAGE, Route } from "../../interfaces";

import BackgroundImage from "./BackgroundImage";

interface IDisplayErrorProps {
	errorCode?: ERROR_CODE
	message?: string
	onClick: CallableFunction
	route: Route | null
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

function getErrorImage(image: IErrorManagement, errorCode?: ERROR_CODE): IBackgroundImage {
	switch (errorCode) {
		case ERROR_CODE.C500: return image.serviceClosed ?? image.genericError;
		case ERROR_CODE.A503: return image.notConnectedToInternet ?? image.genericError;
		case ERROR_CODE.C503: return image.noPaper ?? image.genericError;
		default: return image.genericError;
	}
}

export default function DisplayError(props: IDisplayErrorProps): JSX.Element {
	const { errorCode, message, onClick, route, } = props;

	if (route?.errorManagement) {
		const image = getErrorImage(route.errorManagement, errorCode);
		return (
			<div className={styles.error_management_main}>
				{image === route.errorManagement.genericError &&
					<div className={styles.error_management_message}>
						<p>{message ? message : "An unexpected error occured"}</p>
						{errorCode && <p id={styles.error_code}>Error code: <b>{errorCode}</b></p>}
					</div>
				}
				<BackgroundImage image={image} />
			</div>
		);
	} else {
		return (
			<div className={styles.main}>
				<div className={styles.message}>
					<div>
						<h1>{getTranslatedTitle()}</h1>
						<p>{message ? "Message: " + message : getTranslatedDefaultMessage()}</p>
					</div>
					{errorCode !== ERROR_CODE.C503 && <button onClick={() => onClick()}>OK</button>}
					{errorCode && <p id={styles.error_code}>Error code: <b>{errorCode}</b></p>}
				</div>
			</div>
		);
	}
}
