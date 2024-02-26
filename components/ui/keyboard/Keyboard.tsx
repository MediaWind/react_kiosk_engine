import { CSSProperties, SetStateAction, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Keyboard.module.scss";

import { IInputAction } from "../../../interfaces";
import { IKeyboard, IKeyboardLayout, KEYBOARD_LAYOUT, KEYBOARD_MODE } from "../../../lib/keyboardTypes";

import { KeyboardContext } from "../../../contexts/keyboardContext";

import { classicPattern } from "../../../lib/keyboardPatterns/classic";
import { compactPattern } from "../../../lib/keyboardPatterns/compact";
import { fullPattern } from "../../../lib/keyboardPatterns/full";
import { numpadPattern } from "../../../lib/keyboardPatterns/numpad";
import { classicQwertyPattern } from "../../../lib/keyboardPatterns/classicQwerty";
import { compactQwertyPattern } from "../../../lib/keyboardPatterns/compactQwerty";
import { fullQwertyPattern } from "../../../lib/keyboardPatterns/fullQwerty";

import getKeyboardAnimation from "../../../utils/getKeyboardAnimation";

import Row from "./Row";
import TextPreview from "./TextPreview";

interface IKeyboardProps {
	currentValue: string
	config: IKeyboard
	onChange: CallableFunction
	onDelete: CallableFunction
	onTriggerActionsOverride: CallableFunction
	displayKeyboard: boolean
	setDisplayKeyboard: React.Dispatch<SetStateAction<boolean>>
	enableTextPreview?: boolean
}

function getPattern(layout: KEYBOARD_LAYOUT, mode?: KEYBOARD_MODE): IKeyboardLayout {
	switch (layout) {
		case KEYBOARD_LAYOUT.COMPACT: return mode === KEYBOARD_MODE.QWERTY ? compactQwertyPattern : compactPattern;
		case KEYBOARD_LAYOUT.FULL: return mode === KEYBOARD_MODE.QWERTY ? fullQwertyPattern : fullPattern;
		case KEYBOARD_LAYOUT.NUMPAD: return numpadPattern;
		case KEYBOARD_LAYOUT.CLASSIC:
		default: return mode === KEYBOARD_MODE.QWERTY ? classicQwertyPattern : classicPattern;
	}
}

export default function Keyboard(props: IKeyboardProps): JSX.Element {
	const { currentValue, config, onChange, onDelete, onTriggerActionsOverride, displayKeyboard, setDisplayKeyboard, enableTextPreview, } = props;

	const [init, setInit] = useState<boolean>(true);
	const [pattern, setPattern] = useState<IKeyboardLayout>(getPattern(config.layout, config.mode));

	const [classNames, setClassNames] = useState<string[]>([styles.main]);
	const [customStyle, setCustomStyle] = useState<CSSProperties>();
	const [displayStyle, setDisplayStyle] = useState<string | undefined>();

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
			setPattern(getPattern(config.layout, config.mode));
		}
	}, [config]);

	useEffect(() => {
		if (config.styleOverride?.board) {
			setDisplayStyle(config.styleOverride.board.display);
			setCustomStyle(config.styleOverride.board);
		}
	}, [config]);

	useEffect(() => {
		if (init) {
			setInit(false);
		} else {
			setClassNames([styles.main, getKeyboardAnimation(displayKeyboard, config.styleOverride?.board)]);
		}

		let timeOut: NodeJS.Timer;

		if (displayKeyboard) {
			setDisplayStyle(config.styleOverride?.board?.display);
		} else {
			timeOut = setTimeout(() => {
				setDisplayStyle("none");
			}, 500);
		}

		return () => {
			clearTimeout(timeOut);
		};
	}, [displayKeyboard]);

	function triggerActionsOverride(actions: IInputAction[]) {
		onTriggerActionsOverride(actions);
	}

	function closeKeyboardHandler() {
		setDisplayKeyboard(false);
	}

	return (
		<>
			<KeyboardContext.Provider value={{
				displayKeyboard,
				setDisplayKeyboard,
				capslock,
				setCapslock,
				specChars,
				setSpecChars,
				onChange,
				onDelete,
				styleOverride: config.styleOverride,
				actionsOverride: config.actionsOverride,
				triggerActionsOverride,
			}}>
				<div
					className={classNames.join(" ")}
					style={{
						...customStyle,
						display: displayStyle,
					}}
				>
					{enableTextPreview && <TextPreview text={currentValue} />}
					{pattern.rows.map((row, index) => <Row key={"keyboard_row__" + index} index={index} config={row} />)}
				</div>
			</KeyboardContext.Provider>
			<div className={styles.close_area} onClick={closeKeyboardHandler}></div>
		</>
	);
}
