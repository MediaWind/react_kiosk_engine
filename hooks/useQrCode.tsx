import { useState } from "react";

import { Variables } from "../../variables";

export default function useQrCode(): [CallableFunction, boolean, boolean] {
	const [qrCodeText, setQrCodeText] = useState<string>("");
	const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
	const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

	function qrCodeWrite(key: string, isCheckingIn: boolean, isCheckingOut: boolean) {
		if (key === "Enter") {
			console.log("QR Code Ready:", qrCodeText);

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
		setIsCheckingIn(true);
		const checkinURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkinAppointment.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&qrcode=${qrCodeText}&pdf_ticket=base_64`;

		try {
			const response = await fetch(checkinURL);
			const data = await response.json();

			if (data.status == 1) {
				//TODO
			}
		} catch (err) {
			console.log(err);
		} finally {
			setQrCodeText("");
			setIsCheckingIn(false);
		}
	}

	async function checkOut() {
		setIsCheckingOut(true);
		const checkoutURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkout.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&qrcode=${qrCodeText}`;

		try {
			const response = await fetch(checkoutURL);
			const data = await response.json();

			if (data.status != 1) {
				//* Something went wrong,
				//TODO: add error management
			}
		} catch (err) {
			console.log(err);
		} finally {
			setQrCodeText("");
			setIsCheckingOut(false);
		}
	}

	return [
		qrCodeWrite,
		isCheckingIn,
		isCheckingOut
	];
}
