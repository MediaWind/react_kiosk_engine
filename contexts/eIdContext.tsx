import { createContext, useContext } from "react";

import { eIdStatus } from "../../core/hooks/useEId";

type eIdContext = {
	status: eIdStatus
}

export const EIdContext = createContext<eIdContext>({
	status: eIdStatus.REMOVED,
});

export const useEIdContext = () => useContext(EIdContext);
