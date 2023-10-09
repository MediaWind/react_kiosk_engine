import { useContext, useEffect, useState } from "react";

import { Variables } from "../../variables";

import { TicketDataContext } from "../contexts/ticketDataContext";
import { FlowContext } from "../contexts/flowContext";

import { IFlow, IPage, TicketDataActionType } from "../interfaces";

import ActivePage from "./ActivePage";
import Debugger from "./debug/Debugger";

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

	const { ticketState, dispatchTicketState, } = useContext(TicketDataContext);
	const { flow, setReload, } = useContext(FlowContext);

	const homePage = getHomePage(flow);
	const [router, setRouter] = useState<IPage[]>([homePage]);

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
		if (!isPrinting) {
			setRouter([homePage]);
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
