import { SetStateAction, createContext, useContext } from "react";

import { IInputAction } from "../interfaces";

import { IKeyboardStyleOverride } from "../lib/keyboardTypes";

type keyboardContext = {
	displayKeyboard: boolean,
	setDisplayKeyboard: React.Dispatch<SetStateAction<boolean>>
	capslock: boolean
	setCapslock: React.Dispatch<SetStateAction<boolean>>
	specChars: boolean
	setSpecChars: React.Dispatch<SetStateAction<boolean>>
	shiftLock: boolean
	setShiftLock: React.Dispatch<SetStateAction<boolean>>
	onChange: CallableFunction
	onDelete: CallableFunction
	styleOverride?: IKeyboardStyleOverride
	actionsOverride?: {
		[rowIndex: string]: {
			[keyIndex: string]: IInputAction[]
		}
	}
	triggerActionsOverride?: CallableFunction
}

export const KeyboardContext = createContext<keyboardContext>({
	displayKeyboard: false,
	setDisplayKeyboard: () => null,
	capslock: false,
	setCapslock: () => null,
	specChars: false,
	setSpecChars: () => null,
	shiftLock: false,
	setShiftLock: () => null,
	onChange: () => null,
	onDelete: () => null,
});

export const useKeyboardContext = () => useContext(KeyboardContext);
