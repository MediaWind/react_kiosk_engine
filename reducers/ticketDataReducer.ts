import { eIdData } from "../../core/hooks/useEId";

import {
	IInputField,
	IService,
	ITicketDataAction,
	ITicketDataState,
	LANGUAGE,
	TICKET_DATA_ACTION_TYPE
} from "../interfaces";

export default function ticketDataReducer(ticketData: ITicketDataState, action: ITicketDataAction): ITicketDataState {
	switch (action.type) {
		case TICKET_DATA_ACTION_TYPE.EIDUPDATE: return {
			...ticketData,
			eIdDatas: action.payload as eIdData,
		};
		case TICKET_DATA_ACTION_TYPE.EIDLISTENINGUPDATE: return {
			...ticketData,
			pageIsListeningToEId: action.payload as boolean,
		};
		case TICKET_DATA_ACTION_TYPE.EIDREADUPDATE: return {
			...ticketData,
			eIdRead: action.payload as boolean,
		};
		case TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE: return {
			...ticketData,
			textInputDatas: [...ticketData.textInputDatas, action.payload as IInputField],
		};
		case TICKET_DATA_ACTION_TYPE.SERVICEUPDATE: return {
			...ticketData,
			service: action.payload as IService,
		};
		case TICKET_DATA_ACTION_TYPE.LANGUAGEUPDATE: return {
			...ticketData,
			language: action.payload as LANGUAGE,
		};
		case TICKET_DATA_ACTION_TYPE.CLEARDATA: return initialTicketState;
		default: return {
			...ticketData,
		};
	}
}

export const initialTicketState: ITicketDataState = {
	eIdDatas: null,
	textInputDatas: [],
	pageIsListeningToEId: true,
	eIdRead: false,
	service: undefined,
	language: undefined,
};
