import { useState } from "react";

import { Variables } from "../../variables";
import { APPOINTMENT_ACTION_TYPE, ERROR_ACTION_TYPE, IAppointmentAction, IErrorAction, IErrorState } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import { Console } from "../utils/console";
import fetchRetry from "../utils/fetchRetry";
import capitalizeFirstLetter from "../../core/utils/capitalizeFirstLetter";

export default function useAppointment(dispatchAppointment: React.Dispatch<IAppointmentAction>, dispatchError: React.Dispatch<IErrorAction>): [string, CallableFunction, CallableFunction, CallableFunction] {
	const [appointmentTicketPdf, setAppointmentTicketPDF] = useState<string>("");

	async function checkIn(qrCode: string) {
		Console.info("Appointment check in...");
		setAppointmentTicketPDF("");

		const checkinURL = `
			${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkinAppointment.php?
			id_project=${Variables.W_ID_PROJECT}
			&serial=${Variables.SERIAL}
			&qrcode=${qrCode}
			&pdf_ticket=base_64
		`;

		try {
			const response = await fetchRetry(checkinURL);
			const data = await response.json();

			if (data.status !== 1) {
				Console.error("Error when trying to check in appointment: data status " + data.status ?? "undefined", { fileName: "useAppointment", functionName: "checkIn", lineNumber: 31, });
				if (data.status_msg && data.status_msg === "appointment_not_found") {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B404,
							message: "Appointment not found",
						} as IErrorState,
					});
				} else if (data.status_msg) {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: capitalizeFirstLetter(data.status_msg.replace("_", " ")),
						} as IErrorState,
					});
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Unable to fetch ticket PDF (Status 0)",
						} as IErrorState,
					});
				}
			} else {
				if (data.pdf !== null) {
					dispatchAppointment({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDIN,
						payload: true,
					});

					setAppointmentTicketPDF(data.pdf);
				} else {
					Console.error("Error when trying to check in appointment: pdf is null", { fileName: "useAppointment", functionName: "checkIn", lineNumber: 70, });
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.A400,
							message: "Ticket PDF is null",
						},
					});
				}
			}
		} catch (err) {
			Console.error("Error when trying to check in appointment: error caught.", { fileName: "useAppointment", functionName: "checkIn", lineNumber: 82, });
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

	async function checkOut(qrCode: string) {
		Console.info("Appointment check out...");
		setAppointmentTicketPDF("");

		const checkoutURL = `
			${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkout.php?
			id_project=${Variables.W_ID_PROJECT}
			&serial=${Variables.SERIAL}
			&qrcode=${qrCode}
		`;

		try {
			const response = await fetchRetry(checkoutURL);
			const data = await response.json();

			if (data.status != 1) {
				Console.error("Error when trying to check out appointment: data status " + data.status ?? "undefined", { fileName: "useAppointment", functionName: "checkOut", lineNumber: 139, });
				if (Variables.PREVIEW) {
					dispatchAppointment({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDOUT,
						payload: true,
					});
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Unable to check out (Status 0)",
						} as IErrorState,
					});
				}
			} else {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDOUT,
					payload: true,
				});
			}
		} catch (err) {
			Console.error("Error when trying to check out appointment: error caught.", { fileName: "useAppointment", functionName: "checkOut", lineNumber: 162, });
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

	async function getAppointments(birthDate: string | null = null, nationalNumber: string | null = null, minBeforeAppointment = null, minAfterAppointment = null, services: Array<number> | null = null) : Promise<object | undefined> {
		Console.info("Getting appointments...");

		let appointmentsURL = `
			${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/appointments.php?
			id_project=${Variables.W_ID_PROJECT}
			&serial=${Variables.SERIAL}
		`;

		if(!birthDate && !nationalNumber) {
			Console.error("Error when trying to get appointments: birthDate and nationalNumber are both null or empty", { fileName: "useAppointment", functionName: "getAppointments", lineNumber: 200, });
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.B400,
					message: "Birth date and national number are both empty",
				},
			});
			return undefined;
		}

		// ADD FILTERS
		if(birthDate) 		appointmentsURL += `&birth_date=${birthDate}`;
		if(nationalNumber) 	appointmentsURL += `&registre_national=${nationalNumber}`;
		if(services && services.length > 0) appointmentsURL += `&id_service=${services.join(",")}`;

		// add time filter
		if(minBeforeAppointment) 	appointmentsURL += `&time_before_appointment=${minBeforeAppointment}`;
		if(minAfterAppointment) 	appointmentsURL += `&time_after_appointment=${minAfterAppointment}`;

		try {
			const response = await fetchRetry(appointmentsURL);
			const data = await response.json();

			if(!data) {
				Console.error("Error when trying to get appointments: data is null", { fileName: "useAppointment", functionName: "getAppointments", lineNumber: 232, });
				dispatchError({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.B500,
						message: "Unable to fetch ticket PDF (Data is null)",
					},
				});
				return undefined;
			}

			if (data.status === 1) {
				return data;
			} else {
				Console.error("Error when trying to get appointments: data status " + data.status ?? "undefined", { fileName: "useAppointment", functionName: "getAppointments", lineNumber: 247, });
				if (data.status_msg && data.status_msg === "appointment_not_found") {
					console.log("appointment not found");
				} else if (data.status_msg) {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: capitalizeFirstLetter(data.status_msg.replace("_", " ")),
						} as IErrorState,
					});
				} else {
					dispatchError({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Unable to fetch ticket PDF (Status 0)",
						} as IErrorState,
					});
				}
			}
		} catch (err) {
			Console.error("Error when trying to get appointments: error caught.", { fileName: "useAppointment", functionName: "getAppointments", lineNumber: 278, });
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

	return [
		appointmentTicketPdf,
		checkIn,
		checkOut,
		getAppointments
	];
}
