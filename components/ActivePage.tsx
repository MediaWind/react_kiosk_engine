import { useEffect, useState } from "react";

import { IInputAction, IInputContent, IMedia, IPage, IService, MediaType, TicketDataActionType } from "../interfaces";

import {  useTicketDataContext } from "../contexts/ticketDataContext";

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
	const [textInputs, setTextInputs] = useState<IMedia[]>([]);

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
	}, [page]);

	const changePageHandler = (pageID: string) => {
		onChangePage(pageID);
	};

	const printHandler = () => {
		onPrint();
	};

	const backPageHandler = () => {
		onBackPage();
	};

	const homePageHandler = () => {
		onHomePage();
	};

	const textInputsReadyHandler = (actions: IInputAction[]) => {
		const nextPageId = actions.find(action => action.navigateTo)?.navigateTo;

		if (nextPageId) {
			onChangePage(nextPageId);
			setTextInputs([]);
		}
	};

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
