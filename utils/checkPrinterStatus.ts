import { Variables } from "../../variables";

import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IErrorState } from "../interfaces";

export default function checkPrinterStatus(dispatchError: React.Dispatch<IErrorAction>, currentError: ERROR_CODE) {
	if (!Variables.PREVIEW) {
		//? Checks if there is already an error not related to the printer status
		//? This prevents an ok printer status from wiping an unrelated error too soon
		if (![ERROR_CODE.A200, ERROR_CODE.B503, ERROR_CODE.C503, ERROR_CODE.D503].includes(currentError)) {
			setTimeout(() => {
				check();
				return;
			}, 10 * 1000);
		}

		check();
	}

	async function check() {
		const response = await fetch("http://localhost:5000/?random=" + Math.random() + "&action&infos_printer");
		const data = await response.json();
		let hasError = false;
		let errorCode = ERROR_CODE.A200;
		let message = "";

		if (data.connected == "yes") {
			if (data.status == undefined || data.status.status == 0) {
				hasError = true;

				if (data.status.array_alerts.includes("No paper")) {
					errorCode = ERROR_CODE.C503;
					message = "No paper in the printer";
				} else {
					errorCode = ERROR_CODE.D503;
					message = "Printer error: " + data.status.array_alerts.join(", ");
				}
			} else {
				hasError = false;
				errorCode = ERROR_CODE.A200;
				message = "";
			}
		} else {
			hasError = true;
			errorCode = ERROR_CODE.B503;
			message = "Printer is not connected";
		}

		dispatchError({
			type: ERROR_ACTION_TYPE.SETERROR,
			payload: {
				hasError,
				errorCode,
				message,
			} as IErrorState,
		});
	}
}
