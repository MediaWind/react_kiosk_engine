import { SetStateAction, createContext, useContext } from "react";

type keyboardContext = {
	displayKeyboard: boolean,
	setDisplayKeyboard: React.Dispatch<SetStateAction<boolean>>
	capslock: boolean
	setCapslock: React.Dispatch<SetStateAction<boolean>>
	specChars: boolean
	setSpecChars: React.Dispatch<SetStateAction<boolean>>
	onChange: CallableFunction
	onDelete: CallableFunction
}

export const KeyboardContext = createContext<keyboardContext>({
	displayKeyboard: false,
	setDisplayKeyboard: () => null,
	capslock: false,
	setCapslock: () => null,
	specChars: false,
	setSpecChars: () => null,
	onChange: () => null,
	onDelete: () => null,
});

export const useKeyboardContext = () => useContext(KeyboardContext);
