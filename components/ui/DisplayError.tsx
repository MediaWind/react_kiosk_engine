import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "../../styles/ui/Error.module.scss";

import { Variables } from "../../../variables";

import { useErrorContext } from "../../contexts/errorContext";

import { ERROR_ACTION_TYPE, IBackgroundImage, IErrorManagement, Route } from "../../interfaces";
import { ERROR_CODE } from "../../lib/errorCodes";

import BackgroundImage from "./BackgroundImage";

interface IDisplayErrorProps {
	route: Route | null
}

const blackList = [ERROR_CODE.C503, ERROR_CODE.B400, ERROR_CODE.A415, ERROR_CODE.F500];

function getErrorImage(image: IErrorManagement, errorCode?: ERROR_CODE, serviceId?: string): IBackgroundImage {
	switch (errorCode) {
		case ERROR_CODE.C500: {
			if (image.serviceClosed) {
				if (serviceId && image.serviceClosed[serviceId]) {
					return image.serviceClosed[serviceId];
				} else if (image.serviceClosed["default"]) {
					return image.serviceClosed["default"];
				}
			}

			return image.genericError;
		}
		case ERROR_CODE.B429: {
			if (image.serviceQuotaLimitExceeded) {
				if (serviceId && image.serviceQuotaLimitExceeded[serviceId]) {
					return image.serviceQuotaLimitExceeded[serviceId];
				}	else if (image.serviceQuotaLimitExceeded["default"]) {
					return image.serviceQuotaLimitExceeded["default"];
				}
			}

			return image.genericError;
		}
		case ERROR_CODE.A503: return image.notConnectedToInternet ?? image.genericError;
		case ERROR_CODE.C503: return image.noPaper ?? image.genericError;
		case ERROR_CODE.A408: return image.eIdTimeout ?? image.genericError;
		case ERROR_CODE.A415: return image.unknownCard ?? image.genericError;
		case ERROR_CODE.B400: return image.unresponsiveCard ?? image.genericError;
		case ERROR_CODE.F500: return image.unreadableCard ?? image.genericError;
		default: return image.genericError;
	}
}

export default function DisplayError(props: IDisplayErrorProps): JSX.Element {
	const { route, } = props;

	const { errorState, dispatchErrorState, } = useErrorContext();
	const { t, } = useTranslation("errors");

	useEffect(() => {
		const delay = setTimeout(() => {
			if (route?.errorManagement && !blackList.includes(errorState.errorCode)) {
				clickHandler();
			}
		}, 10 * 1000);

		return () => {
			clearTimeout(delay);
		};
	}, []);

	function clickHandler() {
		if (!blackList.includes(errorState.errorCode)) {
			dispatchErrorState({
				type: ERROR_ACTION_TYPE.CLEARERROR,
				payload: undefined,
			});
		}
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
						<p>{errorState.message !== "" ? errorState.message : t("unsupported error message")}</p>
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
						<h1>{t("default title")}</h1>
						<p>{errorState.message !== "" ? "Message: " + errorState.message : t("default message")}</p>
					</div>
					{errorState.errorCode !== ERROR_CODE.C503 && <button onTouchEnd={clickHandler} onClick={devClick}>OK</button>}
					{errorState.errorCode && <p id={styles.error_code}>Error code: <b>{errorState.errorCode}</b></p>}
				</div>
			</div>
		);
	}
}
