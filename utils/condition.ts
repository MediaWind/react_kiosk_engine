
import { IAppointmentsState } from "../interfaces";


export function condition(appointmentsState: IAppointmentsState): any {
	function appointmentsLength() {
		return appointmentsState.appointments.length;
	}

	const runConditionFunction : { [key: string]: () => any } = {
		"appointmentsLength": appointmentsLength,
	};

	return runConditionFunction;
}

