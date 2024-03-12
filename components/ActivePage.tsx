import { useEffect, useState } from "react";

import { ACTION_TYPE, IInputAction, IInputContent, IMedia, IPage, IService, MEDIA_TYPE, PRINT_ACTION_TYPE, TICKET_DATA_ACTION_TYPE } from "../interfaces";

import { useFlowContext } from "../contexts/flowContext";
import { useRouterContext } from "../contexts/routerContext";
import { useLanguageContext } from "../contexts/languageContext";
import { usePrintContext } from "../contexts/printContext";
import { useTicketDataContext } from "../contexts/ticketDataContext";
import { useAppointmentContext } from "../contexts/appointmentContext";
import { useCustomActionContext } from "../contexts/customActionContext";

import { Console } from "../utils/console";
import doActions from "../utils/doActions";

import FlowMedia from "./FlowMedia";
import BackgroundImage from "./ui/BackgroundImage";
import TextInputsManager from "./TextInputsManager";

interface IActivePageProps {
	page: IPage
}

export default function ActivePage(props: IActivePageProps): JSX.Element {
	const { page, } = props;

	const { flow, } = useFlowContext();
	const { nextPage, previousPage, homePage, } = useRouterContext();
	const { setLanguage, } = useLanguageContext();
	const { dispatchPrintState, } = usePrintContext();
	const { ticketState, dispatchTicketState, } = useTicketDataContext();
	const { appointmentState, dispatchAppointmentState, } = useAppointmentContext();
	const { triggerCustomAction, customPage, } = useCustomActionContext();

	const [pageMedias, setPageMedias] = useState<IMedia[]>([]);
	const [pageInputs, setPageInputs] = useState<IInputContent[]>([]);

	const [textInputs, setTextInputs] = useState<IInputContent[]>([]);
	const [invalidTextInputs, setInvalidTextInputs] = useState<string[]>([]);

	useEffect(() => {
		if (page.medias) {
			setPageMedias(page.medias);
		} else {
			setPageMedias([]);
		}
	}, [page]);

	useEffect(() => {
		if (pageMedias.length > 0) {
			const inputs: IInputContent[] = [];
			pageMedias.map(media => {
				if (media.type === MEDIA_TYPE.INPUT) {
					inputs.push(media.content as IInputContent);
				}
			});

			setPageInputs([...inputs]);
		} else {
			setPageInputs([]);
		}
	}, [pageMedias]);

	//* Auto switches to next page without user interaction
	useEffect(() => {
		if (page.navigateToAfter === undefined) {
			return;
		}

		setTimeout(() => {
			if (page.navigateToAfter) {
				if (page.navigateToAfter.service) {
					dispatchTicketState({
						type: TICKET_DATA_ACTION_TYPE.SERVICEUPDATE,
						payload: page.navigateToAfter.service as IService,
					});
				}

				if (page.navigateToAfter.printTicket) {
					dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION, payload: true, });
					dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTPRINT, payload: true, });
				}

				nextPage(page.navigateToAfter.navigateTo);
			}
		}, page.navigateToAfter.delay * 1000);
	}, [page]);

	useEffect(() => {
		setTextInputs([]);
		setInvalidTextInputs([]);
		if (page.medias) {
			page.medias.filter(media => media.type === MEDIA_TYPE.INPUT)
				.map(media => {
					if ((media.content as IInputContent).textInputConfig) {
						setTextInputs(latest => [...latest, media.content as IInputContent]);
					}
				});
		}
	}, [page]);

	useEffect(() => {
		if (pageInputs.length > 0) {
			pageInputs.map(input => {
				if (input.actions) {
					input.actions.map(action => {
						if (
							(action.type === ACTION_TYPE.CHECKIN || action.type === ACTION_TYPE.CHECKOUT) &&
							action.navigateTo &&
							(appointmentState.isCheckedIn || appointmentState.isCheckedOut)
						) {
							nextPage(action.navigateTo);
						}
					});
				}
			});
		}
	}, [appointmentState]);

	function triggerActions(actions: IInputAction[]) {
		if (textInputs.length > 0 && actions.find(action => action.type === ACTION_TYPE.CHECKTEXTINPUTS)) {
			setInvalidTextInputs([]);
			const invalidInputs: string[] = [];

			textInputs.forEach(input => {
				if (input.textInputConfig?.textInput.required) {
					const match = ticketState.textInputDatas.find(i => i.id === input.textInputConfig?.textInput.id);

					if (!match || match.value.trim() === "") {
						invalidInputs.push(input.textInputConfig.textInput.id);
					}
				}
			});

			if (invalidInputs.length > 0) {
				setInvalidTextInputs(invalidInputs);
				return;
			}

			Console.info("Text inputs updated: ");
			ticketState.textInputDatas.map(input => Console.log(`input ${input.id}: ${input.value.slice(0, 1)}${"*".repeat(input.value.slice(1).trim().length)}`));
		}

		doActions(actions, {
			router: {
				nextPage,
				previousPage,
				homePage,
			},
			dispatchTicketState,
			dispatchPrintState,
			setLanguage,
			dispatchAppointmentState,
			triggerCustomAction,
		});
	}

	return (
		<>
			{(page.medias && page.medias.length > 0) &&
				page.medias.map((media, index) => {
					return (
						<FlowMedia key={`${page.id}__${index}`} id={`${page.id}__${index}`} media={media} onActionsTrigger={triggerActions} />
					);
				})
			}

			{(textInputs.length > 0 && flow.keyboard) && <TextInputsManager
				inputs={textInputs}
				keyboardConfig={flow.keyboard}
				onTriggerActions={triggerActions}
				invalidTextInputs={invalidTextInputs}
			/>}

			<BackgroundImage image={page.backgroundImage} />

			{customPage}
		</>
	);
}
