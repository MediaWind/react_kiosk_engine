import { ERROR_ACTION_TYPE, ERROR_CODE, IErrorAction, IErrorState } from "../interfaces";

export default function errorReducer(errorState: IErrorState, action: IErrorAction): IErrorState {
	if (action.type === ERROR_ACTION_TYPE.SETERROR) {
		const error = action.payload as IErrorState;
		return {
			...errorState,
			hasError: error.hasError,
			errorCode: error.errorCode,
			message: error.message ?? "",
		};
	}

	return initialErrorState;
}

export const initialErrorState: IErrorState = {
	hasError: false,
	errorCode: ERROR_CODE.A200,
	message: "",
};
