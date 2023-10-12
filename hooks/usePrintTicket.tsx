import { useState } from "react";

import { Variables } from "../../variables";

import Printer from "../../core/client/printer";

import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IFlow, ITicketDataState } from "../interfaces";

import getTicketingURL from "../utils/getTicketingURL";

export default function usePrintTicket(dispatchError: React.Dispatch<IErrorAction>): [CallableFunction, boolean, CallableFunction] {
	const [isPrinting, setIsPrinting] = useState<boolean>(false);

	async function printTicket(ticketState: ITicketDataState, flow: IFlow) {
		if(!navigator.onLine) {
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.A503,
					message: "Kiosk is not connected to internet",
				},
			});
			return;
		}

		if (isPrinting) {
			return;
		}

		setIsPrinting(true);
		console.log("Printing!", ticketState);

		try {
			// Fetches ticket PDF
			const response = await fetch(`${getTicketingURL(ticketState, flow)}`);

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

					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.A500,
							message: "Could not print ticket",
						},
					});
				}
			} else {
				if (Variables.PREVIEW) {
					setTimeout(() => {
						setIsPrinting(false);
					}, 5000);
				} else {
					setIsPrinting(false);

					switch (data.status_reason) {
						case "service_closed":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.C500,
									message: "Service is closed",
								},
							});
							break;
						default:
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.B500,
									message: "Something went wrong when trying to fetch ticket PDF",
								},
							});
							break;
					}
				}
			}
		} catch (error) {
			console.log(error);
			setIsPrinting(false);

			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.B500,
					message: "Could not fetch ticket PDF",
				},
			});
		}
	}

	async function signInPatient(ticketState: ITicketDataState, flow: IFlow) {
		if(!navigator.onLine) {
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.A503,
					message: "Kiosk is not connected to internet",
				},
			});
			return;
		}

		if (isPrinting) {
			return;
		}

		try {
			const response = await fetch(`${getTicketingURL(ticketState, flow)}&comment=${encodeURI("No ticket needed")}`);
			console.log("🚀 ~ file: usePrintTicket.tsx:174 ~ signInPatient ~ response:", response);
		} catch (err) {
			console.log(err);
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.B500,
					message: "Could not save data",
				},
			});
		}
	}

	return [
		printTicket,
		isPrinting,
		signInPatient
	];
}
