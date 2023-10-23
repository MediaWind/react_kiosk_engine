import { useEffect, useState } from "react";

import { Variables } from "../../variables";

import { useFlowContext } from "../contexts/flowContext";
import { useLanguageContext } from "../contexts/languageContext";
import { useTicketDataContext } from "../contexts/ticketDataContext";
import { useErrorContext } from "../contexts/errorContext";

import { IFlow, IPage, TicketDataActionType } from "../interfaces";

import ActivePage from "./ActivePage";
import Debugger from "./debug/Debugger";
import Date from "./ui/Date";
import Time from "./ui/Time";

interface IFlowDispatcherProps {
	onPrint: CallableFunction
	isPrinting: boolean
	onSignIn: CallableFunction
}

function getHomePage(flow: IFlow): IPage {
	if (flow.pages.length === 0) {
		throw new Error;
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
	const {
		onPrint,
		isPrinting,
		onSignIn,
	} = props;

	const { setLanguage, } = useLanguageContext();
	const { flow, setReload, } = useFlowContext();
	const { ticketState, dispatchTicketState, } = useTicketDataContext();
	const { errorState, } = useErrorContext();

	const homePage = getHomePage(flow);
	const [router, setRouter] = useState<IPage[]>([homePage]);

	useEffect(() => {
		if(!errorState.hasError) {
			setRouter([homePage]);
		}
	}, [errorState.hasError]);

	useEffect(() => {
		if (flow.navigateToHomePageAfter) {
			const delay = setTimeout(() => {
				if (router.slice(-1)[0] !== homePage) {
					setRouter([homePage]);
					setReload(true);

					dispatchTicketState({
						type: TicketDataActionType.CLEARDATA,
						payload: undefined,
					});
				}
			}, flow.navigateToHomePageAfter * 1000);

			return () => {
				clearTimeout(delay);
			};
		}
	}, [router]);

	useEffect(() => {
		if (router.slice(-1)[0] === homePage) {
			dispatchTicketState({
				type: TicketDataActionType.CLEARDATA,
				payload: undefined,
			});

			setReload(true);
		} else {
			setReload(false);
		}
	}, [router]);

	useEffect(() => {
		if (router.slice(-1)[0] === homePage) {
			setLanguage(undefined);
		}
	}, [router]);

	useEffect(() => {
		if (!isPrinting) {
			setRouter([homePage]);
			setLanguage(undefined);
		}
	}, [isPrinting]);

	const changePageHandler = (pageID: string) => {
		const page = flow.pages.find(page => page.id === pageID);

		if (page) {
			setRouter((latest) => [... latest, page]);
		}
	};

	const printHandler = () => {
		onPrint();
	};

	const backPageHandler = () => {
		setRouter((latest) => {
			const popped = latest.slice(0, latest.length - 1);
			return [...popped];
		});
	};

	const signInHandler = () => {
		onSignIn();
	};

	return (
		<>
			{(Variables.W_DEBUG && ticketState.eIdRead) && <Debugger messages={["eidread from page router"]} />}

			{flow.displayDate && <Date format={flow.displayDate.format} style={flow.displayDate.style} />}
			{flow.displayTime && <Time format={flow.displayTime.format} style={flow.displayTime.style} />}

			<ActivePage
				page={router.slice(-1)[0]}
				onChangePage={changePageHandler}
				onPrint={printHandler}
				onBackPage={backPageHandler}
				onSignIn={signInHandler}
			/>
		</>
	);
}
