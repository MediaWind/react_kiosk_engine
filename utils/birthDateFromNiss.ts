function birthDateYYYYMMDDFromNiss(nissRaw: string): string {
	const niss = nissRaw.replace(/\D/g, ""); // enlève ., -, espaces
	if (!/^\d{11}$/.test(niss)) return ""; // NISS invalide

	const yy = niss.slice(0, 2);
	let mm = parseInt(niss.slice(2, 4), 10);
	const dd = niss.slice(4, 6);
	const seq = niss.slice(6, 9);
	const check = parseInt(niss.slice(9, 11), 10);

	// Normalisation du mois (si mois encodé > 12)
	while (mm > 12) mm -= 20;
	if (mm < 1 || mm > 12) throw new Error("Invalid month in NISS");

	const mmStr = String(mm).padStart(2, "0");
	const base = parseInt(`${yy}${mmStr}${dd}${seq}`, 10);

	const check1900 = 97 - (base % 97);
	const check2000 = 97 - ((2000000000 + base) % 97);

	let yyyy: number;
	if (check === check1900) yyyy = 1900 + parseInt(yy, 10);
	else if (check === check2000) yyyy = 2000 + parseInt(yy, 10);
	else throw new Error("Invalid NISS checksum (cannot infer century)");

	// Retour STRICT "YYYY-MM-DD"
	return `${yyyy}-${mmStr}-${dd}`;
}

export default birthDateYYYYMMDDFromNiss;