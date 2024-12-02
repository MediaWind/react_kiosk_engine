import { ERROR_ACTION_TYPE, IErrorAction, IFlow, IPrintAction, ITicketDataState, PRINT_ACTION_TYPE } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import { Console } from "../utils/console";
import fetchRetry from "../utils/fetchRetry";
import getTicketingURL from "../utils/getTicketingURL";

export default function useTicket(dispatchPrintState: React.Dispatch<IPrintAction>, dispatchError: React.Dispatch<IErrorAction>): [CallableFunction] {
	async function createTicket(ticketState: ITicketDataState, flow: IFlow) {
		Console.info("Creating ticket...");

		try {
			const response = await fetchRetry(getTicketingURL(ticketState, flow));
			const data = await response.json();

			if (data.status == 1) {
				if(data.pdf) {
					dispatchPrintState({
						type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
						payload: data.pdf,
					});
				} else {
					Console.error("Error when trying to create ticket - data.pdf: " + data.pdf, { fileName: "useTicket", functionName: "createTicket", lineNumber: 23, });
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Unable to create ticket (No PDF)",
						},
					});
				}
			} else {
				if (data.status_reason) {
					Console.error("Error when trying to create ticket - data.status_reason: " + data.status_reason, { fileName: "useTicket", functionName: "createTicket", lineNumber: 23, });
					switch (data.status_reason) {
						case "service_closed":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.C500,
									message: "Service is closed",
									errorServiceId: ticketState.service ? `${ticketState.service.serviceId}` : undefined,
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
									errorServiceId: ticketState.service ? `${ticketState.service.serviceId}` : undefined,
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
									errorServiceId: ticketState.service ? `${ticketState.service.serviceId}` : undefined,
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
									errorServiceId: ticketState.service ? `${ticketState.service.serviceId}` : undefined,
								},
							});
							break;
						case "quota_limit_exceeded":
							dispatchError({
								type: ERROR_ACTION_TYPE.SETERROR,
								payload: {
									hasError: true,
									errorCode: ERROR_CODE.B429,
									message: "Service quota limit exceeded",
									errorServiceId: ticketState.service?.serviceId ? `${ticketState.service.serviceId}` : undefined,
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
									errorServiceId: ticketState.service ? `${ticketState.service.serviceId}` : undefined,
								},
							});
							break;
					}
				} else {
					Console.error("Error when trying to create ticket - data status: " + data.status, { fileName: "useTicket", functionName: "createTicket", lineNumber: 82, });
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
			Console.error("Error caught when trying to create ticket", { fileName: "useTicket", functionName: "createTicket", lineNumber: 94, });
			Console.error(err);
			if (err instanceof Error) {
				if (err.message.split("-")[0].trim() === "fetchRetry") {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.A429,
							message: "Too many retries",
						},
					});
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Error caught - " + err.message,
						},
					});
				}
			} else {
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
	}

	return [createTicket];
}
