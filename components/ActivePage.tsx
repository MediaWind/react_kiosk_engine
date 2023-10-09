import { useContext, useEffect, useState } from "react";

import { IBackgroundImage, IInputAction, IInputContent, IMedia, IPage, IService, LANGUAGE, MediaType, TicketDataActionType } from "../interfaces";

import { TicketDataContext } from "../contexts/ticketDataContext";

import FlowMedia from "./FlowMedia";
import BackgroundImage from "./ui/BackgroundImage";
import { LanguageContext } from "../contexts/languageContext";
import TextInputsManager from "./TextInputsManager";

interface IActivePageProps {
	page: IPage
	onChangePage: CallableFunction
	onPrint: CallableFunction
	onBackPage: CallableFunction
	onSignIn: CallableFunction
}

function getBackGroundImage(bgimg: IBackgroundImage, lng: LANGUAGE): string {
	switch (lng) {
		case LANGUAGE.FRENCH: {
			return bgimg.french ? bgimg.french : bgimg.default;
		}
		case LANGUAGE.DUTCH: {
			return bgimg.dutch ? bgimg.dutch : bgimg.default;
		}
		case LANGUAGE.ENGLISH: {
			return bgimg.english ? bgimg.english : bgimg.default;
		}
		default: return bgimg.default;
	}
}

export default function ActivePage(props: IActivePageProps): JSX.Element {
	const {
		page,
		onChangePage,
		onPrint,
		onBackPage,
		onSignIn,
	} = props;

	const { dispatchTicketState, } = useContext(TicketDataContext);
	const { language, } = useContext(LanguageContext);

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

					if (page.navigateToAfter.printTicket) {
						onPrint();
					} else {
						onSignIn();
					}
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

			if (textInputMedias.length > 0) {
				setTextInputs(textInputMedias);
			} else {
				setTextInputs([]);
			}
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

	const textInputsReadyHandler = (action: IInputAction) => {
		const nextPageId = action.navigateTo;

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
						/>
					);
				})
			}
			{textInputs.length > 0 && <TextInputsManager inputs={textInputs} onReady={textInputsReadyHandler} />}
			<BackgroundImage url={getBackGroundImage(page.backgroundImage, language)} />
		</>
	);
}
