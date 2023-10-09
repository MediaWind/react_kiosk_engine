import { createContext, useContext } from "react";

import { IInputField, ITicketDataAction, ITicketDataState } from "../interfaces";

export type ticketDataContent = {
	ticketState: ITicketDataState
	dispatchTicketState: React.Dispatch<ITicketDataAction>
}

export const TicketDataContext = createContext<ticketDataContent>({
	ticketState: {
		eIdDatas: null,
		pageIsListeningToEId: false,
		eIdRead: false,
		textInputDatas: [] as IInputField[],
		service: undefined,
		readyToPrint: false,
		language: undefined,
	},
	dispatchTicketState: () => null,
});

export const useTicketDataContext = () => useContext(TicketDataContext);
