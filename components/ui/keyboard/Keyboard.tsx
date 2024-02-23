import { CSSProperties, SetStateAction, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Keyboard.module.scss";

import { IInputAction } from "../../../interfaces";
import { IKeyboard, IKeyboardLayout, KEYBOARD_LAYOUT } from "../../../lib/keyboardTypes";

import { KeyboardContext } from "../../../contexts/keyboardContext";

import { classicPattern } from "../../../lib/keyboardPatterns/classic";
import { compactPattern } from "../../../lib/keyboardPatterns/compact";
import { numpadPattern } from "../../../lib/keyboardPatterns/numpad";
import { fullPattern } from "../../../lib/keyboardPatterns/full";

import Row from "./Row";

interface IKeyboardProps {
	currentValue: string
	config: IKeyboard
	onChange: CallableFunction
	onDelete: CallableFunction
	onTriggerActionsOverride: CallableFunction
	displayKeyboard: boolean
	setDisplayKeyboard: React.Dispatch<SetStateAction<boolean>>
}

function getPattern(layout: KEYBOARD_LAYOUT): IKeyboardLayout {
	switch (layout) {
		case KEYBOARD_LAYOUT.COMPACT: return compactPattern;
		case KEYBOARD_LAYOUT.FULL: return fullPattern;
		case KEYBOARD_LAYOUT.NUMPAD: return numpadPattern;
		case KEYBOARD_LAYOUT.CLASSIC:
		default: return classicPattern;
	}
}

export default function Keyboard(props: IKeyboardProps): JSX.Element {
	const { currentValue, config, onChange, onDelete, onTriggerActionsOverride, displayKeyboard, setDisplayKeyboard, } = props;

	const [init, setInit] = useState<boolean>(true);
	const [pattern, setPattern] = useState<IKeyboardLayout>(classicPattern);

	const [classNames, setClassNames] = useState<string[]>([styles.main]);
	const [customStyle, setCustomStyle] = useState<CSSProperties>();

	const [capslock, setCapslock] = useState<boolean>(true);
	const [specChars, setSpecChars] = useState<boolean>(false);

	useEffect(() => {
		if (
			currentValue === "" ||
			currentValue.slice(-1) === " " ||
			currentValue.slice(-1) === "-"
		) {
			setCapslock(true);
		} else {
			setCapslock(false);
		}
	}, [currentValue]);

	useEffect(() => {
		if (config.layout === KEYBOARD_LAYOUT.CUSTOM && config.customLayout) {
			setPattern(config.customLayout);
		} else {
			setPattern(getPattern(config.layout));
		}
	}, [config]);

	useEffect(() => {
		if (config.styleOverride?.board) {
			setCustomStyle(config.styleOverride.board);
		}
	}, [config]);

	useEffect(() => {
		if (init) {
			setInit(false);
		} else {
			setClassNames(displayKeyboard ? [styles.main, styles.slide_in] : [styles.main, styles.slide_out]);
		}
	}, [displayKeyboard]);

	function triggerActionsOverride(actions: IInputAction[]) {
		onTriggerActionsOverride(actions);
	}

	return (
		<KeyboardContext.Provider value={{
			displayKeyboard,
			setDisplayKeyboard,
			capslock,
			setCapslock,
			specChars,
			setSpecChars,
			onChange,
			onDelete,
			actionsOverride: config.actionsOverride,
			triggerActionsOverride,
		}}>
			<div className={classNames.join(" ")} style={customStyle}>
				{pattern.rows.map((row, index) => <Row key={"keyboard_row__" + index} index={index} config={row} customStyle={config.styleOverride?.rows} />)}
			</div>
		</KeyboardContext.Provider>
	);
}
