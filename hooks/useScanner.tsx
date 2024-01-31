import { useState } from "react";

export default function useScanner(): [string, CallableFunction, CallableFunction] {
	const [currentQrText, setCurrentQrText] = useState<string>("");
	const [returnedQrCodeText, setReturnedQrCodeText] = useState<string>("");

	function writeQrCode(key: string) {
		if (key === "Enter") {
			setReturnedQrCodeText(currentQrText);
			setCurrentQrText("");
		} else {
			setCurrentQrText(latest => latest + key);
		}
	}

	function resetAll() {
		setReturnedQrCodeText("");
		setCurrentQrText("");
	}

	return [
		returnedQrCodeText,
		writeQrCode,
		resetAll
	];
}
