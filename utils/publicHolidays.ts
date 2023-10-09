export function getEaster(year: number): Date {
	// Oudin's algorythm - http://frederic.leon77.free.fr/formations/2012_13/100outils/jour2/oudin.pdf
	const G = year % 19;
	const C = Math.floor(year / 100);
	const C4 = Math.floor(C / 4);
	const E = Math.floor((8 * C + 13) / 25);
	const H = Math.floor((19 * G + C - C4 - E + 15) % 30);
	const K = Math.floor(H / 28);
	const P = Math.floor(29 / (H + 1));
	const Q = Math.floor((21 - G) / 11);
	const I = Math.floor((K * P * Q - 1) * K + H);
	const B = Math.floor(year / 4 + year);
	const J1 = Math.floor(B + I + 2 + C4 - C);
	const J2 = Math.floor(J1 % 7);
	const R = Math.floor(28 + I - J2);

	if (R >= 31) {
		return new Date(year, 2, R);
	} else {
		return new Date(year, 3, R - 31);
	}
}

export function getEasterMonday(year: number = new Date().getFullYear()): Date {
	const easter = getEaster(year);
	easter.setDate(easter.getDate() + 1);

	// console.log("Easter monday:", new Date(easter));

	return new Date(easter);
}

export function getAscension(year: number = new Date().getFullYear()): Date {
	const easter = getEaster(year);
	easter.setDate(easter.getDate() + (4 + (7 * 5)));

	// console.log("Ascension", new Date(easter));

	return new Date(easter);
}

export function getPentecost(year: number = new Date().getFullYear()): Date {
	const easter = getEaster(year);
	easter.setDate(easter.getDate() + (7 * 7) + 1);

	// console.log("Pentecost", new Date(easter));

	return new Date(easter);
}

export default function isPublicHoliday(date: Date = new Date()): boolean {
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	if (month === 0 && day === 1) {
		//* New Year
		return true;
	}

	if (month === 4 && day === 1) {
		//* May Day
		return true;
	}

	if (month === 6 && day === 21) {
		//* National day
		return true;
	}

	if (month === 7 && day === 15) {
		//* Assumption
		return true;
	}

	if (month === 10 && (day === 1 || day === 11)) {
		//* All Saints + Armistice
		return true;
	}

	if (month === 11 && day === 25) {
		//* Christmas
		return true;
	}

	const stringifyedDate = date.toDateString();

	if (
		stringifyedDate === getEasterMonday(year).toDateString() ||
		stringifyedDate === getAscension(year).toDateString() ||
		stringifyedDate === getPentecost(year).toDateString()
	) {
		//* Easter Monday + Ascension + Pentecost Monday
		return true;
	}

	return false;
}
