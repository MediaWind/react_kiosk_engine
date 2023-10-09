import { DefaultVariables } from "../core/variables";

export class FlowVariables extends DefaultVariables {
	static W_ROUTE = (process.env.NODE_ENV === "production" ? "{w_route}" : "route_31.json") as string;
}
