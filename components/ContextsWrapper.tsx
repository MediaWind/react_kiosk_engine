import { ReactNode } from "react";

import { eIdStatus } from "../../core/hooks/useEId";

import {
	IAppointmentAction,
	IAppointmentState,
	IErrorAction,
	IErrorState,
	IFlow,
	IPrintAction,
	IPrintState,
	ITicketDataAction,
	ITicketDataState,
	LANGUAGE
} from "../interfaces";

import { AppointmentContext } from "../contexts/appointmentContext";
import { EIdContext } from "../contexts/eIdContext";
import { ErrorContext } from "../contexts/errorContext";
import { FlowContext } from "../contexts/flowContext";
import { LanguageContext } from "../contexts/languageContext";
import { PrintContext } from "../contexts/printContext";
import { TicketDataContext } from "../contexts/ticketDataContext";

interface IContextsWrapperProps {
	children: ReactNode[]
	values: {
		defaultLanguage: LANGUAGE
		language: LANGUAGE
		setLanguage: React.Dispatch<React.SetStateAction<LANGUAGE>>
		ticketState: ITicketDataState
		dispatchTicketState: React.Dispatch<ITicketDataAction>
		appointmentState: IAppointmentState
		dispatchAppointmentState: React.Dispatch<IAppointmentAction>
		currentFlow: IFlow
		setReadyToChangeFlow: React.Dispatch<React.SetStateAction<boolean>>
		error: IErrorState
		dispatchErrorState: React.Dispatch<IErrorAction>
		printState: IPrintState
		dispatchPrintState: React.Dispatch<IPrintAction>
		eidStatus: eIdStatus
	}
}

export default function ContextsWrapper(props: IContextsWrapperProps): JSX.Element {
	const { children, values, } = props;

	return (
		<LanguageContext.Provider value={{ defaultLangue: values.defaultLanguage ?? LANGUAGE.FRENCH, language: values.language, setLanguage: values.setLanguage, }}>
			<TicketDataContext.Provider value={{ ticketState: values.ticketState, dispatchTicketState: values.dispatchTicketState, }}>
				<AppointmentContext.Provider value={{ appointmentState: values.appointmentState, dispatchAppointmentState: values.dispatchAppointmentState, }}>
					<FlowContext.Provider value={{ flow: values.currentFlow, setReload: values.setReadyToChangeFlow, }}>
						<ErrorContext.Provider value={{ errorState: values.error, dispatchErrorState: values.dispatchErrorState, }}>
							<PrintContext.Provider value={{ printState: values.printState, dispatchPrintState: values.dispatchPrintState, }}>
								<EIdContext.Provider value={{ status: values.eidStatus, }}>

									{children}

								</EIdContext.Provider>
							</PrintContext.Provider>
						</ErrorContext.Provider>
					</FlowContext.Provider>
				</AppointmentContext.Provider>
			</TicketDataContext.Provider>
		</LanguageContext.Provider>
	);
}
