import { CSSProperties } from "react";

import style from "../../../styles/inputs/SelectInput.module.scss";

import getFontSize from "../../../utils/getFontSize";

interface ISelectOptionProps {
	label: string
	value: string
	onChange: CallableFunction
	styles?: CSSProperties
}

export default function SelectOption(props: ISelectOptionProps): JSX.Element {
	const { label, value, onChange, styles, } = props;

	function clickHandler() {
		onChange(label, value);
	}

	return (
		<div onClick={clickHandler} className={style.option} style={{ ...styles, }}>
			<p style={{
				fontFamily: styles?.fontFamily,
				fontSize: style.fontSize ?? getFontSize(`${style.height}`),
				color: styles?.color,
				textAlign: styles?.textAlign,
			}}>
				{label.trim().replace("\\", "")}
			</p>
		</div>
	);
}
