export default function getNumbersOnly(string: string): number {
	const numbers = string.match(/[0-9]/g);

	if (numbers) {
		return parseInt(numbers.join(""));
	} else {
		return 0;
	}
}
