import { eIdData } from "../../core/hooks/useEId";
import { IInputField } from "../interfaces";

interface IUserInputsState {
	textInputsData: {
		ticketParams: {
			firstname: string;
			lastname: string;
			nationalNumber: string;
			email: string;
			phone: string;
			company: string;
			comment: string;
			idUserAgent: string;
		}
		custom?: IInputField[]
	};
	scannerData: {
		qrCode: string;
	}
	eIdData?: eIdData
}

export interface IUserInputsAction {
	type: USER_INPUTS_ACTION_TYPE;
	payload?: any;
}

export enum USER_INPUTS_ACTION_TYPE {
	UPDATE_EID_DATA,
	UPDATE_QR_CODE,
	UPDATE_FIRSTNAME_TEXT_INPUT,
	UPDATE_LASTNAME_TEXT_INPUT,
	UPDATE_NATIONAL_NUMBER_TEXT_INPUT,
	UPDATE_EMAIL_TEXT_INPUT,
	UPDATE_PHONE_TEXT_INPUT,
	UPDATE_COMPANY_TEXT_INPUT,
	UPDATE_COMMENT_TEXT_INPUT,
	UPDATE_ID_USER_AGENT_TEXT_INPUT,
	UPDATE_CUSTOM_TEXT_INPUTS,
	UPDATE_TEXT_INPUTS,
	CLEAR_ALL,
}

export const initialUserInputsState: IUserInputsState = {
	textInputsData: {
		ticketParams: {
			firstname: "",
			lastname: "",
			nationalNumber: "",
			email: "",
			phone: "",
			company: "",
			comment: "",
			idUserAgent: "",
		},
	},
	scannerData: { qrCode: "", },
};

export default function userInputsReducer(userInputsState: IUserInputsState, action: IUserInputsAction): IUserInputsState {
	switch (action.type) {
		case USER_INPUTS_ACTION_TYPE.UPDATE_EID_DATA: {
			return {
				...userInputsState,
				eIdData: action.payload as eIdData,
			};
		}

		case USER_INPUTS_ACTION_TYPE.UPDATE_QR_CODE: {
			return {
				...userInputsState,
				scannerData: {
					qrCode: action.payload ?? "",
				},
			};
		}

		case USER_INPUTS_ACTION_TYPE.UPDATE_FIRSTNAME_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						firstname: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_LASTNAME_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						lastname: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_NATIONAL_NUMBER_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						nationalNumber: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_EMAIL_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						email: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_PHONE_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						phone: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_COMPANY_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						company: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_COMMENT_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						comment: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_ID_USER_AGENT_TEXT_INPUT: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					ticketParams: {
						...userInputsState.textInputsData.ticketParams,
						idUserAgent: action.payload ?? "",
					},
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_CUSTOM_TEXT_INPUTS: {
			return {
				...userInputsState,
				textInputsData: {
					...userInputsState.textInputsData,
					custom: action.payload ?? [],
				},
			};
		}
		case USER_INPUTS_ACTION_TYPE.UPDATE_TEXT_INPUTS: {
			return {
				...userInputsState,
				textInputsData: action.payload,
			};
		}

		case USER_INPUTS_ACTION_TYPE.CLEAR_ALL:
		default: return initialUserInputsState;
	}
}
