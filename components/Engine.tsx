import { useEffect, useReducer, useState } from "react";

import { Variables } from "../../variables";

import { ORIENTATION } from "../../core/variables";
import useSharedVariables from "../../core/hooks/useSharedVariables";
import useEId, { eIdData, eIdStatus } from "../../core/hooks/useEId";
import { setIntervalRange } from "../../core/customInterval";

import { ERROR_CODE, IFlow, LANGUAGE, Route, TicketDataActionType } from "../interfaces";

import { TicketDataContext } from "../contexts/ticketDataContext";
import { FlowContext } from "../contexts/flowContext";
import { LanguageContext } from "../contexts/languageContext";

import usePrintTicket from "../hooks/usePrintTicket";
import ticketDataReducer, { initialState } from "../reducers/ticketDataReducer";

import getRoute from "../utils/getRoute";
import checkCurrentFlow from "../utils/checkCurrentFlow";

import PageRouter from "../components/PageRouter";
import LoadingScreen from "../components/ui/LoadingScreen";
import Debugger from "../components/debug/Debugger";
import DisplayError from "../components/ui/DisplayError";

function Engine(): JSX.Element {
	const [eIdInserted, eIdReaded, eIdRemoved] = useSharedVariables("eid_inserted", "eid_readed", "eid_removed");
	const [eidStatus, eIdData] = useEId(eIdInserted, eIdReaded, eIdRemoved);

	const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
	const [language, setLanguage] = useState<LANGUAGE | undefined>();

	const [currentFlow, setCurrentFlow] = useState<IFlow>();
	const [flaggedFlow, setFlaggedFlow] = useState<IFlow>();
	const [readyToChangeFlow, setReadyToChangeFlow] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [printRequested, setPrintRequested] = useState<boolean>(false);
	const [signInRequested, setSignInRequested] = useState<boolean>(false);

	const [printTicket, isPrinting, error, signInPatient, checkPrinterStatus] = usePrintTicket();

	const [ticketData, dispatch] = useReducer(ticketDataReducer, initialState);

	useEffect(() => {
		getRoute().then((route) => {
			setSelectedRoute(route);
		});
	},[]);

	useEffect(() => {
		if (Variables.C_ORIENTATION() === ORIENTATION.HORIZONTAL) {
			const html = document.querySelector("html");

			if (html !== null) {
				html.style.fontSize = Variables.HEIGHT + "px";
			}
		} else {
			const html = document.querySelector("html");

			if (html !== null) {
				html.style.fontSize = Variables.WIDTH + "px";
			}
		}
	}, []);

	//* ----------------- *//
	//* Tracks eId Status *//
	//* ----------------- *//
	useEffect(() => {
		console.log("eid status has changed to:", eidStatus);

		if (ticketData.pageIsListeningToEId && eidStatus === eIdStatus.INSERTED) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [eidStatus]);

	//* --------------- *//
	//* Tracks eId Data *//
	//* --------------- *//
	useEffect(() => {
		console.log("current eid data is:", eIdData);

		if (ticketData.pageIsListeningToEId && eIdData != null) {
			dispatch({
				type: TicketDataActionType.EIDUPDATE,
				payload: eIdData as eIdData,
			});
		}
	}, [eIdData]);

	useEffect(() => {
		if (ticketData.pageIsListeningToEId && eIdData != null && eidStatus === eIdStatus.READ) {
			dispatch({
				type: TicketDataActionType.EIDREADUPDATE,
				payload: true,
			});
		}
	}, [ticketData.pageIsListeningToEId, eIdData, eidStatus]);

	//* -------------------------------- *//
	//* Checks flow every 5 to 6 minutes *//
	//* -------------------------------- *//
	useEffect(() => {
		if (selectedRoute) {
			const updateFlow = () => {
				const currentScheduleItem = checkCurrentFlow(selectedRoute);

				if (currentScheduleItem) {
					const flow = selectedRoute.flows.find((flow) => flow.id === currentScheduleItem.id);
					setFlaggedFlow(flow);
				}
			};

			updateFlow();

			setIntervalRange(() => {
				updateFlow();
			}, [5 * 60 * 1000, 6 * 60 * 1000]);
		}
	}, [selectedRoute]);

	//* ------------------------------------------- *//
	//* Checks printer status every 5 to 10 seconds *//
	//* ------------------------------------------- *//
	useEffect(() => {
		checkPrinterStatus();
		setIntervalRange(() => {
			checkPrinterStatus();
		}, [5 * 1000, 10 * 1000]);
	}, []);

	//* ----------------------------------------- *//
	//* Makes sure any error wipe all saved datas *//
	//* ----------------------------------------- *//
	useEffect(() => {
		if (error.hasError) {
			resetAllData();
		}
	}, [error.hasError]);

	//* --------------------------- *//
	//* Manages print/save requests *//
	//* --------------------------- *//
	useEffect(() => {
		dispatch({
			type: TicketDataActionType.READYTOPRINTUPDATE,
			payload: true,
		});

		if (printRequested) {
			printTicket(ticketData, currentFlow);
		}

		if (signInRequested) {
			signInPatient(ticketData, currentFlow);
		}

		resetAllData();
	}, [printRequested, signInRequested]);

	//* --------------------------------------------------------------------------- *//
	//* Flags new flow before changing it to prevent change during user interaction *//
	//* --------------------------------------------------------------------------- *//
	useEffect(() => {
		if (flaggedFlow !== currentFlow && readyToChangeFlow) {
			setCurrentFlow(flaggedFlow);
		}
	}, [flaggedFlow, readyToChangeFlow]);

	//* ------------------------------------------- *//
	//* Updates language in the ticket data reducer *//
	//* ------------------------------------------- *//
	useEffect(() => {
		dispatch({
			type: TicketDataActionType.LANGUAGEUPDATE,
			payload: language as LANGUAGE,
		});
	}, [language]);

	//* ----- Handlers ----- *//
	const printHandler = () => {
		setPrintRequested(true);
	};

	const signInHandler = () => {
		setSignInRequested(true);
	};

	const resetAllData = () => {
		setPrintRequested(false);
		setSignInRequested(false);
		dispatch({
			type: TicketDataActionType.CLEARDATA,
			payload: undefined,
		});
	};

	const clearErrorHandler = () => {
		error.clearError();
	};

	if (currentFlow) {
		return (
			<div onContextMenu={(e: any) => e.preventDefault()}>
				<LanguageContext.Provider value={{ language, setLanguage, }}>
					<TicketDataContext.Provider value={{ ticketState: ticketData, dispatchTicketState: dispatch, }}>
						<FlowContext.Provider value={{ flow: currentFlow, setReload: setReadyToChangeFlow, }}>
							{Variables.W_DEBUG && (
							//! Don't forget to false debug variable before prod
								<Debugger
									eidData={ticketData.eIdDatas}
									messages={[
										`eidstatus: ${eidStatus}`,
										`firstname from eiddata: ${eIdData?.firstName}`,
										`eidread: ${ticketData.eIdRead}`,
										`page is listening to eid: ${ticketData.pageIsListeningToEId}`,
										isPrinting ? "Printing!" : "",
										error.hasError ? "Error!" : ""
									]}
								/>
							)}

							{error.hasError &&
							<DisplayError
								errorCode={error.errorCode}
								message={error.message}
								onClick={clearErrorHandler}
								route={selectedRoute}
							/>}

							{isLoading && <LoadingScreen />}

							<PageRouter
								onPrint={printHandler}
								isPrinting={isPrinting}
								onSignIn={signInHandler}
								error={error}
							/>
						</FlowContext.Provider>
					</TicketDataContext.Provider>
				</LanguageContext.Provider>
			</div>
		);
	} else {
		return (
			<DisplayError
				errorCode={ERROR_CODE.D503}
				message="No flow available"
				onClick={clearErrorHandler}
				route={selectedRoute}
			/>
		);
	}
}

export default Engine;
