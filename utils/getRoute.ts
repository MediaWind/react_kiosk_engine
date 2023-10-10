import { FlowVariables } from "../variables";

import { Route } from "../interfaces";

export default async function getRoute() {

	const route = await import(`../../routes/${FlowVariables.W_ROUTE}`);

	return route.default as Route;
}
