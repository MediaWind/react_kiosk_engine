import { CSSProperties } from "react";

interface INumberInputProps {
	styles: CSSProperties
}

export default function NumberInput(props: INumberInputProps) {
	const { styles, } = props;

	return (
		<input
			type="number"
			style={{
				position: "absolute",
				zIndex: 1,
				...styles,
			}}
		/>
	);
}
