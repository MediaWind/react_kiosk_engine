import { DefaultVariables } from "../../core/variables";
import { Variables } from "../../variables";

export default function substVariables(s: string): string {
	const defaultKeys = Object.keys(DefaultVariables);
	defaultKeys.forEach((key) => {
		const varKey = (key as keyof typeof DefaultVariables);
		s = s.split(`{${key.toLowerCase()}}`).join(String(DefaultVariables[varKey]));
	});
	const keys = Object.keys(Variables);
	keys.forEach((key) => {
		const varKey = (key as keyof typeof Variables);
		s = s.split(`{${key.toLowerCase()}}`).join(String(Variables[varKey]));
	});

	return s;
}
