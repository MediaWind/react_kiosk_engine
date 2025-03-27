import { createContext, useContext } from "react";
import { IAppointmentsAction, IAppointmentsState } from "../interfaces";

type appointmentsContext = {
    appointmentsState: IAppointmentsState
    dispatchAppointmentsState: React.Dispatch<IAppointmentsAction> 
}

export const AppointmentsContext = createContext<appointmentsContext>({
	appointmentsState: {
		appointments: undefined,
		getAppointmentsRequested: {status: false, params: {},},
	},
	dispatchAppointmentsState: () => null,
});

export const useAppointmentsContext = () => useContext(AppointmentsContext);