import { Variables } from "../../variables";

import { IFlow, ITicketDataState } from "../interfaces";

export default function getTicketingURL(ticketState: ITicketDataState, flow: IFlow): URL {
	const baseURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/ticket.php?`;
	let params = `
	id_project=${Variables.W_ID_PROJECT}
	&serial=${Variables.SERIAL_PLAYER}
	&id_service=${ticketState.service?.serviceID}
	&priority=${ticketState.service?.priority ?? 1}
	&lang=${ticketState.language ?? "fr"}
	`;

	if (ticketState.eIdDatas != null) {
		params += `
		&firstname=${encodeURIComponent(ticketState.eIdDatas.firstName)}
		&lastname=${encodeURIComponent(ticketState.eIdDatas.lastName)}
		&registre_national=${encodeURIComponent(ticketState.eIdDatas.nationalNumber)}
		`;
	} else if (ticketState.textInputDatas) {
		const firstname = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.firstname);
		const lastname = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.lastname);
		const email = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.email);
		const phone = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.phone);
		const company = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.company);
		const comment = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.comment);
		const idUserAgent = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.id_userAgent);

		params += `
		&firstname=${encodeURIComponent(firstname?.value ?? "")}
		&lastname=${encodeURIComponent(lastname?.value ?? "")}
		&email=${encodeURIComponent(email?.value ?? "")}
		&phone=${encodeURIComponent(phone?.value ?? "")}
		&company=${encodeURIComponent(company?.value ?? "")}
		&comment=${encodeURIComponent(comment?.value ?? "")}
		&id_userAgent=${encodeURIComponent(idUserAgent?.value ?? "")}
		`;
	}

	return new URL(baseURL + params);
}
