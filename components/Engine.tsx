import { useEffect, useReducer, useState } from "react";

import "../styles/index.scss";

import { Variables } from "../../variables";

import { ORIENTATION } from "../../core/variables";
import useSharedVariables from "../../core/hooks/useSharedVariables";
import useEId, { eIdData, eIdStatus } from "../../core/hooks/useEId";
import { setIntervalRange } from "../../core/customInterval";

import { IFlow, LANGUAGE, PRINT_ACTION_TYPE, Route, TicketDataActionType } from "../interfaces";

import { TicketDataContext } from "../contexts/ticketDataContext";
import { FlowContext } from "../contexts/flowContext";
import { LanguageContext } from "../contexts/languageContext";
import { ErrorContext } from "../contexts/errorContext";
import { PrintContext } from "../contexts/printContext";
import { AppointmentContext } from "../contexts/appointmentContext";

import ticketDataReducer, { initialTicketState } from "../reducers/ticketDataReducer";
import appointmentReducer, { initialAppointmentState } from "../reducers/appointmentReducer";
import printReducer, { initialPrintState } from "../reducers/printReducer";
import errorReducer, { initialErrorState } from "../reducers/errorReducer";

import usePrinter from "../hooks/usePrinter";
import useTicket from "../hooks/useTicket";
import useQrCode from "../hooks/useQrCode";

