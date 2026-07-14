import { CSSProperties, TouchEvent } from "react";

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

	function touchHandler(event: TouchEvent<HTMLButtonElement>) {
		// The action can replace the current page immediately.  Without cancelling
		// the compatibility click generated after touchend, that click may then
		// land on a control at the same coordinates on the next page.
		event.preventDefault();
		event.stopPropagation();
		clickHandler();
	}

	function devClick() {
		if (Variables.PREVIEW) {
			clickHandler();
		}
	}

	return (
		<button
			onClick={devClick}
			onTouchEnd={touchHandler}
			style={{
				position: "absolute",
				zIndex: 2,

				outline: "none",
				borderStyle: "none",

				backgroundColor: Variables.W_DEBUG ? "rgba(0, 0, 0, 0.8)" : "transparent",

				...styles,
			}}
		></button>
	);
}
