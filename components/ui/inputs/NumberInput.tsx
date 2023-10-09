import { IStyles } from "../../../interfaces";

interface INumberInputProps {
	styles: IStyles
}

export default function NumberInput(props: INumberInputProps) {
	const { styles, } = props;

	return (
		<input
			type="number"
			style={{
				all: styles.all,

				position: "absolute",
				top: styles.top,
				bottom: styles.bottom,
				right: styles.right,
				left: styles.left,

				width: styles.width,
				height: styles.height,

				margin: styles.margin,
				padding: styles.padding,

				borderColor: styles.borderColor,
				borderRadius: styles.borderRadius,

				cursor: styles.cursor,
			}}
		/>
	);
}
