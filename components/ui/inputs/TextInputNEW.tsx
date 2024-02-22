import { CSSProperties } from "react";

import { Variables } from "../../../../variables";

import getFontSize from "../../../utils/getFontSize";

interface ITextInputProps {
	id: string
	value: string
	focused: boolean
	onFocus: CallableFunction
	styles: CSSProperties
}

export default function TextInput(props: ITextInputProps): JSX.Element {
	const { id, value, focused, onFocus, styles, } = props;

	function focusHandler() {
		onFocus(id);
	}

	function devClick() {
		if (Variables.PREVIEW) {
			focusHandler();
		}
	}

	return (
		<input
			type="text"
			value={value}
			readOnly
			onTouchEnd={focusHandler}
			onClick={devClick}
			style={{
				...styles,
				position: "absolute",
				zIndex: 1,

				fontSize: styles.fontSize ?? getFontSize(styles.height?.toString() ?? ""),
				boxShadow: focused ? `0 0 10px 0 ${styles.borderColor ?? "#000000"}` : "",
			}}
		/>
	);
}
