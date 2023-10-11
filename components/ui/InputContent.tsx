import { useEffect } from "react";

import { ActionType, IInputAction, IInputContent, IService, InputType, TicketDataActionType } from "../../interfaces";

import { useTicketDataContext } from "../../contexts/ticketDataContext";
import { useLanguageContext } from "../../contexts/languageContext";

import ButtonInput from "./inputs/ButtonInput";
import NumberInput from "./inputs/NumberInput";

interface IInputContentProps {
	content: IInputContent
	onNavigate: CallableFunction
	onPrint: CallableFunction
	onBackPage: CallableFunction
}

export default function InputContent(props: IInputContentProps): JSX.Element {
	const {
		content,
		onNavigate,
		onPrint,
		onBackPage,
	} = props;

	const { ticketState, dispatchTicketState, } = useTicketDataContext();
	const { setLanguage, } = useLanguageContext();

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
		//? When eId is read, automatically navigates to services page
		if (content.type === InputType.CARDREADER && ticketState.eIdRead && content.action) {
			actionHandler();
		}
	}, [ticketState.eIdRead]);

	const actionHandler = () => {
		if (Array.isArray(content.action)) {
			content.action.map((action) => doAction(action));
		} else {
			doAction(content.action);
		}

		function doAction(action: IInputAction) {
			switch (action.type) {
				case ActionType.NEXTPAGE:
					onNavigate(action.navigateTo);
					break;
				case ActionType.PREVIOUSPAGE:
					onBackPage();
					break;
				case ActionType.SAVEDATA:
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
