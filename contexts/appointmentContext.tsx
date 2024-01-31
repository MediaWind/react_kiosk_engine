import { createContext, useContext } from "react";

import { IAppointmentAction, IAppointmentState } from "../interfaces";

type appointmentContext = {
	appointmentState: IAppointmentState
	dispatchAppointmentState: React.Dispatch<IAppointmentAction>
}

export const AppointmentContext = createContext<appointmentContext>({
	appointmentState: {
		isCheckingIn: false,
		isCheckingOut: false,
		isCheckedIn: false,
		isCheckedOut: false,
	},
	dispatchAppointmentState: () => null,
});

export const useAppointmentContext = () => useContext(AppointmentContext);
