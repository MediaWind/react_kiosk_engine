import { Appointment, APPOINTMENTS_ACTION_TYPE, IAppointmentsAction, IAppointmentsState, IAppointmentsRequested } from "../interfaces";

export default function appointmentsReducer(appointmentsState: IAppointmentsState, action: IAppointmentsAction): IAppointmentsState {
	console.log(action);
	if (!action.payload) {
		return initialAppointmentsState;
	}

	switch (action.type) {
		case APPOINTMENTS_ACTION_TYPE.GETAPPOINTMENTS: {
			return {
				...appointmentsState,
				getAppointmentsRequested: action.payload as IAppointmentsRequested,
			};
		}

		case APPOINTMENTS_ACTION_TYPE.UPDATEAPPOINTMENTS: {
			return {
				...appointmentsState,
				appointments: action.payload as Appointment[],
			};
		}

		case APPOINTMENTS_ACTION_TYPE.CLEARALL:
		default: return initialAppointmentsState;
	}
}

export const initialAppointmentsState: IAppointmentsState = {
	appointments: [],
	getAppointmentsRequested: {status: false, params: [],},
};
