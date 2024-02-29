import { ERROR_ACTION_TYPE, IErrorAction, IErrorState } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

export default function errorReducer(errorState: IErrorState, action: IErrorAction): IErrorState {
	if (action.type === ERROR_ACTION_TYPE.SETERROR) {
		const error = action.payload as IErrorState;
		return {
			...errorState,
			hasError: error.hasError,
			errorCode: error.errorCode,
			message: error.message ?? "",
			errorServiceId: error.errorServiceId ?? undefined,
		};
	}

	return initialErrorState;
}

export const initialErrorState: IErrorState = {
	hasError: false,
	errorCode: ERROR_CODE.A200,
	message: "",
};
