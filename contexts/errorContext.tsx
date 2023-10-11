import { createContext, useContext } from "react";

import { ERROR_CODE } from "../interfaces";

import { IErrorAction, IErrorState } from "../reducers/errorReducer";

type errorContext = {
	errorState: IErrorState
	dispatchErrorState: React.Dispatch<IErrorAction>
}

export const ErrorContext = createContext<errorContext>({
	errorState: {
		hasError: false,
		errorCode: ERROR_CODE.A200,
		message: "",
	},
	dispatchErrorState: () => null,
});

export const useErrorContext = () => useContext(ErrorContext);
