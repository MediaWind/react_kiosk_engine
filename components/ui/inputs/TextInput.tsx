import { IStyles } from "../../../interfaces";

interface ITextInputProps {
	id: string
	value: string
	isValid: boolean | undefined
	focused: boolean
	onFocus: CallableFunction
	placeholder: string
	styles: IStyles
}

function getFontSize(string: string): string {
	const match = string.match(/([0-9]*[.])?[0-9]+/g);

	if (match) {
		const value = parseFloat(match[0].toString());

		return `${value / 100 * 0.6753}rem`;
	} else {
		return "";
	}
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
				onClick={() => onFocus(id)}
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
					cursor: styles.cursor,
				}}
			/>
		</>
	);
}
