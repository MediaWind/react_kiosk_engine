import { useCallback, useRef, useState } from "react";

import { Console } from "../utils/console";

export default function useScanner(): [string, CallableFunction, CallableFunction] {
	const currentQrText = useRef<string>("");
	const [returnedQrCodeText, setReturnedQrCodeText] = useState<string>("");

	const writeQrCode = useCallback((key: string) => {
		if (key === "ArrowDown" || key === "Shift" || key === "Control" || key === "Alt") {
			return;
		}

		if (key === "Enter") {
			Console.info(`QR scanner: keyboard scan completed with value "${currentQrText.current}"`);
			setReturnedQrCodeText(currentQrText.current);
			currentQrText.current = "";
		} else {
			currentQrText.current += key.toLowerCase();
		}
	}, []);

	const resetAll = useCallback(() => {
		setReturnedQrCodeText("");
		currentQrText.current = "";
	}, []);

	return [
		returnedQrCodeText,
		writeQrCode,
		resetAll
	];
}
