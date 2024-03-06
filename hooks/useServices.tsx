import { useState } from "react";

import { Variables } from "../../variables";

import { ERROR_ACTION_TYPE, IErrorAction, ServiceData } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import { Console } from "../utils/console";

export default function useServices(dispatchErrorState: React.Dispatch<IErrorAction>): [ServiceData[], CallableFunction] {
	const [services, setServices] = useState<ServiceData[]>([]);

	async function getServices(filterClosed?: boolean, filterIds?: string[]) {
		Console.info("Fetching services...");
		const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.array_services) {
				setServices(() => {
					let returnedServices = data.array_services;

					if (filterClosed) {
						returnedServices = returnedServices.filter((service: ServiceData) => service.service_is_open);
					}

					if (filterIds) {
						returnedServices = returnedServices.filter((service: ServiceData) => filterIds.includes(service.id));
					}

					return returnedServices;
				});
			} else {
				Console.error("Error when trying to fetch services: data.array_services is undefined, check project id.", { fileName: "useServices", functionName: "getServices", lineNumber: 36, });
				dispatchErrorState({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.E500,
						message: "Services array is undefined",
					},
				});
			}
		} catch (e) {
			Console.error("Error when trying to fetch services: error caught.", { fileName: "useServices", functionName: "getServices", lineNumber: 47, });
			Console.error(e);
			dispatchErrorState({
				type: ERROR_ACTION_TYPE.SETERROR,
				payload: {
					hasError: true,
					errorCode: ERROR_CODE.D500,
					message: "Error caught - Unable to fetch services",
				},
			});
		}
	}

	return [services, getServices];
}
