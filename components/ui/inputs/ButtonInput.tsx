import { CSSProperties } from "react";

import { Variables } from "../../../../variables";

interface IButtonInputProps {
	onClick: CallableFunction
	styles: CSSProperties
}

export default function ButtonInput(props: IButtonInputProps) {
	const { onClick, styles, } = props;

	const clickHandler = () => {
		onClick();
	};

	function devClick() {
		if (Variables.PREVIEW) {
			clickHandler();
		}
	}

	return (
		<button
			onClick={devClick}
			onTouchEnd={clickHandler}
			style={{
				position: "absolute",
				zIndex: 2,

				outline: "none",
				borderStyle: "none",

				backgroundColor: "transparent",

				...styles,
			}}
		></button>
	);
}
