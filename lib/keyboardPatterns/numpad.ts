import { IKeyboard, KEY_ACTION } from "../../components/ui/keyboard/CustomKeyboard";

export const numpadPattern = {
	rows: [
		{
			keys: [
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
						defaultValue: "Enter",
					},
					action: KEY_ACTION.ENTER,
					style: {
						width: "0.0815rem",
						margin: "0 0.0075rem",
						fontSize: "0.017rem",
					},
				},
				{
					text: {
						defaultValue: "0",
					},
				},
				{
					action: KEY_ACTION.BACKSPACE,
					style: {
						width: "0.0815rem",
						margin: "0 0.0075rem",
					},
				}
			],
		}
	],
} as IKeyboard;
