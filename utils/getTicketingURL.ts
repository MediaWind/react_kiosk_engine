import { Variables } from "../../variables";

import { IFlow, ITicketDataState } from "../interfaces";

export default function getTicketingURL(ticketState: ITicketDataState, flow: IFlow): URL {
	let serviceId = ticketState.service?.serviceId;

	if (ticketState.service?.devServiceId && (process.env.NODE_ENV !== "production" || Variables.DOMAINE === "modules.greenplayer.com")) {
		serviceId = ticketState.service.devServiceId;
	}

	const baseURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/ticket.php?`;
	let params = `
	id_project=${Variables.W_ID_PROJECT}
	&serial=${Variables.SERIAL_PLAYER}
	&id_service=${serviceId}
	&priority=${ticketState.service?.priority ?? 1}
	&lang=${ticketState.language ?? "fr"}
	`;

	if (ticketState.eIdDatas) {
		params += `
		&firstname=${encodeURIComponent(ticketState.eIdDatas.firstName)}
		&lastname=${encodeURIComponent(ticketState.eIdDatas.lastName)}
		&registre_national=${encodeURIComponent(ticketState.eIdDatas.nationalNumber)}
		`;
	} else if (ticketState.textInputDatas) {
		const firstname = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.firstname);
		const lastname = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.lastname);
		const nationalNumber = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.nationalNumber);
		const email = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.email);
		const phone = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.phone);
		const company = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.company);
		const comment = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.comment);
		const idUserAgent = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.idUserAgent);

		params += `
		&firstname=${encodeURIComponent(firstname?.value ?? "")}
		&lastname=${encodeURIComponent(lastname?.value ?? "")}
		&registre_national=${encodeURIComponent(nationalNumber?.value ?? "")}
		&email=${encodeURIComponent(email?.value ?? "")}
		&phone=${encodeURIComponent(phone?.value ?? "")}
		&company=${encodeURIComponent(company?.value ?? "")}
		&comment=${encodeURIComponent(comment?.value ?? "")}
		&id_userAgent=${encodeURIComponent(idUserAgent?.value ?? "")}
		`;
	}

	return new URL(baseURL + params);
}
