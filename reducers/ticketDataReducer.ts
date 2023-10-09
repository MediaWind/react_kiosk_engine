import { eIdData } from "../../core/hooks/useEId";

import {
	IInputField,
	IService,
	ITicketDataAction,
	ITicketDataState,
	LANGUAGE,
	TicketDataActionType
} from "../interfaces";

export default function ticketDataReducer(ticketData: ITicketDataState, action: ITicketDataAction): ITicketDataState {
	switch (action.type) {
		case TicketDataActionType.EIDUPDATE: return {
			...ticketData,
			eIdDatas: action.payload as eIdData,
			readyToPrint: ticketData.service !== undefined,
		};
		case TicketDataActionType.EIDLISTENINGUPDATE: return {
			...ticketData,
			pageIsListeningToEId: action.payload as boolean,
		};
		case TicketDataActionType.EIDREADUPDATE: return {
			...ticketData,
			eIdRead: action.payload as boolean,
		};
		case TicketDataActionType.INPUTTEXTUPDATE: return {
			...ticketData,
			textInputDatas: [...ticketData.textInputDatas, action.payload as IInputField],
			readyToPrint: ticketData.service !== undefined,
		};
		case TicketDataActionType.SERVICEUPDATE: return {
			...ticketData,
			service: action.payload as IService,
			readyToPrint: (ticketData.eIdDatas !== null || ticketData.textInputDatas.length > 0),
		};
		case TicketDataActionType.LANGUAGEUPDATE: return {
			...ticketData,
			language: action.payload as LANGUAGE,
		};
		case TicketDataActionType.CLEARDATA: return initialState;
		default: return {
			...ticketData,
		};
	}
}

export const initialState: ITicketDataState = {
	eIdDatas: null,
	textInputDatas: [],
	pageIsListeningToEId: true,
	eIdRead: false,
	service: undefined,
	readyToPrint: false,
	language: undefined,
};
