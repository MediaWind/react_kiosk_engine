export default function getFontSize(height: string): string {
	const match = height.match(/([0-9]*[.])?[0-9]+/g);

	if (match) {
		const value = parseFloat(match[0].toString());

		return `${value / 100 * 0.6753}rem`;
	} else {
		return "";
	}
}
