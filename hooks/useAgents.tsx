import { useState } from "react";

import { Variables } from "../../variables";

import { AgentData, ERROR_ACTION_TYPE, IErrorAction } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import fetchRetry from "../utils/fetchRetry";

export default function useAgents(dispatchErrorState: React.Dispatch<IErrorAction>): [AgentData[], CallableFunction] {
	const [agents, setAgents] = useState<AgentData[]>([]);

	async function getUserAgents(filterIds?: string[]) {
		//TODO: filter unavailable agents? don't know if that's available in the module yet
		const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/listUserAgent.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

		try {
			const response = await fetchRetry(url);
			const data = await response.json();

			if (data.status == 1) {
				const sorted = data.userAgent.sort((agent1: AgentData, agent2: AgentData) => {
					if (agent1.name.lastname > agent2.name.lastname) {
						return 1;
					}

					if (agent1.name.lastname < agent2.name.lastname) {
						return -1;
					}

					return 0;
				});

				setAgents(() => {
					let returnedAgents = sorted;

					if (filterIds) {
						returnedAgents = returnedAgents.filter((agent: AgentData) => filterIds.includes(agent.id_user));
					}

					return returnedAgents;
				});
			} else {
				dispatchErrorState({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.D500,
						message: "Unable to fetch user agents (Status 0)",
					},
				});
			}
		} catch (err) {
			console.log(err);
			dispatchErrorState({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.D500,
					message: "Error caught - Unable to fetch user agents",
				},
			});
		}
	}

	return [agents, getUserAgents];
}
