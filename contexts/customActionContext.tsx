import { SetStateAction, createContext, useContext } from "react";

type customActionContext = {
	triggerCustomAction: CallableFunction
	customPage: JSX.Element | undefined
	setCustomPage: React.Dispatch<SetStateAction<JSX.Element | undefined>>
}

export const CustomActionContext = createContext<customActionContext>({
	triggerCustomAction: () => null,
	customPage: undefined,
	setCustomPage: () => null,
});

export const useCustomActionContext = () => useContext(CustomActionContext);
