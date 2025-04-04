import { CSSProperties, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faUp } from "@fortawesome/pro-regular-svg-icons";
import { faDeleteLeft } from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { faArrowTurnDownLeft } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/keyboard/Key.module.scss";

import { Variables } from "../../../../variables";

import { IKeyOptions, KEY_ACTION } from "../../../lib/keyboardTypes";

import { useKeyboardContext } from "../../../contexts/keyboardContext";

interface IActionKeyProps {
	config: {
		index: number;
		config: IKeyOptions
		customText?: string
		customStyles?: CSSProperties
	}
	onTriggerActionsOverride: CallableFunction
}

function getIcon(actionType: KEY_ACTION): IconDefinition | undefined {
	switch (actionType) {
		case KEY_ACTION.SHIFT: return faUp;
		case KEY_ACTION.BACKSPACE: return faDeleteLeft;
		case KEY_ACTION.ENTER: return faArrowTurnDownLeft;
		default: return undefined;
	}
}

export default function ActionKey(props: IActionKeyProps): JSX.Element {
	const { config, onTriggerActionsOverride, } = props;

	const [classNames, setClassNames] = useState<string[]>([]);
	const [icon, setIcon] = useState<IconDefinition | undefined>();

	const [capslockDotStyle, setCapslockDotStyle] = useState<CSSProperties>();
	const [specCharsDotStyle, setSpecCharsDotStyle] = useState<CSSProperties>();

	const [pressed, setPressed] = useState<boolean>(false);

	const { setDisplayKeyboard, capslock, setCapslock, specChars, setSpecChars, shiftLock, setShiftLock, onChange, onDelete, styleOverride, } = useKeyboardContext();

	useEffect(() => {
		if (config.config.action === KEY_ACTION.SPACEBAR) {
			setClassNames([styles.spacebar]);
		} else {
			setClassNames([styles.action]);
		}
	}, []);

	useEffect(() => {
		if (config.config.action) {
			setIcon(getIcon(config.config.action as KEY_ACTION));
		}
	}, []);

	useEffect(() => {
		if (config.customText === "" && config.config.action === KEY_ACTION.ENTER) {
			setClassNames(latest => [...latest, styles.align_right]);
		}
	}, []);

	useEffect(() => {
		if (styleOverride && styleOverride.statusDot) {
			if (capslock || shiftLock) {
				if (shiftLock && styleOverride.statusDot.secondaryEnabled) {
					setCapslockDotStyle(styleOverride.statusDot.secondaryEnabled);
				} else {
					setCapslockDotStyle(styleOverride.statusDot.enabled);
				}
			} else {
				setCapslockDotStyle(styleOverride.statusDot.disabled);
			}

			if (specChars) {
				setSpecCharsDotStyle(styleOverride.statusDot.enabled);
			} else {
				setSpecCharsDotStyle(styleOverride.statusDot.disabled);
			}
		}
	}, [capslock, specChars, shiftLock]);

	useEffect(() => {
		let timeOut1: NodeJS.Timeout;
		let interval1: NodeJS.Timeout;
		let timeOut2: NodeJS.Timeout;
		let interval2: NodeJS.Timeout;

		if (pressed) {
			setClassNames(latest => [...latest, styles.pressed]);

			if (config.config.action === KEY_ACTION.BACKSPACE) {
				timeOut1 = setTimeout(() => {
					interval1 = setInterval(() => {
						onDelete();
					}, 200);
				}, 700);

				timeOut2 = setTimeout(() => {
					clearTimeout(timeOut1);
					clearInterval(interval1);
					interval2 = setInterval(() => {
						onDelete();
					}, 30);
				}, 3500);
			}
		} else {
			setClassNames(latest => {
				const returned = latest.filter(name => name !== styles.pressed);
				return [...returned];
			});
		}

		return () => {
			clearTimeout(timeOut1);
			clearInterval(interval1);
			clearTimeout(timeOut2);
			clearInterval(interval2);
		};
	}, [pressed]);

	function clickStartHandler() {
		setPressed(true);
	}

	function clickEndHandler() {
		setPressed(false);
		onTriggerActionsOverride();

		if (config.config.action === KEY_ACTION.SHIFT) {
			setCapslock(latest => !latest);

			if (shiftLock) {
				setShiftLock(false);
			}
		}

		if (config.config.action === KEY_ACTION.SPECIALCHARS) {
			setSpecChars(latest => !latest);
		}

		if (config.config.action === KEY_ACTION.ENTER) {
			setDisplayKeyboard(false);
		}

		if (config.config.action === KEY_ACTION.BACKSPACE) {
			onDelete();
		}

		if (config.config.action === KEY_ACTION.SPACEBAR) {
			onChange(" ");
		}
	}

	function devClickDown() {
		if (Variables.PREVIEW) {
			clickStartHandler();
		}
	}

	function devClickUp() {
		if (Variables.PREVIEW) {
			clickEndHandler();
		}
	}

	function doubleClickHandler() {
		if (config.config.action === KEY_ACTION.SHIFT) {
			setShiftLock(true);
		}
	}

	return (
		<div
			className={classNames.join(" ")}
			style={{
				...config.config.style,
				...config.customStyles,
			}}
			onTouchStart={clickStartHandler}
			onTouchEnd={clickEndHandler}
			onMouseDown={devClickDown}
			onMouseUp={devClickUp}
			onDoubleClick={doubleClickHandler}
		>
			{config.customText !== "" && (
				<p
					style={{
						fontFamily: config.customStyles?.fontFamily ?? config.config.style?.fontFamily,
						fontSize: config.customStyles?.fontSize ?? config.config.style?.fontSize,

						color: config.customStyles?.color ?? config.config.style?.color,

						textAlign: config.customStyles?.textAlign ?? config.config.style?.textAlign,
						textTransform: config.customStyles?.textTransform ?? config.config.style?.textTransform,
					}}
				>
					{config.customText}
				</p>
			)}

			{(icon && config.customText === "") && <FontAwesomeIcon
				icon={icon}
				className={styles.icon}
				style={{
					fontSize: config.customStyles?.fontSize ?? config.config.style?.fontSize,
					color: config.customStyles?.color ?? config.config.style?.color,
				}}
			/>}

			{config.config.action === KEY_ACTION.SHIFT && <FontAwesomeIcon
				icon={faCircle}
				style={{
					color: shiftLock ? "#ffba3a" : capslock ? "#00dd00" : "#999999",
					fontSize: "0.01rem",
					marginTop: "0.004rem",
					...capslockDotStyle,
				}}
			/>}

			{config.config.action === KEY_ACTION.SPECIALCHARS && <FontAwesomeIcon
				icon={faCircle}
				style={{
					color: specChars ? "#00dd00" : "#999999",
					fontSize: "0.01rem",
					marginTop: "0.004rem",
					...specCharsDotStyle,
				}}
			/>}
		</div>
	);
}
