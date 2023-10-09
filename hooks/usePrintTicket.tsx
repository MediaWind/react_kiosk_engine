import { useState } from "react";

import { Variables } from "../../variables";

import { eIdData } from "../../core/hooks/useEId";
import { DefaultVariables } from "../../core/variables";
import Printer from "../../core/client/printer";

import { ERROR_CODE, IInputField, IService, ITicketDataState, LANGUAGE } from "../interfaces";

interface ICustomError {
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

	function getTicketingURL(eIdData: eIdData | null, inputTextData?: IInputField[], service?: IService, lang?: LANGUAGE): URL | void {
		const baseURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/ticket.php?`;
		let params = `
		id_project=${Variables.W_ID_PROJECT}
		&serial=${DefaultVariables.SERIAL_PLAYER}
		&id_service=${service?.serviceID}
		&priority=${service?.priority ?? 1}
		&lang=${lang ?? "fr"}
		`;

		if (eIdData != null) {
			params += `&firstname=${encodeURIComponent(eIdData.firstName)}&lastname=${encodeURIComponent(eIdData.lastName)}`;
			return new URL(baseURL + params);
		} else if (inputTextData) {
			//TODO: text input ids must dynamically change
			//? For now they are hard coded to each specific projet
			const lastname = inputTextData.find((input) => input.id === "patient_lastname");
			const firstname = inputTextData.find((input) => input.id === "patient_firstname");

			params += `&lastname=${encodeURIComponent(lastname?.value ?? "")}&firstname=${encodeURIComponent(firstname?.value ?? "")}`;
			return new URL(baseURL + params);
		} else {
			setHasError(true);
			setErrorCode(ERROR_CODE.A400);
			setMessage("No user data");
		}
	}

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
		console.log("Printing!", ticketState.eIdDatas, ticketState.textInputDatas, ticketState.service, ticketState.language);

		try {
			// Fetches ticket PDF
			const response = await fetch(`${getTicketingURL(ticketState.eIdDatas, ticketState.textInputDatas, ticketState.service, ticketState.language)}`);

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
			const response = await fetch(`
				${getTicketingURL(ticketState.eIdDatas, ticketState.textInputDatas, ticketState.service, ticketState.language)}
				&comment=${encodeURI("No ticket needed")}
			`);
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
