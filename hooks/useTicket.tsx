import { useState } from "react";

// import { Variables } from "../../variables";

// import Printer from "../../core/client/printer";

import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IFlow, ITicketDataState } from "../interfaces";

import getTicketingURL from "../utils/getTicketingURL";

export default function useTicket(dispatchError: React.Dispatch<IErrorAction>): [CallableFunction, string | null] {
	const [ticketPDF, setTicketPDF] = useState<string | null>(null);

	async function createTicket(ticketState: ITicketDataState, flow: IFlow) {
		console.log("Creating ticket: ", ticketState);

		try {
			const response = await fetch(getTicketingURL(ticketState, flow));
			const data = await response.json();

			if (data.status == 1) {
				setTicketPDF(data.pdf);
			} else {
				console.log("Error: unable to create ticket. Data:", data);

				//TODO: add more error reason diversity
				if (data.status_reason == "service_closed") {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.C500,
							message: "Service closed",
						},
					});
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Unable to create ticket",
						},
					});
				}
			}
		} catch (err) {
			console.log(err);
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.B500,
					message: "Unable to create ticket",
				},
			});
		}
	}

	return [
		createTicket,
		ticketPDF
	];
}
