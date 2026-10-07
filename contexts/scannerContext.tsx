import { createContext, useContext } from "react";

type ScannerContextValue = {
	value: string
	reset: CallableFunction
}

export const ScannerContext = createContext<ScannerContextValue>({
	value: "",
	reset: () => null,
});

export const useScannerContext = () => useContext(ScannerContext);
