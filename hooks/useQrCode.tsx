import { useState } from "react";

import { Variables } from "../../variables";

import { APPOINTMENT_ACTION_TYPE, IAppointmentAction } from "../interfaces";

export default function useQrCode(dispatchAppointment: React.Dispatch<IAppointmentAction>): [CallableFunction, string | null] {
	const [qrCodeText, setQrCodeText] = useState<string>("");
	const [appointmentTicketPDF, setAppointmentTicketPDF] = useState<string | null>(null);

	function qrCodeWrite(key: string, isCheckingIn: boolean, isCheckingOut: boolean) {
		if (key === "Enter") {
			console.log("QR Code Ready:", qrCodeText);
			setAppointmentTicketPDF(null);

			if (isCheckingIn) {
				checkIn();
			}

			if (isCheckingOut) {
				checkOut();
			}
		} else {
			setQrCodeText(latest => latest + key);
		}
	}

	async function checkIn() {
		const checkinURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkinAppointment.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&qrcode=${qrCodeText}&pdf_ticket=base_64`;

		console.log("🚀 ~ file: useQrCode.tsx:32 ~ checkIn ~ checkinURL:", checkinURL);
		try {
			const response = await fetch(checkinURL);
			const data = await response.json();
			console.log("🚀 ~ file: useQrCode.tsx:32 ~ checkIn ~ data:", data);

			if (data.status != 1) {
				//* Error
				if (Variables.PREVIEW) {
					dispatchAppointment({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDIN,
						payload: true,
					});
				} else {
					//TODO: add error management
				}
			} else {
				//* Ok, can print
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDIN,
					payload: true,
				});

				setAppointmentTicketPDF(data.pdf);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setQrCodeText("");

			setTimeout(() => {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.CLEARALL,
				});
			}, 10 * 1000);
		}
	}

	async function checkOut() {
		const checkoutURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkout.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&qrcode=${qrCodeText}`;

		try {
			const response = await fetch(checkoutURL);
			const data = await response.json();
			console.log("🚀 ~ file: useQrCode.tsx:99 ~ checkOut ~ data:", data);

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
			setQrCodeText("");

			setTimeout(() => {
				dispatchAppointment({
					type: APPOINTMENT_ACTION_TYPE.CLEARALL,
				});
			}, 10 * 1000);
		}
	}

	return [
		qrCodeWrite,
		appointmentTicketPDF
	];
}
