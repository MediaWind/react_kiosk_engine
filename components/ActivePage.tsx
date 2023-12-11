import { useEffect, useState } from "react";

import { APPOINTMENT_ACTION_TYPE, ActionType, IInputAction, IInputContent, IMedia, IPage, IService, MediaType, TicketDataActionType } from "../interfaces";

import { useTicketDataContext } from "../contexts/ticketDataContext";
import { useAppointmentContext } from "../contexts/appointmentContext";

import FlowMedia from "./FlowMedia";
import BackgroundImage from "./ui/BackgroundImage";
import TextInputsManager from "./TextInputsManager";

interface IActivePageProps {
	page: IPage
	onChangePage: CallableFunction
	onPrint: CallableFunction
	onBackPage: CallableFunction
	onSignIn: CallableFunction
	onHomePage: CallableFunction
}

export default function ActivePage(props: IActivePageProps): JSX.Element {
	const {
		page,
		onChangePage,
		onPrint,
		onBackPage,
		onSignIn,
		onHomePage,
	} = props;

	const { dispatchTicketState, } = useTicketDataContext();
	const { appointmentState, dispatchAppointmentState, } = useAppointmentContext();

	const [pageMedias, setPageMedias] = useState<IMedia[]>([]);
	const [pageInputs, setPageInputs] = useState<IInputContent[]>([]);
	const [textInputs, setTextInputs] = useState<IMedia[]>([]);

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
				if (media.type === MediaType.INPUT) {
					inputs.push(media.content as IInputContent);
				}
			});

			setPageInputs([...inputs]);
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
						type: TicketDataActionType.SERVICEUPDATE,
						payload: page.navigateToAfter.service as IService,
					});
				}

				if (page.navigateToAfter.printTicket) {
					onPrint();
				} else {
					onSignIn();
				}

				onChangePage(page.navigateToAfter.navigateTo);
			}
		}, page.navigateToAfter.delay * 1000);
	}, [page]);

	//* Checks if page contains text inputs and if so, forwards them to text input manager
	useEffect(() => {
		if (page.medias) {
			const inputs = page.medias.filter(media => media.type === MediaType.INPUT);
			const textInputMedias = inputs.filter((media) => {
				const content = media.content as IInputContent;
				if (content.textInput) {
					return true;
				}
				return false;
			});

			setTextInputs(textInputMedias);
		}
		//TODO: replace with this code, adapt text manager and test if nothing breaks
		// if (pageInputs.length > 0) {
		// 	const textInputs = pageInputs.filter(input => {
		// 		if (input.textInput) {
		// 			return true;
		// 		}
		// 		return false;
		// 	});

		// 	setTextInputs([...textInputs]);
		// }
	}, [page]);

	//* If page reads QR codes, update context with either we are checking in or checking out
	useEffect(() => {
		if (pageInputs.length > 0) {
			pageInputs.map(input => {
				input.actions.map(action => {
					if (action.type === ActionType.CHECKIN) {
						dispatchAppointmentState({
							type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGIN,
							payload: true,
						});
					} else if (action.type === ActionType.CHECKOUT) {
						dispatchAppointmentState({
							type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGOUT,
							payload: true,
						});
					}
				});
			});
		}
	}, [pageInputs]);

	useEffect(() => {
		if (pageInputs.length > 0) {
			pageInputs.map(input => {
				input.actions.map(action => {
					if (
						(action.type === ActionType.CHECKIN || action.type === ActionType.CHECKOUT) &&
						action.navigateTo &&
						(appointmentState.isCheckedIn || appointmentState.isCheckedOut)
					) {
						onChangePage(action.navigateTo);
					}
				});
			});
		}
	}, [appointmentState]);

	function changePageHandler(pageID: string) {
		onChangePage(pageID);
	}

	function printHandler() {
		onPrint();
	}

	function backPageHandler() {
		onBackPage();
	}

	function homePageHandler() {
		onHomePage();
	}

	function textInputsReadyHandler(actions: IInputAction[]) {
		const nextPageId = actions.find(action => action.navigateTo)?.navigateTo;

		if (nextPageId) {
			onChangePage(nextPageId);
			setTextInputs([]);
		}
	}

	return (
		<>
			{(page.medias && page.medias.length > 0) &&
				page.medias.map((media, index) => {
					return (
						<FlowMedia
							key={`${page.id}__${index}`}
							id={`${page.id}__${index}`}
							media={media}
							onNavigate={changePageHandler}
							onPrint={printHandler}
							onBackPage={backPageHandler}
							onHomePage={homePageHandler}
						/>
					);
				})
			}
			{textInputs.length > 0 && <TextInputsManager inputs={textInputs} onReady={textInputsReadyHandler} />}
			<BackgroundImage image={page.backgroundImage} />
		</>
	);
}
