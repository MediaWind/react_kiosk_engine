import { CSSProperties, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Row.module.scss";

import { IKeyRow } from "../../../lib/keyboardTypes";
import Key from "./KeyNEW";

interface IRowProps {
	index: number
	config: IKeyRow
	customStyle?: {
		index: number | "all"
		style: CSSProperties
		keys?: {
			index: number | "all"
			style: CSSProperties
		}[]
	}[]
}

export default function Row(props: IRowProps): JSX.Element {
	const { index, config, customStyle, } = props;

	const [styleOverride, setStyleOverride] = useState<CSSProperties>();

	useEffect(() => {
		if (config.style) {
			setStyleOverride(config.style);
		} else if (customStyle) {
			customStyle.map(style => {
				if (style.index === "all" || style.index === index) {
					setStyleOverride(style.style);
				}
			});
		}
	}, []);

	return (
		<div className={styles.main} style={styleOverride}>
			{config.keys.map((key, i) => <Key key={`keyboard_row_${index}__key__${i}`} index={i} config={key} />)}
		</div>
	);
}
