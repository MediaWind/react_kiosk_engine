import { CSSProperties, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Key.module.scss";

import { Variables } from "../../../../variables";

import { IInputAction } from "../../../interfaces";

import { useKeyboardContext } from "../../../contexts/keyboardContext";

import { IKeyOptions, KEY_ACTION } from "./CustomKeyboard";
import ActionKey from "./ActionKey";

interface IKeyProps {
	index: number;
	config: IKeyOptions
	actionsOverride?: {
		[keyIndex: string]: IInputAction[]
	}
	styleOverride?: {
		index: number | "all"
		style: CSSProperties
		valueOverride?: string
	}[]
}

export default function Key(props: IKeyProps): JSX.Element {
	const { index, config, actionsOverride, styleOverride, } = props;

	const [classNames, setClassNames] = useState<string[]>([styles.default]);
	const [text, setText] = useState<string>("");

	const [customActions, setCustomActions] = useState<IInputAction[]>([]);
	const [customStyles, setCustomStyle] = useState<CSSProperties>();

	const [pressed, setPressed] = useState<boolean>(false);

	const { capslock, specChars, onChange, triggerActionsOverride, } = useKeyboardContext();

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

		if (styleOverride) {
			styleOverride.map(style => {
				if (style.index === "all" || style.index === index) {
					setText(latest => style.valueOverride ?? latest);
					setCustomStyle(latest => {
						return {
							...latest,
							...style.style,
						};
					});
				}
			});
		}
	}, [capslock, specChars, styleOverride]);

	useEffect(() => {
		if (actionsOverride && actionsOverride[index]) {
			setCustomActions(actionsOverride[index]);
		}
	}, [actionsOverride]);

	function triggerActions() {
		if (customActions.length > 0 && triggerActionsOverride) {
			triggerActionsOverride(customActions);
		}
	}

	if (config.action) {
		return <ActionKey config={{ index, config, customStyles, customText: text, }} onTriggerActionsOverride={triggerActions} />;
	}

	function clickHandler() {
		setPressed(false);
		onChange(text);
		triggerActions();
	}

	function devClick() {
		if (Variables.PREVIEW) {
			clickHandler();
		}
	}

	return (
		<div
			className={classNames.join(" ")}
			style={customStyles}
			onTouchStart={() => setPressed(true)}
			onTouchEnd={clickHandler}
			onMouseDown={() => setPressed(true)}
			onMouseUp={devClick}
		>
			<p>{text}</p>
		</div>
	);
}
