import { IPrintAction, IPrintState, PRINT_ACTION_TYPE } from "../interfaces";

export default function printReducer(printState: IPrintState, action: IPrintAction): IPrintState {
	switch (action.type) {
		case PRINT_ACTION_TYPE.REQUESTPRINT: {
			return {
				...printState,
				printRequested: action.payload as boolean,
			};
		}
		case PRINT_ACTION_TYPE.REQUESTTICKETCREATION: {
			return {
				...printState,
				ticketCreationRequested: action.payload as boolean,
			};
		}
		case PRINT_ACTION_TYPE.UPDATETICKETPDF: {
			return {
				...printState,
				ticketPDF: action.payload as string,
			};
		}
		default:
			return initialPrintState;
	}
}

export const initialPrintState: IPrintState = {
	ticketPDF: null,
	ticketCreationRequested: false,
	printRequested: false,
};
