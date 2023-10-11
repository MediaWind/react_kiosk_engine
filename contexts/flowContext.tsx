import { createContext, useContext } from "react";

import { IFlow } from "../interfaces";

type flowContext = {
	flow: IFlow,
	setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export const FlowContext = createContext<flowContext>({
	flow: {
		id: "",
		name: "",
		homePage: "",
		pages: [],
	},
	setReload: () => false,
});

export const useFlowContext = () => useContext(FlowContext);
