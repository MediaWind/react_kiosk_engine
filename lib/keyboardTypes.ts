import { CSSProperties } from "react";

import { IInputAction } from "../interfaces";

export interface IKeyboard {
	layout: KEYBOARD_LAYOUT,
	mode?: KEYBOARD_MODE
	customLayout?: IKeyboardLayout
	actionsOverride?: {
		[rowIndex: string]: {
			[keyIndex: string]: IInputAction[]
		}
	}
	styleOverride?: IKeyboardStyleOverride
}

export enum KEYBOARD_LAYOUT {
	/**
	 * 1 row special chars, 3 rows letters, 1 row actions.
	 */
	CLASSIC = "classic",
	/**
	 * 1 row special chars, 2 rows letters, 1 row actions.
	 */
	COMPACT = "compact",
	/**
	 * 4 rows of numbers. Last row has enter and backspace action.
	 */
	NUMPAD = "numpad",
	/**
	 * 1 row special chars (not including numbers), 3 rows letters, 1 row actions + numpad
	 */
	FULL = "full",
	/**
	 * Provide your own layout
	 */
	CUSTOM = "custom"
}

export enum KEYBOARD_MODE {
	AZERTY = "azerty",
	QWERTY = "qwerty",
}

export interface IKeyboardLayout {
	rows: IKeyRow[]
}

export interface IKeyRow {
	keys: IKeyOptions[]
	style?: CSSProperties
}

export interface IKeyOptions {
	text?: {
		defaultValue: string
		capslockValue?: string
		specCharsValue?: string
	}
	action?: KEY_ACTION
	style?: CSSProperties
}

export enum KEY_ACTION {
	SHIFT = "shift",
	ALT = "alt",
	CTRL = "ctrl",
	SPACEBAR = "spacebar",
	ENTER = "enter",
	BACKSPACE = "backspace",
	SPECIALCHARS = "specialchars"
}

export interface IKeyboardStyleOverride {
	board?: CSSProperties
	rows?: {
		index: number | "all"
		style?: CSSProperties
		keys?: {
			index: number | "all"
			style: CSSProperties
			valueOverride?: string
		}[]
	}[]
	statusDot?: {
		disabled: CSSProperties
		enabled: CSSProperties
		secondaryEnabled?: CSSProperties
	}
}
