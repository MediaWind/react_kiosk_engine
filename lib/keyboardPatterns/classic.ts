import { IKeyboard, KEY_ACTION } from "../../components/ui/keyboard/CustomKeyboard";

export const classicPattern = {
	rows: [
		{
			keys: [
				{
					text: {
						defaultValue: "0",
						specCharsValue: "-",
					},
				},
				{
					text: {
						defaultValue: "1",
						specCharsValue: "à",
					},
				},
				{
					text: {
						defaultValue: "2",
						specCharsValue: "â",
					},
				},
				{
					text: {
						defaultValue: "3",
						specCharsValue: "ç",
					},
				},
				{
					text: {
						defaultValue: "4",
						specCharsValue: "é",
					},
				},
				{
					text: {
						defaultValue: "5",
						specCharsValue: "è",
					},
				},
				{
					text: {
						defaultValue: "6",
						specCharsValue: "ê",
					},
				},
				{
					text: {
						defaultValue: "7",
						specCharsValue: "ë",
					},
				},
				{
					text: {
						defaultValue: "8",
						specCharsValue: "ù",
					},
				},
				{
					text: {
						defaultValue: "9",
						specCharsValue: "û",
					},
				}
			],
		},
		{
			keys: [
				{
					text: {
						defaultValue: "a",
						capslockValue: "A",
					},
				},
				{
					text: {
						defaultValue: "z",
						capslockValue: "Z",
					},
				},
				{
					text: {
						defaultValue: "e",
						capslockValue: "E",
					},
				},
				{
					text: {
						defaultValue: "r",
						capslockValue: "R",
					},
				},
				{
					text: {
						defaultValue: "t",
						capslockValue: "T",
					},
				},
				{
					text: {
						defaultValue: "y",
						capslockValue: "Y",
					},
				},
				{
					text: {
						defaultValue: "u",
						capslockValue: "U",
					},
				},
				{
					text: {
						defaultValue: "i",
						capslockValue: "I",
					},
				},
				{
					text: {
						defaultValue: "o",
						capslockValue: "O",
					},
				},
				{
					text: {
						defaultValue: "p",
						capslockValue: "P",
					},
				}
			],
		},
		{
			keys: [
				{
					text: {
						defaultValue: "q",
						capslockValue: "Q",
					},
				},
				{
					text: {
						defaultValue: "s",
						capslockValue: "S",
					},
				},
				{
					text: {
						defaultValue: "d",
						capslockValue: "D",
					},
				},
				{
					text: {
						defaultValue: "f",
						capslockValue: "F",
					},
				},
				{
					text: {
						defaultValue: "g",
						capslockValue: "G",
					},
				},
				{
					text: {
						defaultValue: "h",
						capslockValue: "H",
					},
				},
				{
					text: {
						defaultValue: "j",
						capslockValue: "J",
					},
				},
				{
					text: {
						defaultValue: "k",
						capslockValue: "K",
					},
				},
				{
					text: {
						defaultValue: "l",
						capslockValue: "L",
					},
				},
				{
					text: {
						defaultValue: "m",
						capslockValue: "M",
					},
				}
			],
		},
		{
			keys: [
				{
					text: {
						defaultValue: "w",
						capslockValue: "W",
					},
				},
				{
					text: {
						defaultValue: "x",
						capslockValue: "X",
					},
				},
				{
					text: {
						defaultValue: "c",
						capslockValue: "C",
					},
				},
				{
					text: {
						defaultValue: "v",
						capslockValue: "V",
					},
				},
				{
					text: {
						defaultValue: "b",
						capslockValue: "B",
					},
				},
				{
					text: {
						defaultValue: "n",
						capslockValue: "N",
					},
				}
			],
		},
		{
			keys: [
				{
					action: KEY_ACTION.SHIFT,
				},
				{
					text: {
						defaultValue: "-^´",
					},
					action: KEY_ACTION.SPECIALCHARS,
				},
				{
					text: {
						defaultValue: "Espace",
					},
					action: KEY_ACTION.SPACEBAR,
				},
				{
					text: {
						defaultValue: "Enter",
					},
					action: KEY_ACTION.ENTER,
				},
				{
					action: KEY_ACTION.BACKSPACE,
				}
			],
		}
	],
} as IKeyboard;
