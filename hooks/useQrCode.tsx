import { useState } from "react";

import { Variables } from "../../variables";

export default function useQrCode(): CallableFunction {
	const [qrCodeText, setQrCodeText] = useState<string>("");

	function qrCodeWrite(key: string) {
		if (key === "Enter") {
			console.log("QR Code Ready");
			console.log(qrCodeText);

			const checkinURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkinAppointment.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&qrcode=${qrCodeText}&pdf_ticket=base_64`;
			const checkoutURL = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/checkout.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}&qrcode=${qrCodeText}`;

			setQrCodeText("");
		} else {
			setQrCodeText(latest => latest + key);
		}
	}

	return qrCodeWrite;
}
