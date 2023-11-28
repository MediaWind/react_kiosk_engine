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

	return (
		<button
			onClick={clickHandler}
			onTouchEnd={clickHandler}
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

				borderStyle: "none",
				backgroundColor: "transparent",
				opacity: 0.5,

				borderColor: styles.borderColor,
				borderRadius: styles.borderRadius,
			}}
		></button>
	);
}
