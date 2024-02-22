import { useEffect, useState } from "react";

import { ACTION_TYPE, IInputContent, IMedia, IPage, IService, MEDIA_TYPE, PRINT_ACTION_TYPE, TICKET_DATA_ACTION_TYPE } from "../interfaces";

import { useFlowContext } from "../contexts/flowContext";
import { useRouterContext } from "../contexts/routerContext";
import { useTicketDataContext } from "../contexts/ticketDataContext";
import { useAppointmentContext } from "../contexts/appointmentContext";
import { usePrintContext } from "../contexts/printContext";
import { useCustomActionContext } from "../contexts/customActionContext";

import FlowMedia from "./FlowMedia";
import BackgroundImage from "./ui/BackgroundImage";
import TextInputsManagerNEW from "./TextInputsManagerNEW";

interface IActivePageProps {
	page: IPage
}

export default function ActivePage(props: IActivePageProps): JSX.Element {
	const { page, } = props;

	const { flow, } = useFlowContext();
	const { nextPage, } = useRouterContext();
	const { dispatchTicketState, } = useTicketDataContext();
	const { appointmentState, } = useAppointmentContext();
	const { dispatchPrintState, } = usePrintContext();
	const { customPage, } = useCustomActionContext();

	const [pageMedias, setPageMedias] = useState<IMedia[]>([]);
	const [pageInputs, setPageInputs] = useState<IInputContent[]>([]);
	// const [textInputs, setTextInputs] = useState<IMedia[]>([]);
	const [newTextInputs, setNewTextInputs] = useState<IInputContent[]>([]);

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

	//* Checks if page contains text inputs and if so, forwards them to text input manager
	// useEffect(() => {
	// 	if (page.medias) {
	// 		const inputs = page.medias.filter(media => media.type === MEDIA_TYPE.INPUT);
	// 		const textInputMedias = inputs.filter((media) => {
	// 			const content = media.content as IInputContent;
	// 			if (content.textInput) {
	// 				return true;
	// 			}
	// 			return false;
	// 		});

	// 		setTextInputs(textInputMedias);
	// 	}
	// }, [page]);

	useEffect(() => {
		setNewTextInputs([]);

		if (page.medias) {
			page.medias.filter(media => media.type === MEDIA_TYPE.INPUT)
				.map(media => {
					if ((media.content as IInputContent).textInput) {
						setNewTextInputs(latest => [...latest, media.content as IInputContent]);
					}
				});
		}
	}, [page]);

	useEffect(() => {
		if (pageInputs.length > 0) {
			pageInputs.map(input => {
				//!FIXME: had to add this condition because of a "input.actions is undefined" error
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

	// function textInputsReadyHandler(actions: IInputAction[]) {
	// 	const nextPageId = actions.find(action => action.navigateTo)?.navigateTo;

	// 	if (nextPageId) {
	// 		nextPage(nextPageId);
	// 		// setTextInputs([]);
	// 	}
	// }

	return (
		<>
			{(page.medias && page.medias.length > 0) &&
				page.medias.map((media, index) => {
					return (
						<FlowMedia key={`${page.id}__${index}`} id={`${page.id}__${index}`} media={media} />
					);
				})
			}
			{(newTextInputs.length > 0 && flow.keyboard) && <TextInputsManagerNEW inputs={newTextInputs} keyboardConfig={flow.keyboard} />}
			<BackgroundImage image={page.backgroundImage} />
			{customPage}
		</>
	);
}
