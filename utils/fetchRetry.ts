import dayjs from "dayjs";
import { ERROR_ACTION_TYPE, IErrorAction } from "../interfaces";
import { ERROR_CODE } from "../lib/errorCodes";

export default async function fetchRetry(url: URL, errorDispatch?: React.Dispatch<IErrorAction>, retries = 0) {
	try {
		const response = await fetch(url);

		if (response.status !== 200 && retries < 3) {
			setTimeout(() => {
				fetchRetry(url, errorDispatch, retries++);
			}, 100);
		} else if (retries >= 3) {
			if (errorDispatch) {
				errorDispatch({
					type: ERROR_ACTION_TYPE.SETERROR,
					payload: {
						hasError: true,
						errorCode: ERROR_CODE.A429,
						message: "Too many fetch retries",
					},
				});
			} else {
				throw Error("Too many fetch retries");
			}
		} else {
			return response;
		}
	} catch (err) {
		console.log(dayjs().unix() + " - fetchRetry:30 - error: " + err);
	}
}
