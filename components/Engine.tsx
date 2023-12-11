import { useEffect, useReducer, useState } from "react";

import "../styles/index.scss";

import { Variables } from "../../variables";

import { ORIENTATION } from "../../core/variables";
import useSharedVariables from "../../core/hooks/useSharedVariables";
import useEId, { eIdData, eIdStatus } from "../../core/hooks/useEId";
import { setIntervalRange } from "../../core/customInterval";

import { ERROR_ACTION_TYPE, ERROR_CODE, IFlow, LANGUAGE, Route, TicketDataActionType } from "../interfaces";

import { TicketDataContext } from "../contexts/ticketDataContext";
import { FlowContext } from "../contexts/flowContext";
import { LanguageContext } from "../contexts/languageContext";
import { ErrorContext } from "../contexts/errorContext";

import ticketDataReducer, { initialTicketState } from "../reducers/ticketDataReducer";
import appointmentReducer, { initialAppointmentState } from "../reducers/appointmentReducer";
import errorReducer, { initialErrorState } from "../reducers/errorReducer";

import usePrintTicket from "../hooks/usePrintTicket";
import useQrCode from "../hooks/useQrCode";

import checkCurrentFlow from "../utils/checkCurrentFlow";
import checkPrinterStatus from "../utils/checkPrinterStatus";

import PageRouter from "../components/PageRouter";
import LoadingScreen from "../components/ui/LoadingScreen";
import Debugger from "../components/debug/Debugger";
import DisplayError from "../components/ui/DisplayError";
import { AppointmentContext } from "../contexts/appointmentContext";

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

	const [ticketData, dispatchTicketState] = useReducer(ticketDataReducer, initialTicketState);
	const [appointmentState, dispatchAppointmentState] = useReducer(appointmentReducer, initialAppointmentState);
	const [error, dispatchError] = useReducer(errorReducer, initialErrorState);

	const [printRequested, setPrintRequested] = useState<boolean>(false);
	const [signInRequested, setSignInRequested] = useState<boolean>(false);

	const [printTicket, isPrinting, signInPatient] = usePrintTicket(dispatchError);
	const [qrCodeWrite] = useQrCode(dispatchAppointmentState);

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

	//* ------------------------ *//
	//* Checks flow every minute *//
	//* ------------------------ *//
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

	//* ------------------------------------------- *//
	//* Checks printer status every 5 to 10 seconds *//
	//* ------------------------------------------- *//
	useEffect(() => {
		// checkPrinterStatus(dispatchError, error.errorCode);
		const delay = setIntervalRange(() => {
			//TODO separate printer status error from "regular" error
			checkPrinterStatus(dispatchError, error.errorCode);
		}, [5 * 1000, 10 * 1000]);

		return () => {
			clearInterval(delay);
		};
	}, [error]);

	useEffect(() => {
		const delay = setIntervalRange(() => {
			if (!navigator.onLine) {
				dispatchError({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.A503,
						message: "Kiosk is not connected to internet",
					},
				});
			} else {
				dispatchError({
					type: ERROR_ACTION_TYPE.CLEARERROR,
					payload: undefined,
				});
			}
		}, [5 * 1000, 10 * 1000]);

		return () => {
			clearInterval(delay);
		};
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

		resetAllData();
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

	const keydownHandler = (e: any) => {
		if (appointmentState.isCheckingIn || appointmentState.isCheckingOut) {
			qrCodeWrite(e.key, appointmentState.isCheckingIn, appointmentState.isCheckingOut);
		}
	};

	if (currentFlow) {
		return (
			<div
				onContextMenu={(e: any) => e.preventDefault()}
				style={{
					// cursor: "none !important",
					userSelect: "none",
				}}
				onKeyDown={keydownHandler}
				tabIndex={0}
			>
				<LanguageContext.Provider value={{ language, setLanguage, }}>
					<TicketDataContext.Provider value={{ ticketState: ticketData, dispatchTicketState, }}>
						<AppointmentContext.Provider value={{ appointmentState, dispatchAppointmentState, }}>
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
												error.hasError ? `Error ${error.errorCode}: ${error.message}` : ""
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
