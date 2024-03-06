import { useState } from "react";

import { Variables } from "../../variables";
import { APPOINTMENT_ACTION_TYPE, ERROR_ACTION_TYPE, IAppointmentAction, IErrorAction, IErrorState } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import { testPDF } from "../utils/testPDF";
import { Console } from "../utils/console";

export default function useAppointment(dispatchAppointment: React.Dispatch<IAppointmentAction>, dispatchError: React.Dispatch<IErrorAction>): [string, CallableFunction, CallableFunction] {
	const [appointmentTicketPdf, setAppointmentTicketPDF] = useState<string>("");

	async function checkIn(qrCode: string) {
		Console.info("Appointment check in...");
		setAppointmentTicketPDF("");

		const checkinURL = `
			${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkinAppointment.php?
			id_project=${Variables.W_ID_PROJECT}
			&serial=${Variables.SERIAL}
			&qrcode=${qrCode}
			pdf_ticket=base_64
		`;
		// console.log("🚀 ~ checkIn ~ checkinURL:", checkinURL);

		try {
			const response = await fetch(checkinURL);
			const data = await response.json();

			if (data.status != 1) {
				Console.error("Error when trying to check in appointment: data status " + data.status ?? "undefined", { fileName: "useAppointment", functionName: "checkIn", lineNumber: 31, });
				if (Variables.PREVIEW) {
					dispatchAppointment({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDIN,
						payload: true,
					});
					setAppointmentTicketPDF(testPDF);
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
					Console.error("Error when trying to check in appointment: pdf is null", { fileName: "useAppointment", functionName: "checkIn", lineNumber: 57, });
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
			Console.error("Error when trying to check in appointment: error caught.", { fileName: "useAppointment", functionName: "checkIn", lineNumber: 69, });
			Console.error(err);
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.B500,
					message: "Error caught - Unable to fetch ticket PDF",
				} as IErrorState,
			});
		} finally {
			setTimeout(() => {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.CLEARALL,
				});
			}, 1000);
		}
	}

	async function checkOut(qrCode: string) {
		Console.info("Appointment check in...");
		setAppointmentTicketPDF("");

		const checkoutURL = `
			${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkout.php?
			id_project=${Variables.W_ID_PROJECT}
			&serial=${Variables.SERIAL}
			&qrcode=${qrCode}
		`;

		try {
			const response = await fetch(checkoutURL);
			const data = await response.json();

			if (data.status != 1) {
				Console.error("Error when trying to check out appointment: data status " + data.status ?? "undefined", { fileName: "useAppointment", functionName: "checkOut", lineNumber: 104, });
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
							message: "Unable to fetch ticket PDF (Status 0)",
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
			Console.error("Error when trying to check out appointment: error caught.", { fileName: "useAppointment", functionName: "checkOut", lineNumber: 127, });
			Console.error(err);
			dispatchError({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.B500,
					message: "Unable to fetch ticket PDF (error caught)",
				} as IErrorState,
			});
		} finally {
			setTimeout(() => {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.CLEARALL,
				});
			}, 1000);
		}
	}

	return [
		appointmentTicketPdf,
		checkIn,
		checkOut
	];
}
