import dayjs from "dayjs";
import { Variables } from "../../variables";
import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IFlow, IPrintAction, ITicketDataState, PRINT_ACTION_TYPE } from "../interfaces";

import getTicketingURL from "../utils/getTicketingURL";
import { testPDF } from "../utils/testPDF";

export default function useTicket(dispatchPrintState: React.Dispatch<IPrintAction>, dispatchError: React.Dispatch<IErrorAction>): [CallableFunction] {
	async function createTicket(ticketState: ITicketDataState, flow: IFlow) {
		console.log(dayjs().unix() + " - useTicket - createTicket:10 - ticketState: ", ticketState);

		try {
			const response = await fetch(getTicketingURL(ticketState, flow));
			console.log(dayjs().unix() + " - useTicket - createTicket:14 - response status: ", response.status);
			const data = await response.json();
			console.log(dayjs().unix() + " - useTicket -createTicket:16 - data:", data);

			if (data.status == 1) {
				dispatchPrintState({
					type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
					payload: data.pdf,
				});
			} else {
				if (!Variables.PREVIEW) {
					console.log("Error: unable to create ticket. Data:", data);

					//TODO: add more error reason diversity
					if (data.status_reason == "service_closed") {
						dispatchError({
							type: ERROR_ACTION_TYPE.SETERROR,
							payload: {
								hasError: true,
								errorCode: ERROR_CODE.C500,
								message: "Service closed",
								errorServiceId: ticketState.service ? `${ticketState.service.serviceID}` : undefined,
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
				} else {
					dispatchPrintState({
						type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
						payload: testPDF,
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
