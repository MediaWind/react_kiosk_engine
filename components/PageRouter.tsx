import { useEffect, useState } from "react";

import { IFlow, IPage } from "../interfaces";

import { useFlowContext } from "../contexts/flowContext";
import { useLanguageContext } from "../contexts/languageContext";
import { useErrorContext } from "../contexts/errorContext";


import ActivePage from "./ActivePage";
import Date from "./ui/Date";
import Time from "./ui/Time";

interface IFlowDispatcherProps {
	isPrinting: boolean
	onReset: CallableFunction
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
	const { isPrinting, onReset, } = props;

	const { flow, setReload, } = useFlowContext();
	const { setLanguage, } = useLanguageContext();
	const { errorState, } = useErrorContext();

	const [homePage, setHomePage] = useState<IPage>(getHomePage(flow));
	const [router, setRouter] = useState<IPage[]>([homePage]);

	useEffect(() => {
		setHomePage(getHomePage(flow));
		setRouter([getHomePage(flow)]);
	}, [flow]);

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
					onReset();
				}
			}, flow.navigateToHomePageAfter * 1000);

			return () => {
				clearTimeout(delay);
			};
		}
	}, [router]);

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
		}
	}, [isPrinting]);

	const changePageHandler = (pageID: string) => {
		const page = flow.pages.find(page => page.id === pageID);

		if (page) {
			setRouter((latest) => [...latest, page]);
		}
	};

	const backPageHandler = () => {
		setRouter((latest) => {
			const popped = latest.slice(0, latest.length - 1);
			return [...popped];
		});
	};

	const homePageHandler = () => {
		setRouter([homePage]);
	};

	return (
		<>
			{flow.displayDate && <Date format={flow.displayDate.format} style={flow.displayDate.style} />}
			{flow.displayTime && <Time format={flow.displayTime.format} style={flow.displayTime.style} />}

			<ActivePage
				page={router.slice(-1)[0]}
				onChangePage={changePageHandler}
				onBackPage={backPageHandler}
				onHomePage={homePageHandler}
			/>
		</>
	);
}
