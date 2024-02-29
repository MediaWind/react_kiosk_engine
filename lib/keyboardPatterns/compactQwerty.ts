import { IKeyboardLayout, KEY_ACTION } from "../keyboardTypes";

export const compactQwertyPattern = {
	rows: [
		{
			keys: [
				{
					text: {
						defaultValue: "1",
						specCharsValue: "!",
					},
				},
				{
					text: {
						defaultValue: "2",
						specCharsValue: "@",
					},
				},
				{
					text: {
						defaultValue: "3",
						specCharsValue: "#",
					},
				},
				{
					text: {
						defaultValue: "4",
						specCharsValue: "$",
					},
				},
				{
					text: {
						defaultValue: "5",
						specCharsValue: "%",
					},
				},
				{
					text: {
						defaultValue: "6",
						specCharsValue: "^",
					},
				},
				{
					text: {
						defaultValue: "7",
						specCharsValue: "&",
					},
				},
				{
					text: {
						defaultValue: "8",
						specCharsValue: "*",
					},
				},
				{
					text: {
						defaultValue: "9",
						specCharsValue: "(",
					},
				},
				{
					text: {
						defaultValue: "0",
						specCharsValue: ")",
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
						defaultValue: "w",
						capslockValue: "W",
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
				},
				{
					text: {
						defaultValue: "a",
						capslockValue: "A",
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
				}
			],
		},
		{
			keys: [
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
						defaultValue: "z",
						capslockValue: "Z",
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
					action: KEY_ACTION.SHIFT,
				},
				{
					text: {
						defaultValue: "-^´",
					},
					action: KEY_ACTION.SPECIALCHARS,
				},
				{
					action: KEY_ACTION.SPACEBAR,
				},
				{
					action: KEY_ACTION.ENTER,
				},
				{
					action: KEY_ACTION.BACKSPACE,
				}
			],
		}
	],
} as IKeyboardLayout;
