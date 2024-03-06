export default async function fetchRetry(url: string | URL, init?: RequestInit, tries = 4): Promise<Response> {
	const controller = new AbortController();
	let attempt = 0;
	const fib = [1, 2];

	while (attempt <= tries) {
		try {
			const signal = controller.signal;

			const response = await fetch(url, { ...init, signal: signal, });
			if (response.ok) {
				return response;
			} else {
				throw new Error(`Request failed with status: ${response.status}`);
			}
		} catch (e) {
			if (attempt === tries) {
				controller.abort();
				throw new Error(`fetchRetry - All ${tries + 1} attempts failed.`);
			} else {
				const waitTime = fib[attempt];
				console.log(`Attempt ${attempt + 1}/${tries + 1} failed. Retrying in ${waitTime * 100}ms.`);
				console.error(e);
				await new Promise(resolve => setTimeout(resolve, waitTime * 100));
				attempt++;

				fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
			}
		}
	}

	controller.abort();
	throw new Error(`fetchRetry - All ${tries + 1} attempts failed.`);
}
