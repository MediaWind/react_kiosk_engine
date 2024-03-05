import dayjs from "dayjs";

export default async function fetchRetry(url: URL | string, retries = 0): Promise<Response | undefined> {
	let response;

	try {
		response = await fetch(url);

		if (!response.ok && retries < 3) {
			setTimeout(() => {
				fetchRetry(url, retries + 1);
			}, 100);
		} else if (retries >= 3) {
			throw new Error("Too many fetch retries");
		} else {
			return response;
		}
	} catch (err) {
		console.log(dayjs().unix() + " - fetchRetry:19 - error: " + err);
	}
}
