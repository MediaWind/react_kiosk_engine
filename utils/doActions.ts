import { SetStateAction } from "react";
import { Variables } from "../../variables";

import {
	ACTION_TYPE,
	APPOINTMENT_ACTION_TYPE,
	IAppointmentAction,
	IInputAction,
	IPrintAction,
	IService,
	ITicketDataAction,
	PRINT_ACTION_TYPE,
	TICKET_DATA_ACTION_TYPE,
	APPOINTMENTS_ACTION_TYPE,
	IAppointmentsAction
} from "../interfaces";

interface IDispatchers {
	router: {
		nextPage: CallableFunction
		previousPage: CallableFunction
		homePage: CallableFunction
	},
	dispatchPrintState: React.Dispatch<IPrintAction>
	dispatchTicketState: React.Dispatch<ITicketDataAction>
	setLanguage: React.Dispatch<SetStateAction<string>>
	dispatchAppointmentState: React.Dispatch<IAppointmentAction>
	triggerCustomAction: CallableFunction
	setCustomPage: React.Dispatch<SetStateAction<JSX.Element | undefined>>
	triggerActions: CallableFunction
	triggerConditions: CallableFunction
	dispatchAppointmentsState: React.Dispatch<IAppointmentsAction>
}

export default function doActions(actions: IInputAction[], dispatchers: IDispatchers) {
	const conditionsFunc: { [key: string]: CallableFunction } = dispatchers.triggerConditions();

	for (const action of actions) {
		doAction(action);
	}

	async function doAction(action: IInputAction) {
		switch (action.type) {
			case ACTION_TYPE.NEXTPAGE:
				dispatchers.router.nextPage(action.navigateTo);
				break;
			case ACTION_TYPE.CONDITION:
				conditionHandler(action.onSuccess, action.onFailure, action.conditions);
				break;
			case ACTION_TYPE.PREVIOUSPAGE:
				dispatchers.router.previousPage();
				break;
			case ACTION_TYPE.HOMEPAGE:
				dispatchers.router.homePage();
				break;
			case ACTION_TYPE.SAVESERVICE: {
				let serviceId = action.service?.serviceId?.toString();
				let devServiceId = action.service?.devServiceId?.toString();

				// Check if the serviceId is a dynamic variable and replace it with the actual value
				const regex = /^\{.*\}$/;
				if(serviceId && regex.test(serviceId)) {
					serviceId = serviceId.replace(/^\{(.*)\}$/, (_, key) => {
						return Variables[key as keyof typeof Variables] as string;
					});
				}

				if(devServiceId && regex.test(devServiceId)) {
					devServiceId = devServiceId.replace(/^\{(.*)\}$/, (_, key) => {
						return Variables[key as keyof typeof Variables] as string;
					});
				}

				action.service = {
					...action.service,
					serviceId: serviceId ? parseInt(serviceId) : undefined,
					devServiceId: devServiceId ? parseInt(devServiceId) : undefined,
				};

				dispatchers.dispatchTicketState({
					type: TICKET_DATA_ACTION_TYPE.SERVICEUPDATE,
					payload: action.service as IService,
				});
				break;
			}
			case ACTION_TYPE.CREATETICKET:
				dispatchers.dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTTICKETCREATION, payload: true, });
				break;
			case ACTION_TYPE.PRINTTICKET:
				dispatchers.dispatchPrintState({ type: PRINT_ACTION_TYPE.REQUESTPRINT, payload: true, });
				break;
			case ACTION_TYPE.CHANGELANGUAGE:
				dispatchers.setLanguage(latest => action.language ?? latest);
				break;
			case ACTION_TYPE.CHECKIN:
				dispatchers.dispatchAppointmentState({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGIN,
					payload: true,
				});
				break;
			case ACTION_TYPE.GETAPPOINTMENTS:
				dispatchers.dispatchAppointmentsState({
					type: APPOINTMENTS_ACTION_TYPE.GETAPPOINTMENTS,
					payload: { status: true, params: action.params, },
				});
				break;
			case ACTION_TYPE.CHECKOUT:
				dispatchers.dispatchAppointmentState({
					type: APPOINTMENT_ACTION_TYPE.UPDATECHECKINGOUT,
					payload: true,
				});
				break;
			case ACTION_TYPE.CUSTOM:
				dispatchers.triggerCustomAction(action.id);
				break;
			case ACTION_TYPE.RESETCUSTOMPAGE:
				dispatchers.setCustomPage(undefined);
				break;
			default:
				break;
		}
	}

	type ConditionOperator = "&&" | "||" | "==" | "!=" | ">" | "<" | ">=" | "<=";
	type ConditionValue = string | number | boolean;

	interface Condition {
		[key: string]: ConditionValue[] | Condition[];
	}

	async function evaluateCondition(condition: Condition): Promise<boolean> {
		if (typeof condition === "boolean") {
			return condition;
		}

		const operator = Object.keys(condition)[0] as ConditionOperator;
		const operands = condition[operator];

		if (operator === "&&") {
			return (operands as Condition[]).every((operand: Condition) => evaluateCondition(operand));
		}

		if (operator === "||") {
			return (operands as Condition[]).some((operand: Condition) => evaluateCondition(operand));
		}

		const operand0 = (operands as ConditionValue[])[0];
		const operand1 = (operands as ConditionValue[])[1];
		const value0 = typeof operand0 === "string" && conditionsFunc[operand0] ? await conditionsFunc[operand0]() : operand0;
		const value1 = typeof operand1 === "string" && conditionsFunc[operand1] ? await conditionsFunc[operand1]() : operand1;

		switch (operator) {
			case "==":
				return value0 === value1;
			case "!=":
				return value0 !== value1;
			case ">":
				return value0 > value1;
			case "<":
				return value0 < value1;
			case ">=":
				return value0 >= value1;
			case "<=":
				return value0 <= value1;
			default:
				return false;
		}
	}

	async function conditionHandler(onSuccess?: IInputAction[], onFailure?: IInputAction[], conditions?: Condition) {
		if (conditions) {
			const result = await evaluateCondition(conditions);

			if (result && onSuccess) {
				dispatchers.triggerActions(onSuccess);
			}

			if (!result && onFailure) {
				dispatchers.triggerActions(onFailure);
			}
		} else {
			if (onFailure) {
				dispatchers.triggerActions(onFailure);
			}
		}
	}
}
