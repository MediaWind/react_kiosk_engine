import { CSSProperties, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Key.module.scss";

import { IKeyOptions } from "./CustomKeyboard";
import ActionKey from "./ActionKey";
import { useKeyboardContext } from "../../../contexts/keyboardContext";
import { Variables } from "../../../../variables";

interface IKeyProps {
	index: number;
	config: IKeyOptions
	styleOverride?: {
		index: number | "all"
		style: CSSProperties
		valueOverride?: string
	}[]
}

export default function Key(props: IKeyProps): JSX.Element {
	const { index, config, styleOverride, } = props;

	const [classNames, setClassNames] = useState<string[]>([styles.default]);
	const [text, setText] = useState<string>("");

	const [pressed, setPressed] = useState<boolean>(false);

	const { capslock, specChars, onChange, } = useKeyboardContext();

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
		}else if (specChars && config.text?.specCharsValue) {
			setText(config.text.specCharsValue);
		} else {
			setText(config.text?.defaultValue ?? "");
		}
	}, [capslock, specChars]);

	if (config.action) {
		return <ActionKey config={{ index, config, styleOverride, }} />;
	}

	function clickHandler() {
		setPressed(false);
		onChange(text);
	}

	function devClick() {
		if (Variables.PREVIEW) {
			clickHandler();
		}
	}

	return (
		<div
			className={classNames.join(" ")}
			onTouchStart={() => setPressed(true)}
			onTouchEnd={clickHandler}
			onMouseDown={() => setPressed(true)}
			onMouseUp={devClick}
		>
			<p>{text}</p>
		</div>
	);
}
