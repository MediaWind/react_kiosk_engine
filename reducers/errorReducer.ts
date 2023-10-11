import { ERROR_CODE } from "../interfaces";

export interface IErrorState {
	hasError: boolean;
	errorCode: ERROR_CODE;
	message: string;
}

export interface IErrorAction {
	type: ERROR_ACTION_TYPE;
	payload: IErrorState | undefined;
}

export enum ERROR_ACTION_TYPE {
	SETERROR = "setError",
	CLEARERROR = "clearError"
}

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
