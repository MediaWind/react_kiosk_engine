import { ERROR_ACTION_TYPE, IErrorAction, IFlow, IPrintAction, ITicketDataState, PRINT_ACTION_TYPE } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

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

				if (data.status_reason) {
					switch (data.status_reason) {
						case "service_closed":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.C500,
									message: "Service is closed",
									errorServiceId: ticketState.service ? `${ticketState.service.serviceID}` : undefined,
								},
							});
							break;
						case "ticket_not_found":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.C404,
									message: "Ticket not found",
									errorServiceId: ticketState.service ? `${ticketState.service.serviceID}` : undefined,
								},
							});
							break;
						case "ticket_not_found_or_bad_status":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.C404,
									message: "Ticket not found or bad status",
									errorServiceId: ticketState.service ? `${ticketState.service.serviceID}` : undefined,
								},
							});
							break;
						case "service_not_found":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.F404,
									message: "Service not found",
									errorServiceId: ticketState.service ? `${ticketState.service.serviceID}` : undefined,
								},
							});
							break;
						default:
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.B500,
									message: data.status_reason,
									errorServiceId: ticketState.service ? `${ticketState.service.serviceID}` : undefined,
								},
							});
							break;
					}
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Unable to create ticket (Status 0)",
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
					message: "Error caught - Unable to create ticket",
				},
			});
		}
	}

	return [createTicket];
}
