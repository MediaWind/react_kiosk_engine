import { useEffect, useState } from "react";

import { eIdStatus } from "../../../core/hooks/useEId";

import { APPOINTMENT_ACTION_TYPE, ACTION_TYPE, IInputAction, IInputContent, IService, INPUT_TYPE, PRINT_ACTION_TYPE, TICKET_DATA_ACTION_TYPE } from "../../interfaces";

import { useRouterContext } from "../../contexts/routerContext";
import { useLanguageContext } from "../../contexts/languageContext";
import { useTicketDataContext } from "../../contexts/ticketDataContext";
import { useAppointmentContext } from "../../contexts/appointmentContext";
import { usePrintContext } from "../../contexts/printContext";
import { useEIdContext } from "../../contexts/eIdContext";

import ButtonInput from "./inputs/ButtonInput";
import NumberInput from "./inputs/NumberInput";
import SelectInput from "./inputs/SelectInput";

interface IInputContentProps {
	content: IInputContent
}

export default function InputContent(props: IInputContentProps): JSX.Element {
	const { content, } = props;

	const { nextPage, previousPage, homePage, } = useRouterContext();
	const { setLanguage, } = useLanguageContext();
	const { dispatchTicketState, } = useTicketDataContext();
	const { dispatchAppointmentState, } = useAppointmentContext();
	const { dispatchPrintState, } = usePrintContext();
	const { status, } = useEIdContext();

	const [eIdBlock, setEIdBlock] = useState<boolean>(false);

	useEffect(() => {
		if (content.type === INPUT_TYPE.CARDREADER) {
			if (status === eIdStatus.READ) {
				setEIdBlock(true);
			}

			if (status === eIdStatus.REMOVED && eIdBlock) {
				setEIdBlock(false);
				actionHandler();
			}
		}
	}, [content, status]);

	useEffect(() => {
		if (content.type === INPUT_TYPE.QRCODE) {
			actionHandler();
		}
	}, []);

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

	if (content.type === INPUT_TYPE.SELECT) {
		return (
			<SelectInput selectStyles={content.styles} config={content.selectConfig} />
		);
	}

	//? INPUT_TYPE.TEXT is managed from ActivePage with TextInputsManager component
	return (
		<>
		</>
	);
}
