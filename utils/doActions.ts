import { SetStateAction } from "react";

import {
	ACTION_TYPE,
	APPOINTMENT_ACTION_TYPE,
	IAppointmentAction,
	IInputAction,
	IPrintAction,
	IService,
	ITicketDataAction,
	LANGUAGE,
	PRINT_ACTION_TYPE,
	TICKET_DATA_ACTION_TYPE
} from "../interfaces";

interface IDispatchers {
	router: {
		nextPage: CallableFunction
		previousPage: CallableFunction
		homePage: CallableFunction
	},
	dispatchPrintState: React.Dispatch<IPrintAction>
	dispatchTicketState: React.Dispatch<ITicketDataAction>
	setLanguage: React.Dispatch<SetStateAction<LANGUAGE | undefined>>
	dispatchAppointmentState: React.Dispatch<IAppointmentAction>
	triggerCustomAction: CallableFunction
	setCustomPage: React.Dispatch<SetStateAction<JSX.Element | undefined>>
}

export default function doActions(actions: IInputAction[], dispatchers: IDispatchers) {
	actions.map((action) => doAction(action));

	function doAction(action: IInputAction) {
		switch (action.type) {
			case ACTION_TYPE.NEXTPAGE:
				dispatchers.router.nextPage(action.navigateTo);
				break;
			case ACTION_TYPE.PREVIOUSPAGE:
				dispatchers.router.previousPage();
				break;
			case ACTION_TYPE.HOMEPAGE:
				dispatchers.router.homePage();
				break;
			case ACTION_TYPE.SAVESERVICE:
				dispatchers.dispatchTicketState({
					type: TICKET_DATA_ACTION_TYPE.SERVICEUPDATE,
					payload: action.service as IService,
				});
				break;
			case ACTION_TYPE.CREATETICKET:
				dispatchers.dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION, payload: true, });
				break;
			case ACTION_TYPE.PRINTTICKET:
				dispatchers.dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTPRINT, payload: true, });
				break;
			case ACTION_TYPE.CHANGELANGUAGE:
				dispatchers.setLanguage(latest => action.language ?? latest);
				break;
			case ACTION_TYPE.CHECKIN:
				dispatchers.dispatchAppointmentState({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGIN,
					payload: true,
				});
				break;
			case ACTION_TYPE.CHECKOUT:
				dispatchers.dispatchAppointmentState({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGOUT,
					payload: true,
				});
				break;
			case ACTION_TYPE.CUSTOM:
				dispatchers.triggerCustomAction();
				break;
			case ACTION_TYPE.RESETCUSTOMPAGE:
				dispatchers.setCustomPage(undefined);
				break;
			default:
				break;
		}
	}
}
