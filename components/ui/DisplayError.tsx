import styles from "../../styles/ui/Error.module.scss";

import { Variables } from "../../../variables";

import { useLanguageContext } from "../../contexts/languageContext";
import { useErrorContext } from "../../contexts/errorContext";

import { ERROR_ACTION_TYPE, ERROR_CODE, IBackgroundImage, IErrorManagement, LANGUAGE, Route } from "../../interfaces";

import BackgroundImage from "./BackgroundImage";

interface IDisplayErrorProps {
	route: Route | null
}

function getTranslatedTitle() {
	const { language, } = useLanguageContext();

	switch (language) {
		case LANGUAGE.FRENCH: return "Une erreur est survenue";
		case LANGUAGE.DUTCH: return "Er is een fout opgetreden";
		case LANGUAGE.ENGLISH: return "Something went wrong";
		default: return "Une erreur est survenue";
	}
}

function getTranslatedDefaultMessage() {
	const { language, } = useLanguageContext();

	switch (language) {
		case LANGUAGE.FRENCH: return "Veuillez réessayer ou vous adresser au guichet";
		case LANGUAGE.DUTCH: return "Probeer het nog eens opnieuw of ga naar het loket";
		case LANGUAGE.ENGLISH: return "Please try again or contact the reception";
		default: return "Veuillez réessayer ou vous adresser au guichet";
	}
}

function getErrorImage(image: IErrorManagement, errorCode?: ERROR_CODE, serviceId?: string): IBackgroundImage {
	switch (errorCode) {
		case ERROR_CODE.C500: {
			if (image.serviceClosed) {
				if (serviceId && image.serviceClosed[serviceId]) {
					return image.serviceClosed[serviceId];
				} else {
					return image.serviceClosed["default"];
				}
			}

			return image.genericError;
		}
		case ERROR_CODE.A503: return image.notConnectedToInternet ?? image.genericError;
		case ERROR_CODE.C503: return image.noPaper ?? image.genericError;
		case ERROR_CODE.A408: return image.eIdTimeout ?? image.genericError;
		default: return image.genericError;
	}
}

export default function DisplayError(props: IDisplayErrorProps): JSX.Element {
	const { route, } = props;

	const { errorState, dispatchErrorState, } = useErrorContext();

	function clickHandler() {
		dispatchErrorState({
			type: ERROR_ACTION_TYPE.CLEARERROR,
			payload: undefined,
		});
	}

	function devClick() {
		if (Variables.PREVIEW) {
			clickHandler();
		}
	}

	if (route?.errorManagement) {
		const image = getErrorImage(route.errorManagement, errorState.errorCode, errorState.errorServiceId);
		return (
			<div className={styles.error_management_main} onTouchEnd={clickHandler} onClick={devClick}>
				{image === route.errorManagement.genericError &&
					<div className={styles.error_management_message}>
						<p>{errorState.message ? errorState.message : "An unexpected error occured"}</p>
						{errorState.errorCode && <p id={styles.error_code}>Error code: <b>{errorState.errorCode}</b></p>}
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
						<p>{errorState.message ? "Message: " + errorState.message : getTranslatedDefaultMessage()}</p>
					</div>
					{errorState.errorCode !== ERROR_CODE.C503 && <button onTouchEnd={clickHandler} onClick={devClick}>OK</button>}
					{errorState.errorCode && <p id={styles.error_code}>Error code: <b>{errorState.errorCode}</b></p>}
				</div>
			</div>
		);
	}
}
