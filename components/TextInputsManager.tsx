import { useEffect, useState } from "react";

import { IInputAction, IInputContent, IInputField, TICKET_DATA_ACTION_TYPE } from "../interfaces";
import { IKeyboard } from "../lib/keyboardTypes";

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

	const [fields, setFields] = useState<IInputField[]>([]);
	const [focusedField, setFocusedField] = useState<string>("");
	const [invalidFields, setInvalidFields] = useState<string[]>([]);
	const [currentValue, setCurrentValue] = useState<string>("");

	const [displayKeyboard, setDisplayKeyboard] = useState<boolean>(false);

	const { ticketState, dispatchTicketState, } = useTicketDataContext();

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
		console.log("🚀 ~ TextInputsManager ~ inputs:", inputs);
	}, [inputs]);

	useEffect(() => {
		const autoFocusOn = inputs.find(input => input.textInputConfig?.autoFocus);

		if (autoFocusOn && autoFocusOn.textInputConfig?.textInput) {
			setFocusedField(autoFocusOn.textInputConfig.textInput.id);
		}
	}, [inputs]);

	useEffect(() => {
		if (focusedField) {
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
			setCurrentValue(matchingField.value + char);

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

			<Keyboard
				currentValue={currentValue}
				config={keyboardConfig}
				onChange={changeHandler}
				onDelete={deleteHandler}
				onTriggerActionsOverride={triggerActionsHandler}
				displayKeyboard={displayKeyboard}
				setDisplayKeyboard={setDisplayKeyboard}
			/>
		</>
	);
}
