import { createContext, useContext } from "react";

import { IPrintAction, IPrintState } from "../interfaces";

type printContext = {
	printState: IPrintState
	dispatchPrintState: React.Dispatch<IPrintAction>
}

export const PrintContext = createContext<printContext>({
	printState: {
		ticketPDF: null,
		ticketCreationRequested: false,
		printRequested: false,
	},
	dispatchPrintState: () => null,
});

export const usePrintContext = () => useContext(PrintContext);
