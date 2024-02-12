import { IStyles } from "../../../interfaces";

interface ISelectOptionProps {
	label: string
	value: string
	onChange: CallableFunction
	styles?: IStyles
}

export default function SelectOption(props: ISelectOptionProps): JSX.Element {
	const { label, value, onChange, styles, } = props;

	function clickHandler() {
		onChange(value);
	}

	return (
		<div onClick={clickHandler} style={{
			all: styles?.all,

			position: "relative",

			width: styles?.width,
			height: styles?.height,

			margin: styles?.margin,
			padding: styles?.padding,

			backgroundColor: styles?.backgroundColor,
			opacity: styles?.opacity,

			borderStyle: styles?.borderStyle,
			borderWidth: styles?.borderWidth,
			borderColor: styles?.borderColor,
			borderRadius: styles?.borderRadius,
		}}>
			<p style={{
				fontFamily: styles?.fontFamily,
				fontSize: styles?.fontSize,
				color: styles?.textColor,
				textAlign: styles?.textAlign,
			}}>
				{label}
			</p>
		</div>
	);
}
