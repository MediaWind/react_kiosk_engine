import { createContext, useContext } from "react";

type ConditionsContext = {
	triggerConditions: CallableFunction
}

export const ConditionsContext = createContext<ConditionsContext>({
	triggerConditions: () => null,
});

export const useConditionsContext = () => useContext(ConditionsContext);
