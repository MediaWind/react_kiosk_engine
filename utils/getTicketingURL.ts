import { Variables } from "../../variables";

import { ITicketDataState } from "../interfaces";

export default function getTicketingURL(ticketState: ITicketDataState): URL {
	const baseURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/ticket.php?`;
	let params = `
	id_project=${Variables.W_ID_PROJECT}
	&serial=${Variables.SERIAL_PLAYER}
	&id_service=${ticketState.service?.serviceID}
	&priority=${ticketState.service?.priority ?? 1}
	&lang=${ticketState.language ?? "fr"}
	`;

	if (ticketState.eIdDatas != null) {
		params += `&firstname=${encodeURIComponent(ticketState.eIdDatas.firstName)}&lastname=${encodeURIComponent(ticketState.eIdDatas.lastName)}`;
		return new URL(baseURL + params);
	} else if (ticketState.textInputDatas) {
		//TODO: text input ids must dynamically change
		//? For now they are hard coded to each specific projet
		const lastname = ticketState.textInputDatas.find((input) => input.id === "patient_lastname");
		const firstname = ticketState.textInputDatas.find((input) => input.id === "patient_firstname");

		params += `&firstname=${encodeURIComponent(firstname?.value ?? "")}&lastname=${encodeURIComponent(lastname?.value ?? "")}`;
	}

	return new URL(baseURL + params);
}
