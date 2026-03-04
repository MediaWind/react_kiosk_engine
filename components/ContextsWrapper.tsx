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
	IAppointmentsState,
	IAppointmentsAction
} from "../interfaces";

import { AppointmentContext } from "../contexts/appointmentContext";
import { EIdContext } from "../contexts/eIdContext";
import { ErrorContext } from "../contexts/errorContext";
import { FlowContext } from "../contexts/flowContext";
import { LanguageContext } from "../contexts/languageContext";
import { PrintContext } from "../contexts/printContext";
import { TicketDataContext } from "../contexts/ticketDataContext";
import { AppointmentsContext } from "../contexts/appointmentsContext";
import { ServiceCatalogItem, ServicesCatalogContext } from "../contexts/servicesCatalogContext";

interface IContextsWrapperProps {
	children: ReactNode[]
	values: {
		defaultLanguage: string
		language: string
		setLanguage: React.Dispatch<React.SetStateAction<string>>
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
		appointmentsState: IAppointmentsState
		dispatchAppointmentsState: React.Dispatch<IAppointmentsAction>
		servicesCatalog: ServiceCatalogItem[]
		setServicesCatalog: React.Dispatch<React.SetStateAction<ServiceCatalogItem[]>>
	}
}

export default function ContextsWrapper(props: IContextsWrapperProps): JSX.Element {
	const { children, values, } = props;

	return (
		<LanguageContext.Provider value={{ defaultLangue: values.defaultLanguage, language: values.language, setLanguage: values.setLanguage, }}>
			<TicketDataContext.Provider value={{ ticketState: values.ticketState, dispatchTicketState: values.dispatchTicketState, }}>
				<AppointmentsContext.Provider value={{ appointmentsState: values.appointmentsState, dispatchAppointmentsState: values.dispatchAppointmentsState, }}>
					<AppointmentContext.Provider value={{ appointmentState: values.appointmentState, dispatchAppointmentState: values.dispatchAppointmentState, }}>
						<FlowContext.Provider value={{ flow: values.currentFlow, setReload: values.setReadyToChangeFlow, }}>
							<ErrorContext.Provider value={{ errorState: values.error, dispatchErrorState: values.dispatchErrorState, }}>
								<PrintContext.Provider value={{ printState: values.printState, dispatchPrintState: values.dispatchPrintState, }}>
									<ServicesCatalogContext.Provider value={{ servicesCatalog: values.servicesCatalog, setServicesCatalog: values.setServicesCatalog, }}>
										<EIdContext.Provider value={{ status: values.eidStatus, }}>

											{children}

										</EIdContext.Provider>
									</ServicesCatalogContext.Provider>
								</PrintContext.Provider>
							</ErrorContext.Provider>
						</FlowContext.Provider>
					</AppointmentContext.Provider>
				</AppointmentsContext.Provider>
			</TicketDataContext.Provider>
		</LanguageContext.Provider>
	);
}
