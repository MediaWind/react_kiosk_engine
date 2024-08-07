import { CSSProperties } from "react";

import styling from "../../../styles/inputs/TextInput.module.scss";

import { Variables } from "../../../../variables";

import getFontSize from "../../../utils/getFontSize";

import { useLanguageContext } from "../../../contexts/languageContext";

interface ITextInputProps {
	id: string
	value: string
	focused: boolean
	onFocus: CallableFunction
	invalid: boolean
	styles: CSSProperties
	placeholder?: Record<string, string>
}

export default function TextInput(props: ITextInputProps): JSX.Element {
	const { id, value, focused, onFocus, invalid, styles, placeholder, } = props;

	const { language, } = useLanguageContext();

	function focusHandler() {
		onFocus(id);
	}

	function devClick() {
		if (Variables.PREVIEW) {
			focusHandler();
		}
	}

	return (
		<div
			className={`${styling.main} ${focused ? styling.focused : ""}`}
			onTouchEnd={focusHandler}
			onClick={devClick}
			style={{
				...styles,
				position: "absolute",
				zIndex: 2,

				borderColor: invalid ? "#FF0000" : styles.borderColor,
				boxShadow: (focused || invalid) ? `0 0 10px 0 ${invalid ? "#FF0000" : (styles.borderColor ?? "#000000")}` : styles.boxShadow,

				userSelect: "none",
			}}
		>
			{(value === "" && placeholder) && <span
				style={{
					position: "absolute",
					fontFamily: styles.fontFamily,
					fontSize: styles.fontSize ?? getFontSize(`${styles.height}`),
					color: styles.color,
					textAlign: styles.textAlign,
					opacity: focused ? .1 : .5,
				}}
			>
				{placeholder[language ?? "fr"]}
			</span>}

			<p
				style={{
					fontFamily: styles.fontFamily,
					fontSize: styles.fontSize ?? getFontSize(`${styles.height}`),
					color: styles.color,
					textAlign: styles.textAlign,
				}}
			>
				{value}
			</p>
		</div>
	);
}
