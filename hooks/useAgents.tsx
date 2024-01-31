import { useState } from "react";

import { Variables } from "../../variables";

import { AgentData } from "../interfaces";

export default function useAgents(): [AgentData[], CallableFunction] {
	const [agents, setAgents] = useState<AgentData[]>([]);

	async function getUserAgents() {
		const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/listUserAgent.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

		try {
			const response = await fetch(url);
			const data = await response.json();
			// console.log("🚀 ~ getAgents ~ data:", data);

			if (data.status == 1) {
				setAgents(data.userAgent);
			}
		} catch (err) {
			console.log(err);
		}
	}

	return [agents, getUserAgents];
}