import checkCurrentFlow from "../utils/checkCurrentFlow";

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

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [language, setLanguage] = useState<LANGUAGE | undefined>();

	const [currentFlow, setCurrentFlow] = useState<IFlow>();
	const [flaggedFlow, setFlaggedFlow] = useState<IFlow>();
	const [readyToChangeFlow, setReadyToChangeFlow] = useState<boolean>(true);

	const [ticketData, dispatchTicketState] = useReducer(ticketDataReducer, initialTicketState);
	const [appointmentState, dispatchAppointmentState] = useReducer(appointmentReducer, initialAppointmentState);
	const [printState, dispatchPrintState] = useReducer(printReducer, initialPrintState);
	const [error, dispatchError] = useReducer(errorReducer, initialErrorState);

	const [createTicket, ticketPDF] = useTicket(dispatchError);
	const [qrCodeWrite, appointmentTicketPDF] = useQrCode(dispatchAppointmentState);
	const [printTicket, isPrinting , checkPrinterStatus] = usePrinter(dispatchError);

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

	//* ---- *//
	//* Flow *//
	//* ---- *//
	// Checks flow every minute
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

			setInterval(() => {
				updateFlow();
			}, 60 * 1000);
		}
	}, [props.route]);

	// Change current with flagged flow if no user interaction *//
	useEffect(() => {
		if (flaggedFlow !== currentFlow && readyToChangeFlow) {
			setCurrentFlow(flaggedFlow);
		}
	}, [flaggedFlow, readyToChangeFlow]);

	//* -------------- *//
	//* Printer status *//
	//* -------------- *//
	// Checks printer status every 5-10 seconds
	useEffect(() => {
		if (!Variables.PREVIEW) {
			checkPrinterStatus(error.errorCode);
			const delay = setIntervalRange(() => {
				//TODO separate printer status error from "regular" error?
				checkPrinterStatus(error.errorCode);
			}, [5 * 1000, 10 * 1000]);

			return () => {
				clearInterval(delay);
			};
		}
	}, [error]);

	//* -------- *//
	//* Language *//
	//* -------- *//
	// Updates language in the ticket data reducer
	useEffect(() => {
		dispatchTicketState({
			type: TicketDataActionType.LANGUAGEUPDATE,
			payload: language,
		});
	}, [language]);

	//* --- *//
	//* eId *//
	//* --- *//
	//Loading on eId inserted
	useEffect(() => {
		if (ticketData.pageIsListeningToEId && eidStatus === eIdStatus.INSERTED) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [eidStatus]);

	// Updates eId Data in reducer
	useEffect(() => {
		if (ticketData.pageIsListeningToEId && eIdData != null) {
			dispatchTicketState({
				type: TicketDataActionType.EIDUPDATE,
				payload: eIdData as eIdData,
			});
		}
	}, [eIdData]);

	// Updates eId read in reducer
	useEffect(() => {
		if (ticketData.pageIsListeningToEId && eIdData != null && eidStatus === eIdStatus.READ) {
			dispatchTicketState({
				type: TicketDataActionType.EIDREADUPDATE,
				payload: true,
			});
		}
	}, [ticketData.pageIsListeningToEId, eIdData, eidStatus]);

	//* ------ *//
	//* Errors *//
	//* ------ *//
	// Makes sure any error wipe all saved datas
	useEffect(() => {
		if (error.hasError) {
			resetTicketData();
		}
	}, [error.hasError]);

	//* -------------- *//
	//* Print requests *//
	//* -------------- *//
	// Monitors printState to trigger ticket creation/print
	useEffect(() => {
		if (printState.ticketCreationRequested) {
			createTicket(ticketData, currentFlow);

			dispatchPrintState({
				type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION,
				payload: false,
			});
		}

		if (printState.printRequested && printState.ticketPDF) {
			printTicket(printState.ticketPDF);

			dispatchPrintState({ type: PRINT_ACTION_TYPE.CLEARALL,});
		}
	}, [printState]);
	// Monitors ticket PDF and updates printReducer
	useEffect(() => {
		if (ticketPDF !== null) {
			dispatchPrintState({
				type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
				payload: ticketPDF,
			});
		}

		if (appointmentTicketPDF !== null) {
			dispatchPrintState({
				type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
				payload: appointmentTicketPDF,
			});
		}
	}, [ticketPDF, appointmentTicketPDF]);

	//* ------------ *//
	//* Appointments *//
	//* ------------ *//
	useEffect(() => {
		if (appointmentState.isCheckedIn) {
			//
		}
	}, [appointmentState]);

	// ---------- Handlers ---------- //
	const resetTicketData = () => {
		dispatchTicketState({
			type: TicketDataActionType.CLEARDATA,
			payload: undefined,
		});
	};

	const keydownHandler = (e: any) => {
		if (appointmentState.isCheckingIn || appointmentState.isCheckingOut) {
			qrCodeWrite(e.key, appointmentState.isCheckingIn, appointmentState.isCheckingOut);
		}
	};

	if (currentFlow) {
		return (
			<div
				onContextMenu={(e: any) => e.preventDefault()}
				style={{ userSelect: "none", }}
				onKeyDown={keydownHandler}
				tabIndex={0}
			>
				<LanguageContext.Provider value={{ language, setLanguage, }}>
					<TicketDataContext.Provider value={{ ticketState: ticketData, dispatchTicketState, }}>
						<AppointmentContext.Provider value={{ appointmentState, dispatchAppointmentState, }}>
							<FlowContext.Provider value={{ flow: currentFlow, setReload: setReadyToChangeFlow, }}>
								<ErrorContext.Provider value={{ errorState: error, dispatchErrorState: dispatchError, }}>
									<PrintContext.Provider value={{ printState, dispatchPrintState, }}>

										{props.debug && (
											<Debugger
												eidData={ticketData.eIdDatas}
												messages={[
													`eidstatus: ${eidStatus}`,
													`firstname from eiddata: ${eIdData?.firstName}`,
													`eidread: ${ticketData.eIdRead}`,
													`page is listening to eid: ${ticketData.pageIsListeningToEId}`,
													isPrinting ? "Printing!" : "",
													error.hasError ? `Error ${error.errorCode}: ${error.message}` : ""
												]}
											/>
										)}

										{error.hasError && <DisplayError route={props.route} />}

										{isLoading && <LoadingScreen />}

										<PageRouter
											isPrinting={isPrinting}
										/>

									</PrintContext.Provider>
								</ErrorContext.Provider>
							</FlowContext.Provider>
						</AppointmentContext.Provider>
					</TicketDataContext.Provider>
				</LanguageContext.Provider>
			</div>
		);
	} else {
		return <DisplayError route={props.route} />;
	}
}

export default Engine;
