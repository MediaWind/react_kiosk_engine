import { useEffect, useState } from "react";

import { eIdStatus } from "../../core/hooks/useEId";

import { IInputAction, IInputContent, IInputField, TICKET_DATA_ACTION_TYPE } from "../interfaces";
import { IKeyboard } from "../lib/keyboardTypes";

import { useFlowContext } from "../contexts/flowContext";
import { useErrorContext } from "../contexts/errorContext";
import { useEIdContext } from "../contexts/eIdContext";
import { useTicketDataContext } from "../contexts/ticketDataContext";

import TextInput from "./ui/inputs/TextInput";
import Keyboard from "./ui/keyboard/Keyboard";

interface ITextInputsManagerProps {
	inputs: IInputContent[]
	keyboardConfig: IKeyboard
	onTriggerActions: CallableFunction
	invalidTextInputs: string[]
}

export default function TextInputsManager(props: ITextInputsManagerProps): JSX.Element {
	const { inputs, keyboardConfig, onTriggerActions, invalidTextInputs, } = props;

	const { flow, } = useFlowContext();
	const { errorState, } = useErrorContext();
	const { status, } = useEIdContext();
	const { ticketState, dispatchTicketState, } = useTicketDataContext();

	const [fields, setFields] = useState<IInputField[]>([]);
	const [focusedField, setFocusedField] = useState<string>("");
	const [invalidFields, setInvalidFields] = useState<string[]>([]);

	const [currentValue, setCurrentValue] = useState<string>("");
	const [showPreview, setShowPreview] = useState<boolean>(false);
	const [autoFocus, setAutoFocus] = useState<boolean>(false);

	const [displayKeyboard, setDisplayKeyboard] = useState<boolean>(false);
	const [forceHide, setForceHide] = useState<boolean>(false);

	const [forceLowerCase, setForceLowerCase] = useState<boolean>(false);
	const [forceUpperCase, setForceUpperCase] = useState<boolean>(false);

	useEffect(() => {
		if (errorState.hasError || status !== eIdStatus.REMOVED) {
			setDisplayKeyboard(false);
			setForceHide(true);
		} else {
			setForceHide(false);
		}
	}, [errorState.hasError, status]);

	useEffect(() => {
		if (ticketState.eIdDatas) {
			const firstnameId = flow.ticketParameters?.firstname;
			const lastnameId = flow.ticketParameters?.lastname;
			const nationalNumberId = flow.ticketParameters?.nationalNumber;

			if (firstnameId) {
				dispatchTicketState({
					type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
					payload: {
						id: firstnameId,
						value: ticketState.eIdDatas.firstName,
					},
				});
			}

			if (lastnameId) {
				dispatchTicketState({
					type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
					payload: {
						id: lastnameId,
						value: ticketState.eIdDatas.lastName,
					},
				});
			}

			if (nationalNumberId) {
				dispatchTicketState({
					type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
					payload: {
						id: nationalNumberId,
						value: ticketState.eIdDatas.nationalNumber,
					},
				});
			}
		}
	}, [ticketState.eIdDatas]);

	useEffect(() => {
		setFields(() => {
			const returnArray: IInputField[] = [];
			inputs.forEach(input => {
				if (input.textInputConfig) {
					returnArray.push({
						id: input.textInputConfig.textInput.id,
						value: input.textInputConfig.textInput.value,
						required: input.textInputConfig.textInput.required,
					});
				}
			});
			return [...returnArray];
		});

		if (ticketState.textInputDatas.length > 0) {
			setFields(latest => {
				latest.forEach(field => {
					ticketState.textInputDatas.forEach(input => {
						if (field.id === input.id) {
							field.value = input.value;
						}
					});
				});
				return [...latest];
			});
		}
	}, [inputs, ticketState.textInputDatas]);

	useEffect(() => {
		const autoFocusOn = inputs.find(input => input.textInputConfig?.autoFocus);

		if (autoFocusOn && autoFocusOn.textInputConfig?.textInput) {
			setAutoFocus(true);
		} else {
			setAutoFocus(false);
		}
	}, [inputs]);

	useEffect(() => {
		setFocusedField(() => {
			const focusInput = inputs.find(input => input.textInputConfig?.autoFocus);
			return focusInput?.textInputConfig?.textInput.id ?? "";
		});
	}, [autoFocus]);

	useEffect(() => {
		if (focusedField !== "") {
			setDisplayKeyboard(true);

			const matchingField = fields.find(field => field.id === focusedField);

			if (matchingField) {
				setCurrentValue(matchingField.value);
			}
		} else {
			setDisplayKeyboard(false);
			setCurrentValue("");
		}
	}, [focusedField]);

	useEffect(() => {
		const match = inputs.find(input => input.textInputConfig?.textInput.id === focusedField);

		if (match && match.textInputConfig?.textPreview) {
			setShowPreview(true);
		} else {
			setShowPreview(false);
		}
	}, [focusedField]);

	useEffect(() => {
		const match = inputs.find(input => input.textInputConfig?.textInput.id === focusedField);

		if (match) {
			if (match.textInputConfig?.forceLowerCase) {
				setForceLowerCase(true);
				setForceUpperCase(false);
				return;
			} else if (match.textInputConfig?.forceUpperCase) {
				setForceUpperCase(true);
				setForceLowerCase(false);
				return;
			}
		}

		setForceUpperCase(false);
		setForceLowerCase(false);
	}, [focusedField]);

	useEffect(() => {
		if (invalidFields.length > 0 && currentValue.trim() !== "") {
			setInvalidFields(latest => {
				const filtered = latest.filter(field => field !== focusedField);
				return [...filtered];
			});
		}
	}, [currentValue]);

	useEffect(() => {
		if (!displayKeyboard) {
			setFocusedField("");
		}
	}, [displayKeyboard]);

	useEffect(() => {
		if (invalidTextInputs.length > 0) {
			setInvalidFields(invalidTextInputs);

			const firstInvalidInput = fields.find(input => invalidTextInputs.includes(input.id));

			if (firstInvalidInput) {
				setFocusedField(firstInvalidInput.id);
				setDisplayKeyboard(true);
			}
		}
	}, [invalidTextInputs]);

	function focusHandler(id: string) {
		setFocusedField(id);
	}

	function changeHandler(char: string) {
		const matchingField = fields.find(field => field.id === focusedField);

		if (matchingField) {
			matchingField.value = matchingField.value + char;
			setCurrentValue(matchingField.value);

			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
				payload: {
					id: matchingField.id,
					value: matchingField.value,
					required: matchingField.required,
				},
			});
		}
	}

	function deleteHandler() {
		const matchingField = fields.find(field => field.id === focusedField);

		if (matchingField) {
			matchingField.value = matchingField.value.slice(0, -1);
			setCurrentValue(matchingField.value);

			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
				payload: {
					id: matchingField.id,
					value: matchingField.value,
					required: matchingField.required,
				},
			});
		}
	}

	function triggerActionsHandler(actions: IInputAction[]) {
		onTriggerActions(actions);
	}

	return (
		<>
			{fields.map((field, i) => {
				return <TextInput
					key={field.id}
					id={field.id}
					value={field.value}
					focused={focusedField === field.id}
					onFocus={focusHandler}
					invalid={invalidFields.includes(field.id)}
					styles={inputs[i].styles}
					placeholder={inputs[i].textInputConfig?.placeholder}
				/>;
			})}

			{!forceHide && <Keyboard
				currentValue={currentValue}
				config={keyboardConfig}
				onChange={changeHandler}
				onDelete={deleteHandler}
				onTriggerActionsOverride={triggerActionsHandler}
				displayKeyboard={displayKeyboard}
				setDisplayKeyboard={setDisplayKeyboard}
				enableTextPreview={showPreview}
				forceLowerCase={forceLowerCase}
				forceUpperCase={forceUpperCase}
			/>}
		</>
	);
}
