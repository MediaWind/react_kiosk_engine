import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import "../i18n";
import "../styles/index.scss";

import { Variables } from "../../variables";

import { ORIENTATION } from "../../core/variables";
import useSharedVariables from "../../core/hooks/useSharedVariables";
import useEId, { eIdData, eIdStatus } from "../../core/hooks/useEId";
import { setIntervalRange } from "../../core/customInterval";

import { APPOINTMENT_ACTION_TYPE, APPOINTMENTS_ACTION_TYPE, ERROR_ACTION_TYPE, IFlow, IPage, IReadPage, PRINT_ACTION_TYPE, Route, SuperContext, TICKET_DATA_ACTION_TYPE } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import ticketDataReducer, { initialTicketState } from "../reducers/ticketDataReducer";
import appointmentReducer, { initialAppointmentState } from "../reducers/appointmentReducer";
import printReducer, { initialPrintState } from "../reducers/printReducer";
import errorReducer, { initialErrorState } from "../reducers/errorReducer";
import appointmentsReducer, { initialAppointmentsState } from "../reducers/appointmentsReducer";

import useScanner from "../hooks/useScanner";
import usePrinter from "../hooks/usePrinter";
import useTicket from "../hooks/useTicket";
import useAppointment from "../hooks/useAppointment";

import { Console } from "../utils/console";
import checkCurrentFlow from "../utils/checkCurrentFlow";

import ContextsWrapper from "./ContextsWrapper";
import PageRouter from "../components/PageRouter";
import LoadingScreen from "../components/ui/LoadingScreen";
import Debugger from "../components/debug/Debugger";
import DisplayError from "../components/ui/DisplayError";
import EIdBlock from "./ui/EIdBlock";
import ActivePage from "./ActivePage";

interface IRouterContexts {
	router: {
		state: IPage[],
		dispatcher: {
			nextPage: CallableFunction,
			previousPage: CallableFunction
			homePage: CallableFunction,
		},
	},
	customAction: {
		state: {
			page: JSX.Element | undefined
			id?: string
		},
		dispatcher: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
	}
}

interface IEngineProps {
	route: Route
	/**
	 * This forwards all contexts/reducers informations from Engine to App.
	 *
	 * @use
	 * Use the forwarded object as a param in your custom function to read and overwrite the different informations of the engine.
	 *
	 * @structure
	 * The forwarded object follows this structure:
	 *
	 * ```ts
	 * {
	 * 	router: { state, dispatcher },
	 * 	language: { state, dispatcher },
	 * 	ticket: { state, dispatcher },
	 * 	print: { state, dispatcher },
	 * 	appointment: { state, dispatcher },
	 * 	error: { state, dispatcher },
	 * 	customPage: { state, dispatcher }
	 * }
	 * ```
	 *
	 * _state_ is the read only current state, _dispatcher_ allows you to overwrite the current state. Refer to a specific dispatcher for more info on what arguments each of them expects.
	 *
	 * @example
	 * In App:
	 *
	 * ```ts
	 * function customAction(value) {
	 *		if (value.language.state === "en") {
	 *			value.router.dispatcher("05987761-0c07-4856-8160-db3d5659eede");
	 *		}
	 *
	 *		if (value.ticket.state.service !== undefined) {
	 *			value.print.disptacher({ type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION, payload: true, });
	 *		}
	 * }
		```
	 */
	onCustomAction?: CallableFunction
	onConditions?: CallableFunction
	waitSecondsAfterPrint?: number
	debug?: boolean
}

