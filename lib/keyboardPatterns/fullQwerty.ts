import { IKeyboardLayout, KEY_ACTION } from "../keyboardTypes";

export const fullQwertyPattern = {
	rows: [
		{
			keys: [
				{
					text: {
						defaultValue: "!",
						specCharsValue: "?",
					},
				},
				{
					text: {
						defaultValue: "@",
						specCharsValue: ".",
					},
				},
				{
					text: {
						defaultValue: "#",
						specCharsValue: "-",
					},
				},
				{
					text: {
						defaultValue: "$",
						specCharsValue: "\"",
					},
				},
				{
					text: {
						defaultValue: "%",
						specCharsValue: "'",
					},
				},
				{
					text: {
						defaultValue: "^",
						specCharsValue: ":",
					},
				},
				{
					text: {
						defaultValue: "&",
						specCharsValue: "/",
					},
				},
				{
					text: {
						defaultValue: "*",
						specCharsValue: "\\",
					},
				},
				{
					text: {
						defaultValue: "(",
						specCharsValue: "[",
					},
				},
				{
					text: {
						defaultValue: ")",
						specCharsValue: "]",
					},
				},
				{
					style: {
						visibility: "hidden",
					},
				},
				{
					text: {
						defaultValue: "7",
					},
				},
				{
					text: {
						defaultValue: "8",
					},
				},
				{
					text: {
						defaultValue: "9",
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
					style: {
						visibility: "hidden",
					},
				},
				{
					text: {
						defaultValue: "4",
					},
				},
				{
					text: {
						defaultValue: "5",
					},
				},
				{
					text: {
						defaultValue: "6",
					},
				}
			],
		},
		{
			keys: [
				{
					style: {
						visibility: "hidden",
						width: "0.02rem",
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
					style: {
						visibility: "hidden",
						width: "0.14rem",
					},
				},
				{
					text: {
						defaultValue: "1",
					},
				},
				{
					text: {
						defaultValue: "2",
					},
				},
				{
					text: {
						defaultValue: "3",
					},
				}
			],
		},
		{
			keys: [
				{
					style: {
						visibility: "hidden",
						width: "0.12rem",
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
				},
				{
					style: {
						visibility: "hidden",
						width: "0.335rem",
					},
				},
				{
					text: {
						defaultValue: "0",
					},
				},
				{
					style: {
						visibility: "hidden",
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
