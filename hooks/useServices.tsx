import { useState } from "react";

import { Variables } from "../../variables";

import { ServiceData } from "../interfaces";

export default function useServices(): [ServiceData[], CallableFunction] {
	const [services, setServices] = useState<ServiceData[]>([]);

	async function getServices() {
		const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.array_services) {
				setServices(data.array_services);
			}
		} catch (e) {
			console.log(e);
		}
	}

	return [services, getServices];
}
