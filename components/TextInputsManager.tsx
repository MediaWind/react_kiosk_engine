import { useEffect, useState } from "react";

import { IInputContent, IInputField, IMedia, KEYBOARD_LAYOUT, TICKET_DATA_ACTION_TYPE } from "../interfaces";

import { useTicketDataContext } from "../contexts/ticketDataContext";

import TextInput from "./ui/inputs/TextInput";
import CustomKeyboard, { IKeyboard, KEY_ACTION } from "./ui/keyboard/CustomKeyboard";
import { useFlowContext } from "../contexts/flowContext";

interface ITextInputsManagerProps {
	inputs: IMedia[]
	onReady: CallableFunction
}

export default function TextInputsManager(props: ITextInputsManagerProps): JSX.Element {
	const { inputs, onReady, } = props;
	const { flow, } = useFlowContext();

	const [content, setContent] = useState<IInputContent[]>([]);
	const [focusedField, setFocusedField] = useState<string | undefined>();
	const [fields, setFields] = useState<IInputField[]>([]);
	const [invalidFields, setInvalidFields] = useState<string[]>([]);

	const { dispatchTicketState, } = useTicketDataContext();

	const customPattern = {
		rows: [
			{
				keys: [
					{
						text: {
							defaultValue: "0",
							specCharsValue: "-",
						},
					},
					{
						text: {
							defaultValue: "1",
							specCharsValue: "à",
						},
					},
					{
						text: {
							defaultValue: "2",
							specCharsValue: "â",
						},
					},
					{
						text: {
							defaultValue: "3",
							specCharsValue: "ç",
						},
					},
					{
						text: {
							defaultValue: "4",
							specCharsValue: "é",
						},
					},
					{
						text: {
							defaultValue: "5",
							specCharsValue: "è",
						},
					},
					{
						text: {
							defaultValue: "6",
							specCharsValue: "ê",
						},
					},
					{
						text: {
							defaultValue: "7",
							specCharsValue: "ë",
						},
					},
					{
						text: {
							defaultValue: "8",
							specCharsValue: "ù",
						},
					},
					{
						text: {
							defaultValue: "9",
							specCharsValue: "û",
						},
					}
				],
			},
			{
				keys: [
					{
						text: {
							defaultValue: "a",
							capslockValue: "A",
						},
					},
					{
						text: {
							defaultValue: "z",
							capslockValue: "Z",
						},
					},
					{
						text: {
							defaultValue: "e",
							capslockValue: "E",
						},
					},
					{
						text: {
							defaultValue: "r",
							capslockValue: "R",
						},
					},
					{
						text: {
							defaultValue: "t",
							capslockValue: "T",
						},
					},
					{
						text: {
							defaultValue: "y",
							capslockValue: "Y",
						},
					},
					{
						text: {
							defaultValue: "u",
							capslockValue: "U",
						},
					},
					{
						text: {
							defaultValue: "i",
							capslockValue: "I",
						},
					},
					{
						text: {
							defaultValue: "o",
							capslockValue: "O",
						},
					},
					{
						text: {
							defaultValue: "p",
							capslockValue: "P",
						},
					},
					{
						text: {
							defaultValue: "q",
							capslockValue: "Q",
						},
					},
					{
						text: {
							defaultValue: "s",
							capslockValue: "S",
						},
					},
					{
						text: {
							defaultValue: "d",
							capslockValue: "D",
						},
					}
				],
			},
			{
				keys: [
					{
						text: {
							defaultValue: "f",
							capslockValue: "F",
						},
					},
					{
						text: {
							defaultValue: "g",
							capslockValue: "G",
						},
					},
					{
						text: {
							defaultValue: "h",
							capslockValue: "H",
						},
					},
					{
						text: {
							defaultValue: "j",
							capslockValue: "J",
						},
					},
					{
						text: {
							defaultValue: "k",
							capslockValue: "K",
						},
					},
					{
						text: {
							defaultValue: "l",
							capslockValue: "L",
						},
					},
					{
						text: {
							defaultValue: "m",
							capslockValue: "M",
						},
					},
					{
						text: {
							defaultValue: "w",
							capslockValue: "W",
						},
					},
					{
						text: {
							defaultValue: "x",
							capslockValue: "X",
						},
					},
					{
						text: {
							defaultValue: "c",
							capslockValue: "C",
						},
					},
					{
						text: {
							defaultValue: "v",
							capslockValue: "V",
						},
					},
					{
						text: {
							defaultValue: "b",
							capslockValue: "B",
						},
					},
					{
						text: {
							defaultValue: "n",
							capslockValue: "N",
						},
					}
				],
			},
			{
				keys: [
					{
						action: KEY_ACTION.SHIFT,
					},
					{
						text: {
							defaultValue: "-^´",
						},
						action: KEY_ACTION.SPECIALCHARS,
					},
					{
						text: {
							defaultValue: "Espace",
						},
						action: KEY_ACTION.SPACEBAR,
					},
					{
						text: {
							defaultValue: "Valider",
						},
						action: confirmForm,
						style: {
							backgroundColor: "#117a31",
							textColor: "#ffffff",
							fontSize: "0.032rem",
							textAlign: "center",
						},
					},
					{
						action: KEY_ACTION.BACKSPACE,
					}
				],
			}
		],
	} as IKeyboard;

	const classicPattern = {
		rows: [
			{
				keys: [
					{
						text: {
							defaultValue: "0",
							specCharsValue: "-",
						},
					},
					{
						text: {
							defaultValue: "1",
							specCharsValue: "à",
						},
					},
					{
						text: {
							defaultValue: "2",
							specCharsValue: "â",
						},
					},
					{
						text: {
							defaultValue: "3",
							specCharsValue: "ç",
						},
					},
					{
						text: {
							defaultValue: "4",
							specCharsValue: "é",
						},
					},
					{
						text: {
							defaultValue: "5",
							specCharsValue: "è",
						},
					},
					{
						text: {
							defaultValue: "6",
							specCharsValue: "ê",
						},
					},
					{
						text: {
							defaultValue: "7",
							specCharsValue: "ë",
						},
					},
					{
						text: {
							defaultValue: "8",
							specCharsValue: "ù",
						},
					},
					{
						text: {
							defaultValue: "9",
							specCharsValue: "û",
						},
					}
				],
			},
			{
				keys: [
					{
						text: {
							defaultValue: "a",
							capslockValue: "A",
						},
					},
					{
						text: {
							defaultValue: "z",
							capslockValue: "Z",
						},
					},
					{
						text: {
							defaultValue: "e",
							capslockValue: "E",
						},
					},
					{
						text: {
							defaultValue: "r",
							capslockValue: "R",
						},
					},
					{
						text: {
							defaultValue: "t",
							capslockValue: "T",
						},
					},
					{
						text: {
							defaultValue: "y",
							capslockValue: "Y",
						},
					},
					{
						text: {
							defaultValue: "u",
							capslockValue: "U",
						},
					},
					{
						text: {
							defaultValue: "i",
							capslockValue: "I",
						},
					},
					{
						text: {
							defaultValue: "o",
							capslockValue: "O",
						},
					},
					{
						text: {
							defaultValue: "p",
							capslockValue: "P",
						},
					}
				],
			},
			{
				keys: [
					{
						text: {
							defaultValue: "q",
							capslockValue: "Q",
						},
					},
					{
						text: {
							defaultValue: "s",
							capslockValue: "S",
						},
					},
					{
						text: {
							defaultValue: "d",
							capslockValue: "D",
						},
					},
					{
						text: {
							defaultValue: "f",
							capslockValue: "F",
						},
					},
					{
						text: {
							defaultValue: "g",
							capslockValue: "G",
						},
					},
					{
						text: {
							defaultValue: "h",
							capslockValue: "H",
						},
					},
					{
						text: {
							defaultValue: "j",
							capslockValue: "J",
						},
					},
					{
						text: {
							defaultValue: "k",
							capslockValue: "K",
						},
					},
					{
						text: {
							defaultValue: "l",
							capslockValue: "L",
						},
					},
					{
						text: {
							defaultValue: "m",
							capslockValue: "M",
						},
					}
				],
			},
			{
				keys: [
					{
						text: {
							defaultValue: "w",
							capslockValue: "W",
						},
					},
					{
						text: {
							defaultValue: "x",
							capslockValue: "X",
						},
					},
					{
						text: {
							defaultValue: "c",
							capslockValue: "C",
						},
					},
					{
						text: {
							defaultValue: "v",
							capslockValue: "V",
						},
					},
					{
						text: {
							defaultValue: "b",
							capslockValue: "B",
						},
					},
					{
						text: {
							defaultValue: "n",
							capslockValue: "N",
						},
					}
				],
			},
			{
				keys: [
					{
						action: KEY_ACTION.SHIFT,
					},
					{
						text: {
							defaultValue: "-^´",
						},
						action: KEY_ACTION.SPECIALCHARS,
					},
					{
						text: {
							defaultValue: "Espace",
						},
						action: KEY_ACTION.SPACEBAR,
					},
					{
						text: {
							defaultValue: "Valider",
						},
						action: confirmForm,
						style: {
							backgroundColor: "#117a31",
							textColor: "#ffffff",
							fontSize: "0.032rem",
							textAlign: "center",
						},
					},
					{
						action: KEY_ACTION.BACKSPACE,
					}
				],
			}
		],
	} as IKeyboard;

	useEffect(() => {
		//* Extract text inputs from "inputs" prop
		const textInputs: IInputContent[] = [];
		inputs.map((input) => {
			textInputs.push(input.content as IInputContent);
		});

		setContent(textInputs);

		//* Initializes values with text inputs default values
		//* This also makes sure the ids are already available for sorting
		setFields(() => {
			const initValues: IInputField[] = [];
			textInputs.forEach((input) => {
				if (input.textInput) {
					initValues.push(input.textInput);
				}
			});
			return [...initValues];
		});
	}, [inputs]);

	useEffect(() => {
		//* Puts focus on the first input with autofocus on
		const autoFocus = content.find(content => content.autoFocus);

		if (autoFocus && autoFocus.textInput) {
			setFocusedField(autoFocus.textInput.id);
		}
	}, [content]);

	useEffect(() => {
		//* Removes "invalid" highlight from input as soon as user starts typing in
		fields.forEach((field) => {
			if (field.value.trim() !== "") {
				const idValue = invalidFields.find(f => f === field.id);

				if (idValue) {
					const newInvalidValues = invalidFields.filter(f => f !== idValue);

					setInvalidFields([...newInvalidValues]);
				}
			}
		});
	}, [fields]);

	function confirmForm() {
		//* Makes sure to highlight the empty required inputs
		const invalid: string[] = [];
		fields.forEach((field) => {
			if (field.value.trim() === "" && field.required) {
				invalid.push(field.id);
			}
		});

		setInvalidFields([...invalid]);

		//* Focuses on first empty input
		if (invalid.length > 0) {
			setFocusedField(invalid[0]);
			return;
		}

		//? Values are all considered valid now, we can save datas to ticket state
		fields.forEach((field) => {
			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
				payload: field,
			});
		});

		//* Signals to Active Page that we are ready to move on
		const contents = inputs.map(input => input.content as IInputContent);
		const actions = contents.find(content => content.actions)?.actions;
		onReady(actions);
	}

	function changetexthandler(value: string) {
		setFields(latest => {
			const encodedInput = latest.find(inputField => (inputField.id === focusedField));

			if (encodedInput) {
				const newData: IInputField = { id: encodedInput.id, value: encodedInput.value + value, };

				const filtered = latest.filter(inputField => inputField !== encodedInput);

				return [...filtered, newData];
			} else {
				if (focusedField) {
					return [
						...latest,
						{ id: focusedField, value: value, } as IInputField
					];
				} else {
					return [...latest];
				}
			}
		});
	}

	function deleteHandler() {
		setFields(latest => {
			const encodedInput = latest.find(inputField => (inputField.id === focusedField));

			if (encodedInput) {
				const newData: IInputField = { id: encodedInput.id, value: encodedInput.value.slice(0, -1), };

				const filtered = latest.filter(inputField => inputField !== encodedInput);

				return [...filtered, newData];
			} else {
				return [...latest];
			}
		});
	}

	return (
		<>
			{content.map((content) => {
				if (content.textInput === undefined) {
					return <></>;
				}

				return (
					<TextInput
						key={content.textInput.id}
						id={content.textInput.id}
						value={fields.find(field => field.id === content.textInput?.id)?.value ?? ""}
						isValid={!invalidFields.includes(content.textInput.id)}
						focused={focusedField === content.textInput.id}
						onFocus={(id: string) => setFocusedField(id)}
						placeholder={content.placeholder ?? ""}
						styles={content.styles}
					/>
				);
			})}
			<CustomKeyboard
				pattern={(flow.keyboardLayout && flow.keyboardLayout === KEYBOARD_LAYOUT.CUSTOMMADE) ? customPattern : classicPattern}
				onChange={changetexthandler}
				onDelete={deleteHandler}
				shift={
					fields.find(field => field.id === focusedField) === undefined ||
					fields.find(field => field.id === focusedField)?.value === "" ||
					fields.find(field => field.id === focusedField)?.value.slice(-1) === " " ||
					fields.find(field => field.id === focusedField)?.value.slice(-1) === "-"
				}
				display={focusedField !== undefined}
			/>
		</>
	);
}
