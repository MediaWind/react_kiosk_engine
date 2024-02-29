import { CSSProperties, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Row.module.scss";

import { IKeyRow } from "../../../lib/keyboardTypes";

import { useKeyboardContext } from "../../../contexts/keyboardContext";

import Key from "./Key";

interface IRowProps {
	index: number
	config: IKeyRow
}

export default function Row(props: IRowProps): JSX.Element {
	const { index, config, } = props;

	const [customStyles, setCustomStyles] = useState<CSSProperties>();

	const { styleOverride, } = useKeyboardContext();

	useEffect(() => {
		if (styleOverride?.rows) {
			styleOverride.rows.map(row => {
				if (row.index === index || row.index === "all") {
					setCustomStyles(row.style);
				}
			});
		}
	}, []);

	return (
		<div
			className={styles.main}
			style={{
				...config.style,
				...customStyles,
			}}
		>
			{config.keys.map((key, i) => <Key key={`keyboard_row_${index}__key__${i}`} parentIndex={index} index={i} config={key} />)}
		</div>
	);
}
