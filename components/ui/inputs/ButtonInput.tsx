import { Variables } from "../../../../variables";

import { IStyles } from "../../../interfaces";

interface IButtonInputProps {
	onClick: CallableFunction
	styles: IStyles
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
				all: styles.all,
				outline: "none",

				position: "absolute",
				top: styles.top,
				bottom: styles.bottom,
				right: styles.right,
				left: styles.left,
				zIndex: 2,

				width: styles.width,
				height: styles.height,

				margin: styles.margin,
				padding: styles.padding,

				borderStyle: "none",
				backgroundColor: styles.backgroundColor ?? "transparent",
				opacity: styles.opacity,

				borderColor: styles.borderColor,
				borderRadius: styles.borderRadius,
			}}
		></button>
	);
}
