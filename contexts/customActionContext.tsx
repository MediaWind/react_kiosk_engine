import { createContext, useContext } from "react";

type customActionContext = {
	triggerAction: CallableFunction
}

export const CustomActionContext = createContext<customActionContext>({
	triggerAction: () => null,
});

export const useCustomActionContext = () => useContext(CustomActionContext);
