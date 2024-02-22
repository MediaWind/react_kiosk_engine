import { CSSProperties, useEffect, useState } from "react";

import styles from "../../../styles/keyboard/Row.module.scss";

import { IKeyRow } from "../../../lib/keyboardTypes";

import { IInputAction } from "../../../interfaces";

import { useKeyboardContext } from "../../../contexts/keyboardContext";

import Key from "./KeyNEW";

interface IKeyCustomStyles  {
	index: number | "all"
	style: CSSProperties
}

interface IKeyActionsOverride {
	[keyIndex: string]: IInputAction[]
}

interface IRowProps {
	index: number
	config: IKeyRow
	customStyle?: {
		index: number | "all"
		style?: CSSProperties
		keys?: IKeyCustomStyles[]
	}[]
}

export default function Row(props: IRowProps): JSX.Element {
	const { index, config, customStyle, } = props;

	const [styleOverride, setStyleOverride] = useState<CSSProperties>();

	const [keysStyleOverride, setKeysStyleOverride] = useState<IKeyCustomStyles[]>([]);
	const [keysActionsOverride, setKeysActionsOverride] = useState<IKeyActionsOverride>();

	const { actionsOverride, } = useKeyboardContext();

	useEffect(() => {
		if (config.style) {
			setStyleOverride(config.style);
		} else if (customStyle) {
			customStyle.map(style => {
				if (style.index === "all" || style.index === index) {
					setStyleOverride(style.style);

					if (style.keys) {
						setKeysStyleOverride(style.keys);
					}
				}
			});
		}
	}, []);

	useEffect(() => {
		if (actionsOverride && actionsOverride[index]) {
			setKeysActionsOverride(actionsOverride[index]);
		}
	}, [actionsOverride]);

	return (
		<div className={styles.main} style={styleOverride}>
			{config.keys.map((key, i) => <Key key={`keyboard_row_${index}__key__${i}`} index={i} config={key} actionsOverride={keysActionsOverride} styleOverride={keysStyleOverride} />)}
		</div>
	);
}
