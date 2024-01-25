import { createContext, useContext } from "react";

type routerContext = {
	nextPage: CallableFunction
	previousPage: CallableFunction
	homePage: CallableFunction
}

export const RouterContext = createContext<routerContext>({
	nextPage: () => null,
	previousPage: () => null,
	homePage: () => null,
});

export const useRouterContext = () => useContext(RouterContext);
