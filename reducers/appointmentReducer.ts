import { APPOINTMENT_ACTION_TYPE, IAppointmentAction, IAppointmentState } from "../interfaces";

export default function appointmentReducer(appointmentState: IAppointmentState, action: IAppointmentAction): IAppointmentState {
	if (!action.payload) {
		return initialAppointmentState;
	}

	switch (action.type) {
		case APPOINTMENT_ACTION_TYPE.UPDATECHECKINGIN: {
			return {
				...appointmentState,
				isCheckingIn: action.payload,
			};
		}
		case APPOINTMENT_ACTION_TYPE.UPDATECHECKINGOUT: {
			return {
				...appointmentState,
				isCheckingOut: action.payload,
			};
		}
		case APPOINTMENT_ACTION_TYPE.UPDATECHECKEDIN: {
			return {
				...appointmentState,
				isCheckedIn: action.payload,
			};
		}
		case APPOINTMENT_ACTION_TYPE.UPDATECHECKEDOUT: {
			return {
				...appointmentState,
				isCheckedOut: action.payload,
			};
		}
		case APPOINTMENT_ACTION_TYPE.CLEARALL:
		default: return initialAppointmentState;
	}
}

export const initialAppointmentState: IAppointmentState = {
	isCheckingIn: false,
	isCheckingOut: false,
	isCheckedIn: false,
	isCheckedOut: false,
};
