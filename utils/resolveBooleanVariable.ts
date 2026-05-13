import { Variables } from "../../variables";

export default function resolveBooleanVariable(value: boolean | string | undefined): boolean {
	if (typeof value === "boolean") {
		return value;
	}

	if (typeof value !== "string") {
		return false;
	}

	const trimmed = value.trim();
	const variableMatch = trimmed.match(/^\{([A-Z0-9_]+)\}$/);

	if (variableMatch) {
		const variableName = variableMatch[1];
		const variableValue = (Variables as unknown as Record<string, unknown>)[variableName];

		if (typeof variableValue === "boolean") {
			return variableValue;
		}

		return String(variableValue).trim() === "true";
	}

	return trimmed === "true";
}
