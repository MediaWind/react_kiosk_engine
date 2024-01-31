import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IFlow, IPrintAction, ITicketDataState, PRINT_ACTION_TYPE } from "../interfaces";

import getTicketingURL from "../utils/getTicketingURL";

export default function useTicket(dispatchPrintState: React.Dispatch<IPrintAction>, dispatchError: React.Dispatch<IErrorAction>): [CallableFunction] {
	async function createTicket(ticketState: ITicketDataState, flow: IFlow) {
		console.log("Creating ticket: ", ticketState);

		try {
			const response = await fetch(getTicketingURL(ticketState, flow));
			const data = await response.json();

			if (data.status == 1) {
				dispatchPrintState({
					type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
					payload: data.pdf,
				});
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

	return [createTicket];
}
