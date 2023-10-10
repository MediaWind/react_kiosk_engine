import { useEffect, useState } from "react";

import { IInputContent, IInputField, IMedia, TicketDataActionType } from "../interfaces";

import TextInput from "./ui/inputs/TextInput";
import CustomKeyboard, { IKeyboard, KeyAction } from "./ui/keyboard/CustomKeyboard";
import { useTicketDataContext } from "../contexts/ticketDataContext";

interface ITextInputsManagerProps {
	inputs: IMedia[]
	onReady: CallableFunction
}

export default function TextInputsManager(props: ITextInputsManagerProps): JSX.Element {
	const { inputs, onReady, } = props;

	const [content, setContent] = useState<IInputContent[]>([]);
	const [focusedField, setFocusedField] = useState<string | undefined>();
	const [values, setValues] = useState<IInputField[]>([]);
	const [invalidValues, setInvalidValues] = useState<string[]>([]);

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
						action: KeyAction.SHIFT,
					},
					{
						text: {
							defaultValue: "-^´",
						},
						action: KeyAction.SPECIALCHARS,
					},
					{
						text: {
							defaultValue: "Espace",
						},
						action: KeyAction.SPACEBAR,
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
						action: KeyAction.BACKSPACE,
					}
				],
			}
		],
	} as IKeyboard;

	useEffect(() => {
		//* Extract text inputs from 'inputs" prop
		const textInputs: IInputContent[] = [];
		inputs.map((input) => {
			textInputs.push(input.content as IInputContent);
		});

		setContent(textInputs);

		//* Initializes values with text inputs default values
		//* This also makes sure the ids are already available for sorting
		setValues(() => {
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
		values.forEach((value) => {
			if (value.value.trim() !== "") {
				const idValue = invalidValues.find(v => v === value.id);

				if (idValue) {
					const newInvalidValues = invalidValues.filter(v => v !== idValue);

					setInvalidValues([...newInvalidValues]);
				}
			}
		});
	}, [values]);

	function confirmForm() {
		//* Makes sure to highlight the empty required inputs
		const invalid: string[] = [];
		values.forEach((value) => {
			if (value.value.trim() === "" && value.required) {
				invalid.push(value.id);
			}
		});

		setInvalidValues([...invalid]);

		//* Focuses on first empty input
		if (invalid.length > 0) {
			setFocusedField(invalid[0]);
			return;
		}

		//? Values are all considered valid now, we can save datas to ticket state
		values.forEach((value) => {
			dispatchTicketState({
				type: TicketDataActionType.INPUTTEXTUPDATE,
				payload: value,
			});
		});

		//* Signals to Active Page that we are ready to move on
		const contents = inputs.map(input => input.content as IInputContent);
		const action = contents.find(content => content.action)?.action;
		onReady(action);
	}

	function changetexthandler(value: string) {
		setValues(latest => {
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
		setValues(latest => {
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
						value={values.find(field => field.id === content.textInput?.id)?.value ?? ""}
						isValid={!invalidValues.includes(content.textInput.id)}
						focused={focusedField === content.textInput.id}
						onFocus={(id: string) => setFocusedField(id)}
						placeholder={content.placeholder ?? ""}
						styles={content.styles}
					/>
				);
			})}
			<CustomKeyboard
				pattern={customPattern}
				onChange={changetexthandler}
				onDelete={deleteHandler}
				shift={
					values.find(field => field.id === focusedField) === undefined ||
					values.find(field => field.id === focusedField)?.value === "" ||
					values.find(field => field.id === focusedField)?.value.slice(-1) === " " ||
					values.find(field => field.id === focusedField)?.value.slice(-1) === "-"
				}
				display={focusedField !== undefined}
			/>
		</>
	);
}
