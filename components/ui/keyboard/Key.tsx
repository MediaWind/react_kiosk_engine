import { CSSProperties, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Key.module.scss";

import { Variables } from "../../../../variables";

import { IInputAction } from "../../../interfaces";
import { IKeyOptions, KEY_ACTION } from "../../../lib/keyboardTypes";

import { useKeyboardContext } from "../../../contexts/keyboardContext";

import ActionKey from "./ActionKey";

interface IKeyProps {
	index: number;
	parentIndex: number;
	config: IKeyOptions
}

export default function Key(props: IKeyProps): JSX.Element {
	const { index, parentIndex, config, } = props;

	const [classNames, setClassNames] = useState<string[]>([styles.default]);
	const [text, setText] = useState<string>("");

	const [customActions, setCustomActions] = useState<IInputAction[]>([]);
	const [customStyles, setCustomStyle] = useState<CSSProperties>();

	const [pressed, setPressed] = useState<boolean>(false);

	const { capslock, specChars, onChange, styleOverride, actionsOverride, triggerActionsOverride, } = useKeyboardContext();

	useEffect(() => {
		if (styleOverride && styleOverride.rows) {
			styleOverride.rows.map(row => {
				if (row.index === parentIndex || row.index === "all") {
					if (row.keys) {
						row.keys.map(key => {
							if (key.index === index || key.index === "all") {
								setCustomStyle(latest => {
									return { ...latest, ...key.style, };
								});
							}
						});
					}
				}
			});
		}
	}, []);

	useEffect(() => {
		if (actionsOverride && actionsOverride[parentIndex] && actionsOverride[parentIndex][index]) {
			setCustomActions(actionsOverride[parentIndex][index]);
		}
	}, []);

	useEffect(() => {
		if (pressed) {
			setClassNames(latest => [...latest, styles.pressed]);
		} else {
			setClassNames(latest => {
				const returned = latest.filter(name => name !== styles.pressed);
				return [...returned];
			});
		}
	}, [pressed]);

	useEffect(() => {
		if (capslock && config.text?.capslockValue) {
			setText(config.text.capslockValue);
		} else if (specChars && config.text?.specCharsValue) {
			setText(config.text.specCharsValue);
		} else {
			setText(config.text?.defaultValue ?? (config.action === KEY_ACTION.SPACEBAR ? "Space" : ""));
		}
	}, [capslock, specChars]);

	function triggerActions() {
		if (customActions.length > 0 && triggerActionsOverride) {
			triggerActionsOverride(customActions);
		}
	}

	if (config.action) {
		return <ActionKey config={{ index, config, customText: text, customStyles, }} onTriggerActionsOverride={triggerActions} />;
	}

	function clickStartHandler() {
		setPressed(true);
	}

	function clickEndHandler() {
		setPressed(false);
		onChange(text);
		triggerActions();
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

	return (
		<div
			className={classNames.join(" ")}
			style={{
				...config.style,
				...customStyles,
			}}
			onTouchStart={clickStartHandler}
			onTouchEnd={clickEndHandler}
			onMouseDown={devClickDown}
			onMouseUp={devClickUp}
		>
			<p>{text}</p>
		</div>
	);
}
