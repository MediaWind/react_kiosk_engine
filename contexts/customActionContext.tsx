import { SetStateAction, createContext, useContext } from "react";

type customActionContext = {
	triggerAction: CallableFunction
	customPage: JSX.Element | undefined
	setCustomPage: React.Dispatch<SetStateAction<JSX.Element | undefined>>
}

export const CustomActionContext = createContext<customActionContext>({
	triggerAction: () => null,
	customPage: undefined,
	setCustomPage: () => null,
});

export const useCustomActionContext = () => useContext(CustomActionContext);
