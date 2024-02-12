import { useState } from "react";

import { Variables } from "../../variables";

import { AgentData } from "../interfaces";

export default function useAgents(): [AgentData[], CallableFunction] {
	const [agents, setAgents] = useState<AgentData[]>([]);

	async function getUserAgents(filterIds?: string[]) {
		//TODO: filter unavailable agents? don't know if that's available in the module yet
		const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/listUserAgent.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

		try {
			const response = await fetch(url);
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
			}
		} catch (err) {
			console.log(err);
		}
	}

	return [agents, getUserAgents];
}
