import { useState } from "react";
import { Variables } from "../../variables";
import { APPOINTMENT_ACTION_TYPE, ERROR_ACTION_TYPE, ERROR_CODE, IAppointmentAction, IErrorAction, IErrorState } from "../interfaces";
import { testPDF } from "../utils/testPDF";

export default function useAppointment(dispatchAppointment: React.Dispatch<IAppointmentAction>, dispatchError: React.Dispatch<IErrorAction>) {
	const [appointmentTicketPdf, setAppointmentTicketPDF] = useState<string>("");

	const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
	const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

	// const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
	// const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false);

	async function checkIn(qrCode: string) {
		setIsCheckingIn(true);
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
			console.log("🚀 ~ checkIn ~ data:", data);

			if (data.status != 1) {
				//* Error
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
							message: "Unable to fetch ticket PDF",
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
			console.log(err);
		} finally {
			setIsCheckingIn(false);

			setTimeout(() => {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.CLEARALL,
				});
			}, 10 * 1000);
		}
	}

	async function checkOut(qrCode: string) {
		setIsCheckingOut(true);
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
			console.log("🚀 ~ checkOut ~ data:", data);

			if (data.status != 1) {
				if (Variables.PREVIEW) {
					dispatchAppointment({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDOUT,
						payload: true,
					});
				} else {
					//TODO: add error management
				}
			} else {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDOUT,
					payload: true,
				});
			}
		} catch (err) {
			console.log(err);
		} finally {
			setIsCheckingOut(false);

			setTimeout(() => {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.CLEARALL,
				});
			}, 10 * 1000);
		}
	}

	return [
		appointmentTicketPdf,
		checkIn,
		checkOut,
		isCheckingIn,
		isCheckingOut
	];
}
