import { APPOINTMENT_ACTION_TYPE, IAppointmentAction, IAppointmentState } from "../interfaces";

export default function appointmentReducer(appointmentState: IAppointmentState, action: IAppointmentAction): IAppointmentState {
	switch (action.type) {
		case APPOINTMENT_ACTION_TYPE.UPDATECHECKIN: {
			return {
				...appointmentState,
				isCheckingIn: action.payload,
			};
		}
		case APPOINTMENT_ACTION_TYPE.UPDATECHECKOUT: {
			return {
				...appointmentState,
				isCheckingOut: action.payload,
			};
		}
		case APPOINTMENT_ACTION_TYPE.CLEARALL:
		default: return initialState;
	}
}

export const initialState: IAppointmentState = {
	isCheckingIn: false,
	isCheckingOut: false,
};
