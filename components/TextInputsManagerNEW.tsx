import { useEffect, useState } from "react";

import { IInputContent, TICKET_DATA_ACTION_TYPE } from "../interfaces";

import { useTicketDataContext } from "../contexts/ticketDataContext";

import { IKeyboard } from "../lib/keyboardTypes";

import TextInput from "./ui/inputs/TextInputNEW";
import Keyboard from "./ui/keyboard/Keyboard";

interface ITextInputsManagerProps {
	inputs: IInputContent[]
	keyboardConfig: IKeyboard
	invalidFields?: IInputContent[]
}

export default function TextInputsManager(props: ITextInputsManagerProps): JSX.Element {
	const { inputs, keyboardConfig, invalidFields, } = props;

	const [focusedField, setFocusedField] = useState<IInputContent | undefined>();
	const [currentValue, setCurrentValue] = useState<string>("");
	const [displayKeyboard, setDisplayKeyboard] = useState<boolean>(false);
	const [autoFocus, setAutofocus] = useState<boolean>(false);

	const { dispatchTicketState, } = useTicketDataContext();

	useEffect(() => {
		const autoFocusInput = inputs.find(input => input.autoFocus);

		if (autoFocusInput) {
			setAutofocus(true);
		}
	}, [inputs]);

	useEffect(() => {
		if (autoFocus) {
			setAutofocus(false);
			setFocusedField(inputs.find(input => input.autoFocus));
		}
	}, [autoFocus]);

	useEffect(() => {
		if (focusedField) {
			const currentInput = inputs.find(input => input === focusedField);

			if (currentInput?.textInput) {
				setCurrentValue(currentInput.textInput.value);
			}

			setDisplayKeyboard(true);
		} else {
			setCurrentValue("");
		}
	}, [focusedField, autoFocus]);

	useEffect(() => {
		if (!displayKeyboard) {
			setFocusedField(undefined);
		}
	}, [displayKeyboard]);

	function focusHandler(id: string) {
		setFocusedField(() => {
			return inputs.find(input => input.textInput?.id === id);
		});
	}

	function changeHandler(char: string) {
		const currentInput = inputs.find(input => input === focusedField);

		if (currentInput?.textInput) {
			currentInput.textInput.value = currentInput.textInput.value + char;
			setCurrentValue(currentInput.textInput.value);
		}

		dispatchTicketState({
			type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
			payload: currentInput?.textInput,
		});
	}

	function deleteHandler() {
		const currentInput = inputs.find(input => input === focusedField);

		if (currentInput?.textInput) {
			currentInput.textInput.value = currentInput.textInput.value.slice(0, -1);
			setCurrentValue(currentInput.textInput.value);
		}

		dispatchTicketState({
			type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
			payload: currentInput?.textInput,
		});
	}

	return (
		<>
			{inputs.map((input) => {
				if (!input.textInput) {
					return <></>;
				}

				return <TextInput
					key={input.textInput.id}
					id={input.textInput.id}
					value={input.textInput.value}
					focused={focusedField === input}
					onFocus={focusHandler}
					invalid={invalidFields ? invalidFields.includes(input) : false}
					styles={input.styles}
				/>;
			})}

			<Keyboard
				currentValue={currentValue}
				config={keyboardConfig}
				onChange={changeHandler}
				onDelete={deleteHandler}
				displayKeyboard={displayKeyboard}
				setDisplayKeyboard={setDisplayKeyboard}
			/>
		</>
	);
}