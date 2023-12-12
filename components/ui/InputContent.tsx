import { useEffect } from "react";

import { APPOINTMENT_ACTION_TYPE, ActionType, IInputAction, IInputContent, IService, InputType, TicketDataActionType } from "../../interfaces";

import { useTicketDataContext } from "../../contexts/ticketDataContext";
import { useLanguageContext } from "../../contexts/languageContext";

import ButtonInput from "./inputs/ButtonInput";
import NumberInput from "./inputs/NumberInput";
import { useAppointmentContext } from "../../contexts/appointmentContext";

interface IInputContentProps {
	content: IInputContent
	onNavigate: CallableFunction
	onPrint: CallableFunction
	onBackPage: CallableFunction
	onHomePage: CallableFunction
}

export default function InputContent(props: IInputContentProps): JSX.Element {
	const {
		content,
		onNavigate,
		onPrint,
		onBackPage,
		onHomePage,
	} = props;

	const { setLanguage, } = useLanguageContext();
	const { ticketState, dispatchTicketState, } = useTicketDataContext();
	const { dispatchAppointmentState, } = useAppointmentContext();

	useEffect(() => {
		if (content.type === InputType.CARDREADER) {
			dispatchTicketState({
				type: TicketDataActionType.EIDLISTENINGUPDATE,
				payload: true,
			});
		} else {
			dispatchTicketState({
				type: TicketDataActionType.EIDLISTENINGUPDATE,
				payload: false,
			});
		}
	}, []);

	useEffect(() => {
		if (content.type === InputType.QRCODE) {
			actionHandler();
		}
	}, []);

	useEffect(() => {
		//? When eId is read, automatically navigates to services page
		if (content.type === InputType.CARDREADER && ticketState.eIdRead && content.actions.length > 0) {
			actionHandler();
		}
	}, [ticketState.eIdRead]);

	const actionHandler = () => {
		content.actions.map((action) => doAction(action));

		function doAction(action: IInputAction) {
			switch (action.type) {
				case ActionType.NEXTPAGE:
					onNavigate(action.navigateTo);
					break;
				case ActionType.PREVIOUSPAGE:
					onBackPage();
					break;
				case ActionType.HOMEPAGE:
					onHomePage();
					break;
				case ActionType.SAVEDATA:
				case ActionType.SAVESERVICE:
					dispatchTicketState({
						type: TicketDataActionType.SERVICEUPDATE,
						payload: action.service as IService,
					});
					break;
				case ActionType.PRINTTICKET:
					dispatchTicketState({
						type: TicketDataActionType.SERVICEUPDATE,
						payload: action.service as IService,
					});
					onPrint();
					break;
				case ActionType.CHANGELANGUAGE:
					setLanguage(latest => action.language ?? latest);
					break;
				case ActionType.CHECKIN:
					dispatchAppointmentState({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGIN,
						payload: true,
					});
					break;
				case ActionType.CHECKOUT:
					dispatchAppointmentState({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGOUT,
						payload: true,
					});
					break;
				default:
					break;
			}
		}
	};

	if (content.type === InputType.BUTTON) {
		return (
			<ButtonInput onClick={actionHandler} styles={content.styles} />
		);
	} else if (content.type === InputType.NUMBER) {
		return (
			<NumberInput styles={content.styles} />
		);
	} else {
		//? InputType.TEXT is managed from ActivePage with TextInputsManager component
		return (
			<>
			</>
		);
	}
}
