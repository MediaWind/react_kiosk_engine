import { useEffect } from "react";

import { APPOINTMENT_ACTION_TYPE, ACTION_TYPE, IInputAction, IInputContent, IService, INPUT_TYPE, PRINT_ACTION_TYPE, TICKET_DATA_ACTION_TYPE } from "../../interfaces";

import { useRouterContext } from "../../contexts/routerContext";
import { useLanguageContext } from "../../contexts/languageContext";
import { useTicketDataContext } from "../../contexts/ticketDataContext";
import { useAppointmentContext } from "../../contexts/appointmentContext";
import { usePrintContext } from "../../contexts/printContext";

import ButtonInput from "./inputs/ButtonInput";
import NumberInput from "./inputs/NumberInput";
import UserAgentSelect from "./inputs/UserAgentSelect";

interface IInputContentProps {
	content: IInputContent
}

export default function InputContent(props: IInputContentProps): JSX.Element {
	const { content, } = props;

	const { nextPage, previousPage, homePage, } = useRouterContext();
	const { setLanguage, } = useLanguageContext();
	const { ticketState, dispatchTicketState, } = useTicketDataContext();
	const { dispatchAppointmentState, } = useAppointmentContext();
	const { dispatchPrintState, } = usePrintContext();

	useEffect(() => {
		if (content.type === INPUT_TYPE.CARDREADER) {
			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.EIDLISTENINGUPDATE,
				payload: true,
			});
		} else {
			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.EIDLISTENINGUPDATE,
				payload: false,
			});
		}
	}, []);

	useEffect(() => {
		if (content.type === INPUT_TYPE.QRCODE) {
			actionHandler();
		}
	}, []);

	useEffect(() => {
		//? When eId is read, automatically navigates to services page
		if (content.type === INPUT_TYPE.CARDREADER && ticketState.eIdRead && content.actions.length > 0) {
			actionHandler();
		}
	}, [ticketState.eIdRead]);

	const actionHandler = () => {
		content.actions.map((action) => doAction(action));

		function doAction(action: IInputAction) {
			switch (action.type) {
				case ACTION_TYPE.NEXTPAGE:
					nextPage(action.navigateTo);
					break;
				case ACTION_TYPE.PREVIOUSPAGE:
					previousPage();
					break;
				case ACTION_TYPE.HOMEPAGE:
					homePage();
					break;
				case ACTION_TYPE.CREATETICKET:
					dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION, payload: true, });
					break;
				case ACTION_TYPE.SAVESERVICE:
					dispatchTicketState({
						type: TICKET_DATA_ACTION_TYPE.SERVICEUPDATE,
						payload: action.service as IService,
					});
					break;
				case ACTION_TYPE.PRINTTICKET:
					dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTPRINT, payload: true, });
					break;
				case ACTION_TYPE.CHANGELANGUAGE:
					setLanguage(latest => action.language ?? latest);
					break;
				case ACTION_TYPE.CHECKIN:
					dispatchAppointmentState({
						type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGIN,
						payload: true,
					});
					break;
				case ACTION_TYPE.CHECKOUT:
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

	if (content.type === INPUT_TYPE.BUTTON) {
		return (
			<ButtonInput onClick={actionHandler} styles={content.styles} />
		);
	}

	if (content.type === INPUT_TYPE.NUMBER) {
		return (
			<NumberInput styles={content.styles} />
		);
	}

	if (content.type === INPUT_TYPE.USE_AGENT_SELECT) {
		return (
			<UserAgentSelect styles={content.styles} />
		);
	}

	//? INPUT_TYPE.TEXT is managed from ActivePage with TextInputsManager component
	return (
		<>
		</>
	);
}
