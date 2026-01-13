import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import styles from "../../styles/ui/Error.module.scss";

import { Variables } from "../../../variables";

import { useErrorContext } from "../../contexts/errorContext";

import { ERROR_ACTION_TYPE, IBackgroundImage, IErrorManagement, INextOpeningHourData, Route } from "../../interfaces";
import { ERROR_CODE } from "../../lib/errorCodes";

import BackgroundImage from "./BackgroundImage";
import fetchRetry from "../../utils/fetchRetry";
import dayjs from "dayjs";

interface IDisplayErrorProps {
	route: Route | null
}

const blackList = [ERROR_CODE.C503, ERROR_CODE.B400, ERROR_CODE.A415, ERROR_CODE.F500];

function getErrorImage(image: IErrorManagement, errorCode?: ERROR_CODE, serviceId?: string): IBackgroundImage {
	switch (errorCode) {
		case ERROR_CODE.C500: {
			if (image.serviceClosed) {
				if (serviceId && image.serviceClosed[serviceId]) {
					return image.serviceClosed[serviceId] as IBackgroundImage;
				} else if (image.serviceClosed["default"]) {
					return image.serviceClosed["default"] as IBackgroundImage;
				}
			}

			return image.genericError;
		}
		case ERROR_CODE.G500: {
			if (image.serviceDisabled) {
				if (serviceId && image.serviceDisabled[serviceId]) {
					return image.serviceDisabled[serviceId];
				} else if (image.serviceDisabled["default"]) {
					return image.serviceDisabled["default"];
				}
			}

			return image.genericError;
		}
		case ERROR_CODE.H500: {
			console.log(image);
			if (image.serviceClosedDay) {
				console.log("service closed day image", image.serviceClosedDay);
				if (serviceId && image.serviceClosedDay[serviceId]) {
					return image.serviceClosedDay[serviceId];
				} else if (image.serviceClosedDay["default"]) {
					return image.serviceClosedDay["default"];
				}
			}

			return image.genericError;
		}
		case ERROR_CODE.B429: {
			if (image.serviceQuotaLimitExceeded) {
				if (serviceId && image.serviceQuotaLimitExceeded[serviceId]) {
					return image.serviceQuotaLimitExceeded[serviceId];
				} else if (image.serviceQuotaLimitExceeded["default"]) {
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

async function getNextOpeningHour(serviceId: string, format: string | undefined): Promise<string | null> {
	const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&id_service=${serviceId}&all=1`;

	try {
		const serviceResponse = await fetchRetry(url);
		const data = await serviceResponse.json();

		if (!data || data.length === 0) return null;

		const service = data[0];
		const currentDayNumber = new Date().getDay();
		const schedule = service.schedule[currentDayNumber];

		// Get next opening hour
		const now = new Date();
		let nextOpeningHour = null;
		for (const slot of schedule) {
			const [h, m] = slot.hour_start.split(":").map(Number);

			const start = new Date();
			start.setHours(h, m, 0, 0);

			if (start > now) {
				nextOpeningHour = start;
				break;
			}
		}

		format = format ? format : "HH:mm";

		const nextOpeningHourFormated = nextOpeningHour
			? dayjs(nextOpeningHour).format(format)
			: null;

		return nextOpeningHourFormated;

	} catch (error) {
		console.error("Error fetching service schedule:", error);
		return null;
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

		const [nextOpeningHour, setNextOpeningHour] = React.useState<string | null>(null);
		const [noNextOpeningHourImg, setNoNextOpeningHourImg] = React.useState<IBackgroundImage | null>(null);

		const serviceId = errorState.errorServiceId && !errorState.errorServiceId.startsWith("{w_") ? errorState.errorServiceId : null;
		let serviceClosed = null;

		if (route?.errorManagement?.serviceClosed) {
			serviceClosed = route.errorManagement.serviceClosed[serviceId as string] ?? route.errorManagement.serviceClosed["default"];
		}

		const nextOpeningHourData = serviceClosed?.nextOpeningHour as INextOpeningHourData | undefined;

		// If C500 fetch next opening hour
		useEffect(() => {
			async function fetchNextOpeningHour() {
				if (
					errorState.errorCode === ERROR_CODE.C500 &&
					serviceId &&
					nextOpeningHourData
				) {
					const hour = await getNextOpeningHour(
						serviceId,
						nextOpeningHourData?.format
					);

					console.log("Next opening hour:", hour);

					if (!hour && nextOpeningHourData?.noNextOpeningHourImg) {
						setNoNextOpeningHourImg(nextOpeningHourData.noNextOpeningHourImg);
					}

					setNextOpeningHour(hour);
				} else {
					setNextOpeningHour(null);
				}
			}

			fetchNextOpeningHour();

		}, [errorState.errorCode, errorState.errorServiceId, route.errorManagement?.serviceClosed?.nextOpeningHour]);

		return (
			<div className={styles.error_management_main} onTouchEnd={clickHandler} onClick={devClick}>
				{image === route.errorManagement.genericError &&
					<div className={styles.error_management_message}>
						<p>{errorState.message !== "" ? errorState.message : t("unsupported error message")}</p>
						{errorState.errorCode && <p id={styles.error_code}>Error code: <b>{errorState.errorCode}</b></p>}
					</div>
				}

				{/* If C500 display next opening hour */}
				{nextOpeningHour &&
					<div style={{ ...nextOpeningHourData?.style, position: "absolute", zIndex: 2, }}>{nextOpeningHour}</div>
				}

				{
					noNextOpeningHourImg ?
						<BackgroundImage image={noNextOpeningHourImg} />
						:
						<BackgroundImage image={image} />
				}
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
