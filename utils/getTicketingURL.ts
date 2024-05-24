import { Variables } from "../../variables";

import { eIdData } from "../../core/hooks/useEId";

import { IFlow, ITicketDataState } from "../interfaces";

/**
 * Take eIdData from a Belgian eId card and format it
 * @param eIdInfo
 * @returns string following the "YYYY-MM-DD" format
 */
function formatBirthDate(eIdInfo: eIdData): string {
	const splitDate = eIdInfo.dateOfBirth.split(" ");
	let monthNumber = parseInt(eIdInfo.nationalNumber.slice(2, 4));

	while (monthNumber > 12) {
		monthNumber = monthNumber - 20;
	}

	splitDate.splice(1, 1, ("0" + monthNumber).slice(-2));
	return splitDate.reverse().join("-");
}

export default function getTicketingURL(ticketState: ITicketDataState, flow: IFlow): URL {
	let serviceId = ticketState.service?.serviceId;
	let serviceFlowId = ticketState.service?.serviceFlowId;

	if (process.env.NODE_ENV !== "production" || Variables.DOMAINE === "modules.greenplayer.com") {
		if (ticketState.service?.devServiceId) {
			serviceId = ticketState.service.devServiceId;
		}

		if (ticketState.service?.devServiceFlowId) {
			serviceFlowId = ticketState.service.devServiceFlowId;
		}
	}

	const baseURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/ticket.php?`;
	let params = `
	id_project=${Variables.W_ID_PROJECT}
	&serial=${Variables.SERIAL_PLAYER}
	${serviceFlowId ? `&id_service_flow=${serviceFlowId}` : `&id_service=${serviceId}`}
	&priority=${ticketState.service?.priority ?? 0}
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
		${email?.value ? `&email=${encodeURIComponent(email.value)}` : ""}
		${phone?.value ? `&phone=${encodeURIComponent(phone.value)}` : ""}
		${company?.value ? `&company=${encodeURIComponent(company.value)}` : ""}
		${comment?.value ? `&comment=${encodeURIComponent(comment.value)}` : ""}
		${idUserAgent?.value ? `&id_userAgent=${encodeURIComponent(idUserAgent.value)}` : ""}
		`;
	}

	if (ticketState.eIdDatas) {
		paramsFirstName = ticketState.eIdDatas.firstName;
		paramsLastName = ticketState.eIdDatas.lastName;
		paramsNationalNumber = ticketState.eIdDatas.nationalNumber;
		paramsBirthDate = formatBirthDate(ticketState.eIdDatas);
		paramsAddress = ticketState.eIdDatas.addressStreetAndNumber;
		paramsZipAndCity = `${ticketState.eIdDatas.addressZip} ${ticketState.eIdDatas.addressMunicipality}`;
	}

	params += `
	${paramsFirstName !== "" ? `&firstname=${encodeURIComponent(paramsFirstName)}` : ""}
	${paramsLastName !== "" ? `&lastname=${encodeURIComponent(paramsLastName)}` : ""}
	${paramsNationalNumber !== "" ? `&registre_national=${encodeURIComponent(paramsNationalNumber)}` : ""}
	${paramsBirthDate !== "" ? `&birth_date=${encodeURIComponent(paramsBirthDate)}` : ""}
	${paramsAddress !== "" ? `&address=${encodeURIComponent(paramsAddress)}` : ""}
	${paramsZipAndCity !== "" ? `&postal_code_city=${encodeURIComponent(paramsZipAndCity)}` : ""}
	`;

	return new URL(baseURL + params);
}
