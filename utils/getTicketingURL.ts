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

	let paramsFirstName = "";
	let paramsLastName = "";
	let paramsNationalNumber = "";

	if (ticketState.textInputDatas) {
		const firstName = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.firstname);
		const lastName = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.lastname);
		const nationalNumber = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.nationalNumber);
		const email = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.email);
		const phone = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.phone);
		const company = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.company);
		const comment = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.comment);
		const idUserAgent = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.idUserAgent);

		paramsFirstName = encodeURIComponent(firstName?.value ?? "");
		paramsLastName = encodeURIComponent(lastName?.value ?? "");
		paramsNationalNumber = encodeURIComponent(nationalNumber?.value ?? "");

		params += `
		&email=${encodeURIComponent(email?.value ?? "")}
		&phone=${encodeURIComponent(phone?.value ?? "")}
		&company=${encodeURIComponent(company?.value ?? "")}
		&comment=${encodeURIComponent(comment?.value ?? "")}
		&id_userAgent=${encodeURIComponent(idUserAgent?.value ?? "")}
		`;
	}

	if (ticketState.eIdDatas) {
		paramsFirstName = encodeURIComponent(ticketState.eIdDatas.firstName);
		paramsLastName = encodeURIComponent(ticketState.eIdDatas.lastName);
		paramsNationalNumber = encodeURIComponent(ticketState.eIdDatas.nationalNumber);
	}

	params += `
	&firstname=${encodeURIComponent(paramsFirstName)}
	&lastname=${encodeURIComponent(paramsLastName)}
	&registre_national=${encodeURIComponent(paramsNationalNumber)}
	`;

	return new URL(baseURL + params);
}
