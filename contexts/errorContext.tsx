import { createContext, useContext } from "react";

import { IErrorAction, IErrorState } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

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
