import { IKeyboardLayout, KEY_ACTION } from "../keyboardTypes";

export const fullQwertyPattern = {
	rows: [
		{
			keys: [
				{
					text: {
						defaultValue: "!",
						specCharsValue: "à",
					},
				},
				{
					text: {
						defaultValue: "@",
						specCharsValue: "â",
					},
				},
				{
					text: {
						defaultValue: "#",
						specCharsValue: "ç",
					},
				},
				{
					text: {
						defaultValue: "$",
						specCharsValue: "é",
					},
				},
				{
					text: {
						defaultValue: "%",
						specCharsValue: "è",
					},
				},
				{
					text: {
						defaultValue: ".",
						specCharsValue: "ê",
					},
				},
				{
					text: {
						defaultValue: "&",
						specCharsValue: "ë",
					},
				},
				{
					text: {
						defaultValue: "*",
						specCharsValue: "ù",
					},
				},
				{
					text: {
						defaultValue: ":",
						specCharsValue: "û",
					},
				},
				{
					text: {
						defaultValue: "-",
						specCharsValue: "_",
					},
				},
				{
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
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
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
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
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
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
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
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
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				},
				{
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
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
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				},
				{
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				},
				{
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				},
				{
					text: {
						defaultValue: "0",
					},
				},
				{
					text: {
						defaultValue: "",
					},
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
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
