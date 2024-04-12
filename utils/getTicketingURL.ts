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
	let paramsBirthDate = "";
	let paramsAddress = "";
	let paramsZipAndCity = "";

	if (ticketState.textInputDatas) {
		const firstName = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.firstname);
		const lastName = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.lastname);
		const birthDate = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.birthDate);
		const address = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.address);
		const zipAndCity = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.zipAndCity);
		const nationalNumber = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.nationalNumber);
		const email = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.email);
		const phone = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.phone);
		const company = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.company);
		const comment = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.comment);
		const idUserAgent = ticketState.textInputDatas.find((input) => input.id === flow.ticketParameters?.idUserAgent);

		paramsFirstName = firstName?.value ?? "";
		paramsLastName = lastName?.value ?? "";
		paramsNationalNumber = nationalNumber?.value ?? "";
		paramsBirthDate = birthDate?.value ?? "";
		paramsAddress = address?.value ?? "";
		paramsZipAndCity = zipAndCity?.value ?? "";

		params += `
		&email=${encodeURIComponent(email?.value ?? "")}
		&phone=${encodeURIComponent(phone?.value ?? "")}
		&company=${encodeURIComponent(company?.value ?? "")}
		&comment=${encodeURIComponent(comment?.value ?? "")}
		&id_userAgent=${encodeURIComponent(idUserAgent?.value ?? "")}
		`;
	}

	if (ticketState.eIdDatas) {
		paramsFirstName = ticketState.eIdDatas.firstName;
		paramsLastName = ticketState.eIdDatas.lastName;
		paramsNationalNumber = ticketState.eIdDatas.nationalNumber;
		paramsBirthDate = ticketState.eIdDatas.dateOfBirth;
		paramsAddress = ticketState.eIdDatas.addressStreetAndNumber;
		paramsZipAndCity = `${ticketState.eIdDatas.addressZip} ${ticketState.eIdDatas.addressMunicipality}`;
	}

	params += `
	&firstname=${encodeURIComponent(paramsFirstName)}
	&lastname=${encodeURIComponent(paramsLastName)}
	&registre_national=${encodeURIComponent(paramsNationalNumber)}
	&birth_date=${encodeURIComponent(paramsBirthDate)}
	&adress=${encodeURIComponent(paramsAddress)}
	&postal_code_city=${encodeURIComponent(paramsZipAndCity)}
	`;

	return new URL(baseURL + params);
}
