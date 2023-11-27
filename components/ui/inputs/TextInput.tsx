import { IStyles } from "../../../interfaces";

import getFontSize from "../../../utils/getFontSize";

interface ITextInputProps {
	id: string
	value: string
	isValid: boolean | undefined
	focused: boolean
	onFocus: CallableFunction
	placeholder: string
	styles: IStyles
}

export default function TextInput(props: ITextInputProps) {
	const {
		id,
		value,
		focused,
		isValid,
		onFocus,
		placeholder,
		styles,
	} = props;

	return (
		<>
			<input
				id="textinput"
				placeholder={placeholder}
				value={value}
				readOnly
				type="text"
				onTouchEnd={() => onFocus(id)}
				style={{
					all: styles.all,

					position: "absolute",
					top: styles.top,
					bottom: styles.bottom,
					right: styles.right,
					left: styles.left,
					zIndex: 1,

					width: styles.width,
					height: styles.height,

					margin: styles.margin,
					padding: styles.padding,

					borderWidth: styles.borderWidth,
					borderStyle: styles.borderStyle,
					borderColor: isValid ? styles.borderColor : "#ff0000",
					borderRadius: styles.borderRadius,
					boxShadow: isValid ? (focused ? `0 0 10px 0 ${styles.borderColor ?? "#000000"}` : "") : "0 0 10px 0 #ff0000",

					fontSize: styles.fontSize ? styles.fontSize : getFontSize(styles.height),
					color: styles.textColor,
					textAlign: styles.textAlign,
					backgroundColor: styles.backgroundColor ?? "#ffffff",

					caretColor: "auto",
					userSelect: "none",
				}}
			/>
		</>
	);
}
