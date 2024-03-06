import { useState } from "react";

import { Variables } from "../../variables";

import { ERROR_ACTION_TYPE, IErrorAction, ServiceData } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

import { Console } from "../utils/console";
import fetchRetry from "../utils/fetchRetry";

export default function useServices(dispatchErrorState: React.Dispatch<IErrorAction>): [ServiceData[], CallableFunction] {
	const [services, setServices] = useState<ServiceData[]>([]);

	async function getServices(filterClosed?: boolean, filterIds?: string[]) {
		Console.info("Fetching services...");
		const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

		try {
			const response = await fetchRetry(url);
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
				Console.error("Error when trying to fetch services: data.array_services is undefined, check project id.", { fileName: "useServices", functionName: "getServices", lineNumber: 37, });
				dispatchErrorState({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.E500,
						message: "Services array is undefined",
					},
				});
			}
		} catch (err) {
			Console.error("Error when trying to fetch services: error caught.", { fileName: "useServices", functionName: "getServices", lineNumber: 48, });
			Console.error(err);
			if (err instanceof Error) {
				if (err.message.split("-")[0].trim() === "fetchRetry") {
					dispatchErrorState({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.A429,
							message: "Too many retries",
						},
					});
				} else {
					dispatchErrorState({
						type: ERROR_ACTION_TYPE.SETERROR,
						payload: {
							hasError: true,
							errorCode: ERROR_CODE.B500,
							message: "Error caught - " + err.message,
						},
					});
				}
			} else {
				dispatchErrorState({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.B500,
						message: "Error caught - Unable to create ticket",
					},
				});
			}
		}
	}

	return [services, getServices];
}
