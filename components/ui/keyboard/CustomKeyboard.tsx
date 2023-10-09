import { useEffect, useState } from "react";

import styles from "../../../styles/CustomKeyboard.module.scss";

import KeyRow from "./KeyRow";
import SpecialCharsBox from "./SpecialCharsBox";

export interface IKeyboard {
	rows: IKeyRow[]
	specialCharBox?: string[]
}

export interface IKeyRow {
	keys: IKeyOptions[]
}

export interface IKeyOptions {
	text?: {
		defaultValue: string
		capslockValue?: string
		specCharsValue?: string
	}
	action?: KeyAction | CallableFunction
	style?: IKeyStyling
}

export enum KeyAction {
	SHIFT = "shift",
	ALT = "alt",
	CTRL = "ctrl",
	SPACEBAR = "spacebar",
	ENTER = "enter",
	BACKSPACE = "backspace",
	SPECIALCHARS = "specialchars"
}

export interface IKeyStyling {
	backgroundColor?: string,
	textColor?: string,
	fontSize?: string,
	textAlign?: string,
}

interface ICustomKeyboardProps {
	pattern: IKeyboard
	onChange: CallableFunction
	onDelete: CallableFunction
	shift: boolean
	display?: boolean
}

export default function CustomKeyboard(props: ICustomKeyboardProps): JSX.Element {
	const {
		pattern,
		onChange,
		onDelete,
		shift,
		display,
	} = props;

	const [capslock, setCapslock] = useState<boolean>(true);
	const [specChars, setSpecChars] = useState<boolean>(false);

	useEffect(() => {
		setCapslock(shift);
	}, [shift]);

	const addtexthandler = (char: string) => {
		onChange(char);
	};

	const deletetexthandler = () => {
		onDelete();
	};

	const toggleShiftHandler = () => {
		setCapslock(latest => !latest);
	};

	const toggleSpecialChars = () => {
		setSpecChars(latest => !latest);
	};

	return (
		<div className={styles.main} style={{ display: display ? "" : "none", }}>
			{pattern.rows.map((row, index) => {
				return (
					<KeyRow
						key={row.keys.toString() + index}
						row={row}
						onAddChars={addtexthandler}
						onDeleteChars={deletetexthandler}
						onShiftToggle={toggleShiftHandler}
						capslock={capslock}
						onDisplaySpecChars={() => toggleSpecialChars()}
						specChars={specChars}
					/>
				);
			})}

			{pattern.specialCharBox && <SpecialCharsBox
				chars={pattern.specialCharBox}
				onAddChar={addtexthandler}
				visible={specChars}
				onClose={() => toggleSpecialChars()}
			/>}
		</div>
	);
}
