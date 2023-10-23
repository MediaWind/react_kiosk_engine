import { useEffect, useReducer, useState } from "react";

import { Variables } from "../../variables";

import { ORIENTATION } from "../../core/variables";
import useSharedVariables from "../../core/hooks/useSharedVariables";
import useEId, { eIdData, eIdStatus } from "../../core/hooks/useEId";
import { setIntervalRange } from "../../core/customInterval";

import { IFlow, LANGUAGE, Route, TicketDataActionType } from "../interfaces";

import { TicketDataContext } from "../contexts/ticketDataContext";
import { FlowContext } from "../contexts/flowContext";
import { LanguageContext } from "../contexts/languageContext";
import { ErrorContext } from "../contexts/errorContext";

import ticketDataReducer, { initialState } from "../reducers/ticketDataReducer";
import errorReducer, { initialErrorState } from "../reducers/errorReducer";

import usePrintTicket from "../hooks/usePrintTicket";

import checkCurrentFlow from "../utils/checkCurrentFlow";
import checkPrinterStatus from "../utils/checkPrinterStatus";

import PageRouter from "../components/PageRouter";
import LoadingScreen from "../components/ui/LoadingScreen";
import Debugger from "../components/debug/Debugger";
import DisplayError from "../components/ui/DisplayError";

interface IEngineProps {
	route: Route
	debug?: boolean
}

function Engine(props: IEngineProps): JSX.Element {
	const [eIdInserted, eIdReaded, eIdRemoved] = useSharedVariables("eid_inserted", "eid_readed", "eid_removed");
	const [eidStatus, eIdData] = useEId(eIdInserted, eIdReaded, eIdRemoved);

	const [language, setLanguage] = useState<LANGUAGE | undefined>();

	const [currentFlow, setCurrentFlow] = useState<IFlow>();
	const [flaggedFlow, setFlaggedFlow] = useState<IFlow>();
	const [readyToChangeFlow, setReadyToChangeFlow] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [ticketData, dispatchTicketState] = useReducer(ticketDataReducer, initialState);
	const [error, dispatchError] = useReducer(errorReducer, initialErrorState);

	const [printRequested, setPrintRequested] = useState<boolean>(false);
	const [signInRequested, setSignInRequested] = useState<boolean>(false);

	const [printTicket, isPrinting, signInPatient] = usePrintTicket(dispatchError);

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
			dispatchTicketState({
				type: TicketDataActionType.EIDUPDATE,
				payload: eIdData as eIdData,
			});
		}
	}, [eIdData]);

	useEffect(() => {
		if (ticketData.pageIsListeningToEId && eIdData != null && eidStatus === eIdStatus.READ) {
			dispatchTicketState({
				type: TicketDataActionType.EIDREADUPDATE,
				payload: true,
			});
		}
	}, [ticketData.pageIsListeningToEId, eIdData, eidStatus]);

	//* -------------------------------- *//
	//* Checks flow every 5 to 6 minutes *//
	//* -------------------------------- *//
	useEffect(() => {
		if (props.route) {
			const updateFlow = () => {
				const currentScheduleItem = checkCurrentFlow(props.route);

				if (currentScheduleItem) {
					const flow = props.route.flows.find((flow) => flow.id === currentScheduleItem.id);
					setFlaggedFlow(flow);
				}
			};

			updateFlow();

			setIntervalRange(() => {
				updateFlow();
			}, [5 * 60 * 1000, 6 * 60 * 1000]);
		}
	}, [props.route]);

	//* ------------------------------------------- *//
	//* Checks printer status every 5 to 10 seconds *//
	//* ------------------------------------------- *//
	useEffect(() => {
		checkPrinterStatus(dispatchError);
		setIntervalRange(() => {
			checkPrinterStatus(dispatchError);
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
		dispatchTicketState({
			type: TicketDataActionType.LANGUAGEUPDATE,
			payload: language as LANGUAGE,
		});
	}, [language]);

	//* ------------------- *//
	//* Send print requests *//
	//* ------------------- *//
	useEffect(() => {
		if (printRequested) {
			printTicket(ticketData, currentFlow);
		}
		if (signInRequested) {
			signInPatient(ticketData, currentFlow);
		}
	}, [printRequested, signInRequested]);

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
		dispatchTicketState({
			type: TicketDataActionType.CLEARDATA,
			payload: undefined,
		});
	};

	if (currentFlow) {
		return (
			<div onContextMenu={(e: any) => e.preventDefault()}>
				<LanguageContext.Provider value={{ language, setLanguage, }}>
					<TicketDataContext.Provider value={{ ticketState: ticketData, dispatchTicketState, }}>
						<FlowContext.Provider value={{ flow: currentFlow, setReload: setReadyToChangeFlow, }}>
							<ErrorContext.Provider value={{ errorState: error, dispatchErrorState: dispatchError, }}>

								{props.debug && (
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

								{error.hasError && <DisplayError route={props.route} />}

								{isLoading && <LoadingScreen />}

								<PageRouter
									onPrint={printHandler}
									isPrinting={isPrinting}
									onSignIn={signInHandler}
								/>

							</ErrorContext.Provider>
						</FlowContext.Provider>
					</TicketDataContext.Provider>
				</LanguageContext.Provider>
			</div>
		);
	} else {
		return <DisplayError route={props.route} />;
	}
}

export default Engine;