function Engine(props: IEngineProps): JSX.Element {
	const [eIdInserted, eIdReaded, eIdRemoved, eIdError] = useSharedVariables("eid_inserted", "eid_readed", "eid_removed", "eid_error");
	const [eidStatus, eIdData, eidError] = useEId(eIdInserted, eIdReaded, eIdRemoved, eIdError);
	const { t, i18n, } = useTranslation();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [eIdBlock, setEIdBlock] = useState<boolean>(false);

	const [defaultLanguage, setDefaultLanguage] = useState<string>("fr");
	const [language, setLanguage] = useState<string>("fr");

	const [currentFlow, setCurrentFlow] = useState<IFlow>();
	const [flaggedFlow, setFlaggedFlow] = useState<IFlow>();
	const [readyToChangeFlow, setReadyToChangeFlow] = useState<boolean>(true);

	const [ticketState, dispatchTicketState] = useReducer(ticketDataReducer, { ...initialTicketState, language: props.route.i18n.defaultLanguage,  });
	const [appointmentState, dispatchAppointmentState] = useReducer(appointmentReducer, initialAppointmentState);
	const [printState, dispatchPrintState] = useReducer(printReducer, initialPrintState);
	const [error, dispatchErrorState] = useReducer(errorReducer, initialErrorState);
	const [appointmentsState, dispatchAppointmentsState] = useReducer(appointmentsReducer, initialAppointmentsState);

	const [qrCode, writeQrCode, resetQrCode] = useScanner();
	const [printTicket, isPrinting , checkPrinterStatus] = usePrinter(dispatchErrorState);
	const [createTicket] = useTicket(dispatchPrintState, dispatchErrorState);
	const [appointmentTicketPDF, checkIn, checkOut, getAppointments] = useAppointment(dispatchAppointmentState, dispatchErrorState, dispatchAppointmentsState);


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
			setDefaultLanguage(props.route.i18n.defaultLanguage);

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

	// Change current with flagged flow if no user interaction
	useEffect(() => {
		if (flaggedFlow?.id !== currentFlow?.id && readyToChangeFlow) {
			Console.info("Changing flow");
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
			type: TICKET_DATA_ACTION_TYPE.LANGUAGEUPDATE,
			payload: language,
		});
	}, [language]);
	// Updates language in i18n
	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language]);

	//* --- *//
	//* eId *//
	//* --- *//
	//Loading on eId inserted
	useEffect(() => {
		Console.info("eId status: " + eidStatus);
		const delayCustomLoader = props.route.eventManagement?.customLoader?.duration ?? 0;

		if (eidError !== "") {
			dispatchErrorState({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: eidError === "unknown_card" ? ERROR_CODE.A415 : ERROR_CODE.B400,
					message: t(`${eidError}`, { ns: "errors", }),
				},
			});
			return;
		}

		let delay: NodeJS.Timeout;

		if (eidStatus === eIdStatus.INSERTED) {
			setIsLoading(true);

			delay = setTimeout(() => {
				setIsLoading(false);

				dispatchErrorState({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.A408,
						message: "ID card could not be read",
					},
				});
			}, 15 * 1000);
		} else {
			dispatchErrorState({ type: ERROR_ACTION_TYPE.CLEARERROR, });
		}

		if (eidStatus === eIdStatus.READ && eIdData === null) {
			dispatchErrorState({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.F500,
					message: "ID card reader could not find any data",
				},
			});

			return;
		}

		if (eidStatus === eIdStatus.READ && eidError === "") {
			setTimeout(() => {
				setIsLoading(false);
				setEIdBlock(true);
			}, delayCustomLoader * 1000);
		}

		if (eidStatus === eIdStatus.REMOVED) {
			setTimeout(() => {
				setEIdBlock(false);
			}, 1000);
		}

		return () => {
			clearTimeout(delay);
		};
	}, [eidStatus, eidError]);

	// Updates eId Data in reducer
	useEffect(() => {
		if (eIdData != null) {
			Console.info("Updating eId data");
			Console.info("Zip code from eId: " + eIdData.addressZip);
			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.EIDUPDATE,
				payload: eIdData as eIdData,
			});

			// If there is an eIdRead action, it will trigger the action
			const eidRead = props.route.eventManagement?.eIdRead as IReadPage;

			if(eidRead && eidRead.actions) {
				eidRead.actions.map(action => {
					// This regex will match all the variables in the endpoint with the format {variable}
					// It will then replace the match with the value of the match in <Variables>
					const regex = /\{([^}]+)\}/g; 
					const matches = [...action.endpoint.matchAll(regex)].map(m => m[1]);

					matches.map(match => {
						if(Variables[match as keyof typeof Variables]) {
							action.endpoint = action.endpoint.replace(`{${match}}`, Variables[match as keyof typeof Variables].toString());
						}
					});
				
					if(action.type === "POST" || action.type === "PUT") {
						const body: { [key: string]: any } = {};

						for (const key in action.body) {
							const data = (eIdData as any)[key];
							body[action.body[key]] = data;
						}

						fetch(action.endpoint, {
							method: action.type,
							headers: action.headers,
							body: JSON.stringify(body),
						})
							.then(response => response.json())
							.then(data => {
								console.log(data);
							})
							.catch(error => {
								console.error(error);
							});
					}
				});
			}
		}
	}, [eIdData]);

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
			createTicket(ticketState, currentFlow);

			dispatchPrintState({
				type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION,
				payload: false,
			});
		}

		if (printState.printRequested && printState.ticketPDF) {
			printTicket(printState.ticketPDF, props.waitSecondsAfterPrint ?? 5);

			dispatchPrintState({ type: PRINT_ACTION_TYPE.CLEARALL,});
			resetTicketData();
		}
	}, [printState]);
	// Monitors ticket PDF and updates printReducer
	useEffect(() => {
		if (appointmentTicketPDF !== null) {
			dispatchPrintState({
				type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
				payload: appointmentTicketPDF,
			});
		} else {
			dispatchPrintState({
				type: PRINT_ACTION_TYPE.UPDATETICKETPDF,
				payload: null,
			});
		}
	}, [appointmentTicketPDF]);

	//* ------------ *//
	//* Appointment *//
	//* ------------ *//
	// Sends checkin/checkout requests when qrCode is ready then resets it
	useEffect(() => {
		if ((appointmentState.isCheckingIn || appointmentState.isCheckingOut) && qrCode !== "") {
			if (appointmentState.isCheckingIn) {
				checkIn(qrCode);
			}

			if (appointmentState.isCheckingOut) {
				checkOut(qrCode);
			}

			resetQrCode();
		}
	}, [qrCode, appointmentState.isCheckingIn, appointmentState.isCheckingOut]);

	//* ---------- *//
	//* Appointments *//
	//* ---------- *//
	// Monitors appointmentsState to trigger appointments requests
	useEffect(() => {

		if(currentFlow) {
			if (appointmentsState.getAppointmentsRequested.status) {
				const params = appointmentsState.getAppointmentsRequested.params;

				if(!params) return;

				const services = params.services ? params.services : [];
				const minBeforeAppointment = params.minBeforeAppointment ? params.minBeforeAppointment : null;
				const minAfterAppointment = params.minAfterAppointment ? params.minAfterAppointment : null;

				// Get services id
				if(params && params.nationalNumber && ticketState.eIdDatas && ticketState.eIdDatas.nationalNumber) {	
					getAppointments(null, ticketState.eIdDatas.nationalNumber, minBeforeAppointment, minAfterAppointment, services);
				}

				// TODO : add birthdate
			}
		}

	}, [appointmentsState, ticketState.eIdDatas]);

	// ---------- Handlers ---------- //
	function resetTicketData() {
		dispatchTicketState({
			type: TICKET_DATA_ACTION_TYPE.CLEARDATA,
			payload: undefined,
		});

		dispatchTicketState({
			type: TICKET_DATA_ACTION_TYPE.LANGUAGEUPDATE,
			payload: defaultLanguage,
		});
	}

	function resetAppointments() {
		dispatchAppointmentState({
			type: APPOINTMENT_ACTION_TYPE.CLEARALL,
		});

		dispatchAppointmentsState({
			type: APPOINTMENTS_ACTION_TYPE.CLEARALL,
		});
	}

	function keydownHandler(e: any) {
		writeQrCode(e.key);
	}

	function resetAll() {
		resetTicketData();
		resetAppointments();
		if (qrCode !== "") {
			resetQrCode();
		}

		dispatchPrintState({ type: PRINT_ACTION_TYPE.CLEARALL, });

		setReadyToChangeFlow(true);
		setLanguage(defaultLanguage);
	}

	function triggerCustomAction(routerStates: IRouterContexts) {
		if (props.onCustomAction) {
			props.onCustomAction({
				...routerStates,
				language: {
					state: language,
					dispatcher: setLanguage,
				},
				ticket: {
					state: ticketState,
					dispatcher: dispatchTicketState,
				},
				appointment: {
					state: appointmentState,
					dispatcher: dispatchAppointmentState,
				},
				appointments: {
					state: appointmentsState,
					dispatcher: dispatchAppointmentsState,
				},
				hooks: {
					useAppointment : [appointmentTicketPDF, checkIn, checkOut, getAppointments],
				},
				print: {
					state: printState,
					dispatcher: dispatchPrintState,
				},
				error: {
					state: error,
					dispatcher: dispatchErrorState,
				},
			} as SuperContext);
		} else {
			Console.warn("You tried to trigger a custom action, but no action was passed to Engine. Use onCustomAction as a prop to trigger a custom action.");
		}
	}

	function triggerConditions(routerStates: IRouterContexts) {
		if (props.onConditions) {
			return props.onConditions({
				...routerStates,
				language: {
					state: language,
					dispatcher: setLanguage,
				},
				ticket: {
					state: ticketState,
					dispatcher: dispatchTicketState,
				},
				appointment: {
					state: appointmentState,
					dispatcher: dispatchAppointmentState,
				},
				appointments: {
					state: appointmentsState,
					dispatcher: dispatchAppointmentsState,
				},
				hooks: {
					useAppointment : [appointmentTicketPDF, checkIn, checkOut, getAppointments],
				},
				print: {
					state: printState,
					dispatcher: dispatchPrintState,
				},
				error: {
					state: error,
					dispatcher: dispatchErrorState,
				},
			} as SuperContext);
		} else {
			Console.warn("You tried to trigger a custom action, but no action was passed to Engine. Use onCustomAction as a prop to trigger a custom action.");
		}
	}

	if (currentFlow) {
		return (
			<div
				onContextMenu={(e: any) => e.preventDefault()}
				style={{ userSelect: "none", cursor: Variables.PREVIEW ? "auto" : "none", }}
				onKeyDown={keydownHandler}
				tabIndex={0}
			>
				<ContextsWrapper values={{
					defaultLanguage,
					language,
					setLanguage,
					ticketState,
					dispatchTicketState,
					appointmentState,
					dispatchAppointmentState,
					currentFlow,
					setReadyToChangeFlow,
					error,
					dispatchErrorState,
					printState,
					dispatchPrintState,
					eidStatus,
					appointmentsState,
					dispatchAppointmentsState,
				}}>

					{props.debug && (
						<Debugger
							eidData={ticketState.eIdDatas}
							messages={[
								`eid status: ${eidStatus}`,
								`eid error: ${eidError}`,
								`firstname from eid: ${eIdData?.firstName}`,
								error.hasError ? `Error ${error.errorCode}: ${error.message}` : "",
								isLoading ? "Loading..." : ""
							]}
						/>
					)}

					{error.hasError && <DisplayError route={props.route} />}

					{isLoading && <LoadingScreen customImages={props.route.errorManagement} customLoader={props.route.eventManagement?.customLoader} />}
					{(eIdBlock && !(props.route.eventManagement && props.route.eventManagement.eIdRead)) && <EIdBlock customImages={props.route.errorManagement} />}

					<PageRouter isPrinting={isPrinting} onReset={resetAll} onCustomAction={triggerCustomAction} onConditions={triggerConditions} />

					{eIdBlock && props.route.eventManagement?.eIdRead && <ActivePage page={props.route.eventManagement.eIdRead as IPage} />}
				</ContextsWrapper>
			</div>
		);
	} else {
		return <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#222222", }} />;
	}
}

export default Engine;
