import { useState } from "react";

import { Variables } from "../../variables";

import Printer from "../../core/client/printer";

import { ERROR_CODE, ITicketDataState } from "../interfaces";

import getTicketingURL from "../utils/getTicketingURL";

export interface ICustomError {
	hasError: boolean;
	errorCode: ERROR_CODE;
	message?: string;
	clearError: CallableFunction;
}

export default function usePrintTicket(): [CallableFunction, boolean, ICustomError, CallableFunction, CallableFunction] {
	const [isPrinting, setIsPrinting] = useState<boolean>(false);
	const [hasError, setHasError] = useState<boolean>(false);
	const [errorCode, setErrorCode] = useState<ERROR_CODE>(ERROR_CODE.A200);
	const [message, setMessage] = useState<string>("");

	function clearError() {
		setHasError(false);
		setErrorCode(ERROR_CODE.A200);
		setMessage("");
	}

	async function checkPrinterStatus() {
		if (!Variables.PREVIEW) {
			const response = await fetch("http://localhost:5000/?random=" + Math.random() + "&action&infos_printer");
			const data = await response.json();

			if (data.connected == "yes") {
				if (data.status == undefined || data.status.status == 0) {
					setHasError(true);

					if (data.status.array_alerts.includes("No paper")) {
						setErrorCode(ERROR_CODE.C503);
						setMessage("No paper in the printer");
					} else {
						setErrorCode(ERROR_CODE.D503);
						setMessage("Printer error: " + data.status.array_alerts.join(", "));
					}
				} else {
					setHasError(false);
					setErrorCode(ERROR_CODE.A200);
					setMessage("");
				}
			} else {
				setHasError(true);
				setErrorCode(ERROR_CODE.B503);
				setMessage("Printer is not connected");
			}
		}
	}

	async function printTicket(ticketState: ITicketDataState) {
		if(!navigator.onLine) {
			setHasError(true);
			setErrorCode(ERROR_CODE.A503);
			setMessage("Kiosk is not connected to internet");
			return;
		}

		if (isPrinting) {
			return;
		}

		setIsPrinting(true);
		console.log("Printing!", ticketState);

		try {
			// Fetches ticket PDF
			const response = await fetch(`${getTicketingURL(ticketState)}`);

			const data = await response.json();

			if (data.status == 1 && !Variables.PREVIEW) {
				//* OK, can print
				try {
					const result = await Printer.print(data.pdf);

					if (result) {
						setTimeout(() => {
							setIsPrinting(false);
						}, 5000);
					}
				}
				catch (error) {
					console.log(error);

					setIsPrinting(false);
					setHasError(true);
					setErrorCode(ERROR_CODE.A500);
					setMessage("Could not print ticket");
				}
			} else {
				if (Variables.PREVIEW) {
					setTimeout(() => {
						setIsPrinting(false);
					}, 5000);
				} else {
					setIsPrinting(false);
					setHasError(true);

					switch (data.status_reason) {
						case "service_closed":
							setErrorCode(ERROR_CODE.C500);
							setMessage("Service is closed");
							break;
						default:
							setErrorCode(ERROR_CODE.B500);
							setMessage("Something went wrong");
							break;
					}
				}
			}
		} catch (error) {
			console.log(error);
			setIsPrinting(false);
			setHasError(true);
			setErrorCode(ERROR_CODE.B500);
			setMessage("Could not fetch ticket PDF");
		}
	}

	async function signInPatient(ticketState: ITicketDataState) {
		if(!navigator.onLine) {
			setHasError(true);
			setErrorCode(ERROR_CODE.A503);
			setMessage("Kiosk is not connected to internet");
			return;
		}

		if (isPrinting) {
			return;
		}

		try {
			const response = await fetch(`${getTicketingURL(ticketState)}&comment=${encodeURI("No ticket needed")}`);
			console.log("🚀 ~ file: usePrintTicket.tsx:174 ~ signInPatient ~ response:", response);
		} catch (err) {
			console.log(err);
			setHasError(true);
			setErrorCode(ERROR_CODE.B500);
			setMessage("Could not save data");
		}
	}

	return [
		printTicket,
		isPrinting,
		{
			hasError: hasError,
			errorCode: errorCode,
			message: message,
			clearError: clearError,
		},
		signInPatient,
		checkPrinterStatus
	];
}
