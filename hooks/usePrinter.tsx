import { useState } from "react";

import Printer from "../../core/client/printer";

import { Variables } from "../../variables";

import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IErrorState } from "../interfaces";

export default function usePrinter(dispatchError: React.Dispatch<IErrorAction>): [CallableFunction, boolean, CallableFunction] {
	const [isPrinting, setIsPrinting] = useState<boolean>(false);

	async function checkPrinterStatus(currentErrorCode: ERROR_CODE) {
		if (Variables.PREVIEW) {
			return;
		}

		//? Checks if there is already an error not related to the printer status
		//? This prevents an ok printer status from wiping an unrelated error too soon
		if (![ERROR_CODE.A200, ERROR_CODE.B503, ERROR_CODE.C503, ERROR_CODE.D503].includes(currentErrorCode)) {
			return;
		}

		if (!navigator.onLine) {
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

		try {
			const response = await fetch("http://localhost:5000/?random=" + Math.random() + "&action&infos_printer");
			const data = await response.json();

			if (data.connected !== "yes") {
				dispatchError({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.B503,
						message: "Printer is not connected",
					} as IErrorState,
				});
			} else if (data.status == undefined || data.status.status == 0) {
				if (data.status.array_alerts.includes("No paper")) {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.C503,
							message: "No paper in the printer",
						} as IErrorState,
					});
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.D503,
							message: "Printer error: " + data.status.array_alerts.join(", "),
						} as IErrorState,
					});
				}
			} else {
				dispatchError({ type: ERROR_ACTION_TYPE.CLEARERROR, });
			}
		} catch (error) {
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.D503,
					message: "Unable to check printer status",
				} as IErrorState,
			});
		}
	}

	async function print(pdf: string) {
		if (isPrinting) {
			// setTimeout(() => {
			// 	print(pdf);
			// }, 1000);
			return;
		}

		console.log("Printing!", pdf);
		setIsPrinting(true);

		try {
			if (!Variables.PREVIEW) {
				const result = await Printer.print(pdf);

				if (!result) {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.A500,
							message: "Unable to print ticket PDF",
						} as IErrorState,
					});
				}
			}
		} catch (err) {
			console.log(err);
		} finally {
			setTimeout(() => {
				setIsPrinting(false);
			}, 5 * 1000);
		}
	}

	return [
		print,
		isPrinting,
		checkPrinterStatus
	];
}
