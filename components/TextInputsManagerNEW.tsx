import { useEffect, useState } from "react";

import { IInputContent } from "../interfaces";
import TextInput from "./ui/inputs/TextInputNEW";
import Keyboard from "./ui/keyboard/Keyboard";
import { IKeyboard, KEYBOARD_LAYOUT } from "../lib/keyboardTypes";

interface ITextInputsManagerProps {
	inputs: IInputContent[]
	keyboardConfig?: IKeyboard
}

export default function TextInputsManager(props: ITextInputsManagerProps): JSX.Element {
	const { inputs, } = props;

	const [focusedField, setFocusedField] = useState<IInputContent | undefined>();
	const [currentValue, setCurrentValue] = useState<string>("");
	const [displayKeyboard, setDisplayKeyboard] = useState<boolean>(false);

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
	}, [focusedField]);

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
	}

	function deleteHandler() {
		const currentInput = inputs.find(input => input === focusedField);

		if (currentInput?.textInput) {
			currentInput.textInput.value = currentInput.textInput.value.slice(0, -1);
			setCurrentValue(currentInput.textInput.value);
		}
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
					focused={focusedField?.textInput?.id === input.textInput.id}
					value={input.textInput.value}
					onFocus={focusHandler}
					styles={input.styles}
				/>;
			})}

			<Keyboard
				currentValue={currentValue}
				config={{
					layout: KEYBOARD_LAYOUT.CLASSIC,
				}}
				onChange={changeHandler}
				onDelete={deleteHandler}
				displayKeyboard={displayKeyboard}
				setDisplayKeyboard={setDisplayKeyboard}
			/>
		</>
	);
}
