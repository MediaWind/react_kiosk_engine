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
		styleOverride?: {
			index: number | "all"
			style: CSSProperties
			valueOverride?: string
		}[]
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
	const [customStyle, setCustomStyle] = useState<CSSProperties>();
	const [text, setText] = useState<string>("");
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
		setText(() => {
			if (capslock && config.config.text?.capslockValue) {
				return config.config.text.capslockValue;
			}
			if (specChars && config.config.text?.specCharsValue) {
				return config.config.text.specCharsValue;
			}
			return config.config.text?.defaultValue ?? (config.config.action === KEY_ACTION.SPACEBAR ? "Space" : "");
		});
	}, [config]);

	useEffect(() => {
		if (config.styleOverride) {
			config.styleOverride.map(style => {
				if (style.index === "all" || style.index === config.index) {
					setText(latest => style.valueOverride ?? latest);
					setCustomStyle(style.style);
				}
			});
		}
	}, [config]);

	useEffect(() => {
		if (config.config.action) {
			setIcon(getIcon(config.config.action as KEY_ACTION));
		}
	}, [config]);

	useEffect(() => {
		if (text === "" && config.config.action === KEY_ACTION.ENTER) {
			setClassNames(latest => [...latest, styles.align_right]);
		}
	}, [config, text]);

	useEffect(() => {
		let timeOut: NodeJS.Timer;
		let interval: NodeJS.Timer;

		if (pressed) {
			setClassNames(latest => [...latest, styles.pressed]);

			if (config.config.action === KEY_ACTION.BACKSPACE) {
				timeOut = setTimeout(() => {
					interval = setInterval(() => {
						onDelete();
					}, 500);
				}, 1000);
			}
		} else {
			setClassNames(latest => {
				const returned = latest.filter(name => name !== styles.pressed);
				return [...returned];
			});
		}

		return () => {
			clearTimeout(timeOut);
			clearInterval(interval);
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
			style={customStyle}
			onTouchStart={() => setPressed(true)}
			onTouchEnd={clickHandler}
			onMouseDown={() => setPressed(true)}
			onMouseUp={devClick}
		>
			{text !== "" && <p>{text}</p>}
			{(icon && text === "") && <FontAwesomeIcon icon={icon} className={styles.icon} />}
			{config.config.action === KEY_ACTION.SHIFT && <FontAwesomeIcon icon={faCircle} style={{ color: capslock ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }}  />}
			{config.config.action === KEY_ACTION.SPECIALCHARS && <FontAwesomeIcon icon={faCircle} style={{ color: specChars ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }}  />}
		</div>
	);
}
