import { useEffect, useState } from "react";

import { Variables } from "../../variables";

import { IFlow, IPage } from "../interfaces";

import { useFlowContext } from "../contexts/flowContext";
import { useLanguageContext } from "../contexts/languageContext";
import { useErrorContext } from "../contexts/errorContext";
import { RouterContext } from "../contexts/routerContext";
import { CustomActionContext } from "../contexts/customActionContext";

import ActivePage from "./ActivePage";
import Date from "./ui/Date";
import Time from "./ui/Time";

interface IFlowDispatcherProps {
	isPrinting: boolean
	onReset: CallableFunction
	onCustomAction?: CallableFunction
}

function getHomePage(flow: IFlow): IPage {
	if (flow.pages.length === 0) {
		throw new Error;
		//TODO: use error reducer
	}

	const homeId = flow.homePage;
	const homePage = flow.pages.find(page => page.id === homeId);

	if (homePage) {
		return homePage;
	} else {
		return flow.pages[0];
	}
}

export default function PageRouter(props: IFlowDispatcherProps): JSX.Element {
	const { isPrinting, onReset, onCustomAction, } = props;

	const { flow, setReload, } = useFlowContext();
	const { setLanguage, } = useLanguageContext();
	const { errorState, } = useErrorContext();

	const [homePage, setHomePage] = useState<IPage>(getHomePage(flow));
	const [router, setRouter] = useState<IPage[]>([homePage]);
	const [customPage, setCustomPage] = useState<JSX.Element | undefined>();

	const [userIsInteracting, setUserIsInteracting] = useState<boolean>(false);

	useEffect(() => {
		setHomePage(getHomePage(flow));
		setRouter([getHomePage(flow)]);
	}, [flow]);

	useEffect(() => {
		if(!errorState.hasError) {
			setRouter([homePage]);

			if (customPage) {
				setCustomPage(undefined);
			}
		}
	}, [errorState.hasError]);

	useEffect(() => {
		let delay: NodeJS.Timer;

		if (flow.navigateToHomePageAfter && router.slice(-1)[0] !== homePage) {
			delay = setTimeout(() => {
				setRouter([homePage]);
				onReset();

				if (customPage) {
					setCustomPage(undefined);
				}
			}, flow.navigateToHomePageAfter * 1000);
		}

		return () => {
			clearTimeout(delay);
		};
	}, [router, userIsInteracting, customPage]);

	useEffect(() => {
		if (router.slice(-1)[0] === homePage) {
			onReset();
		} else {
			setReload(false);
		}
	}, [router]);

	useEffect(() => {
		if (!isPrinting) {
			setRouter([homePage]);
			setLanguage(undefined);
			onReset();
		}
	}, [isPrinting]);

	function nextPageHandler(pageID: string) {
		const page = flow.pages.find(page => page.id === pageID);

		if (page) {
			setRouter((latest) => [...latest, page]);
		}
	}

	function previousPageHandler() {
		setRouter((latest) => {
			const popped = latest.slice(0, latest.length - 1);
			return [...popped];
		});
	}

	function homePageHandler() {
		setRouter([homePage]);
	}

	function triggerCustomActionHandler() {
		if (onCustomAction) {
			onCustomAction({
				router: {
					state: router,
					dispatcher: {
						nextPage: nextPageHandler,
						previousPage: previousPageHandler,
						homePage: homePageHandler,
					},
				},
				customPage: {
					state: customPage,
					dispatcher: setCustomPage,
				},
			});
		}
	}

	function userInteractionStart() {
		setUserIsInteracting(true);
	}

	function userInteractionEnd() {
		setUserIsInteracting(false);
	}

	function devClickDown() {
		if (Variables.PREVIEW) {
			userInteractionStart();
		}
	}

	function devClickUp() {
		if (Variables.PREVIEW) {
			userInteractionEnd();
		}
	}

	return (
		<div
			onTouchStart={userInteractionStart}
			onTouchEnd={userInteractionEnd}
			onMouseDown={devClickDown}
			onMouseUp={devClickUp}
		>
			{flow.displayDate && <Date format={flow.displayDate.format} style={flow.displayDate.style} />}
			{flow.displayTime && <Time format={flow.displayTime.format} style={flow.displayTime.style} />}

			<CustomActionContext.Provider value={{ triggerCustomAction: triggerCustomActionHandler, customPage, setCustomPage, }}>
				<RouterContext.Provider value={{ nextPage: nextPageHandler, previousPage: previousPageHandler, homePage: homePageHandler, }}>
					<ActivePage page={router.slice(-1)[0]} />
				</RouterContext.Provider>
			</CustomActionContext.Provider>
		</div>
	);
}
