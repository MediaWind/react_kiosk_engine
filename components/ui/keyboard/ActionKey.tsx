import { CSSProperties, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faUp } from "@fortawesome/pro-regular-svg-icons";
import { faDeleteLeft } from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { faArrowTurnDownLeft } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/keyboard/Key.module.scss";

import { Variables } from "../../../../variables";

import { KEY_ACTION } from "../../../lib/keyboardTypes";

import { useKeyboardContext } from "../../../contexts/keyboardContext";

import { IKeyOptions } from "./CustomKeyboard";

interface IActionKeyProps {
	config: {
		index: number;
		config: IKeyOptions
		customText?: string
		customStyles?: CSSProperties
	}
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
	const { config, } = props;

	const [classNames, setClassNames] = useState<string[]>([]);
	const [icon, setIcon] = useState<IconDefinition | undefined>();

	const [pressed, setPressed] = useState<boolean>(false);

	const { setDisplayKeyboard, capslock, setCapslock, specChars, setSpecChars, onChange, onDelete, } = useKeyboardContext();

	useEffect(() => {
		if (config.config.action === KEY_ACTION.SPACEBAR) {
			setClassNames([styles.spacebar]);
		} else {
			setClassNames([styles.action]);
		}
	}, [config]);

	useEffect(() => {
		if (config.config.action) {
			setIcon(getIcon(config.config.action as KEY_ACTION));
		}
	}, [config]);

	useEffect(() => {
		if (config.customText === "" && config.config.action === KEY_ACTION.ENTER) {
			setClassNames(latest => [...latest, styles.align_right]);
		}
	}, [config, config.customText]);

	useEffect(() => {
		let timeOut1: NodeJS.Timer;
		let interval1: NodeJS.Timer;
		let timeOut2: NodeJS.Timer;
		let interval2: NodeJS.Timer;

		if (pressed) {
			setClassNames(latest => [...latest, styles.pressed]);

			if (config.config.action === KEY_ACTION.BACKSPACE) {
				timeOut1 = setTimeout(() => {
					interval1 = setInterval(() => {
						onDelete();
					}, 200);
				}, 700);

				timeOut2 = setTimeout(() => {
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

	function clickHandler() {
		setPressed(false);

		if (config.config.action === KEY_ACTION.SHIFT) {
			setCapslock(latest => !latest);
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

	function devClick() {
		if (Variables.PREVIEW) {
			clickHandler();
		}
	}

	return (
		<div
			className={classNames.join(" ")}
			style={config.customStyles}
			onTouchStart={() => setPressed(true)}
			onTouchEnd={clickHandler}
			onMouseDown={() => setPressed(true)}
			onMouseUp={devClick}
		>
			{config.customText !== "" && <p style={config.customStyles}>{config.customText}</p>}
			{(icon && config.customText === "") && <FontAwesomeIcon icon={icon} className={styles.icon} />}
			{config.config.action === KEY_ACTION.SHIFT && <FontAwesomeIcon icon={faCircle} style={{ color: capslock ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }}  />}
			{config.config.action === KEY_ACTION.SPECIALCHARS && <FontAwesomeIcon icon={faCircle} style={{ color: specChars ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }}  />}
		</div>
	);
}
