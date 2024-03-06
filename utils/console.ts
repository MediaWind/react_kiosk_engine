import dayjs from "dayjs";

interface IOptions {
	fileName?: string;
	functionName?: string;
	lineNumber?: number;
	cssRules?: string
	clear?: boolean
}

export class Console {
	static standardizedMessage(options?: IOptions): string {
		let message = dayjs().format("YYYY-MM-DD HH:mm:ss");

		if (options?.fileName) {
			message += ` ~ ${options?.fileName}`;
		}

		if (options?.functionName) {
			message += `:${options?.functionName}`;
		}

		if (options?.lineNumber) {
			message += `::${options?.lineNumber}`;
		}

		message += " -";
		return message;
	}

	static log(value: any, options?: IOptions): void {
		if (options?.clear) {
			console.clear();
		}

		if (options?.cssRules) {
			console.log(`%c${this.standardizedMessage(options)}`, options.cssRules, value);
		} else {
			if (typeof value === "object") {
				console.dir(this.standardizedMessage(options), value);
			} else {
				console.log(this.standardizedMessage(options), value);
			}
		}
	}

	static warn(value: any, options?: IOptions): void {
		if (options?.clear) {
			console.clear();
		}

		if (options?.cssRules) {
			console.warn(`%c${this.standardizedMessage(options)}`, options.cssRules, value);
		} else {
			console.warn(this.standardizedMessage(options), value);
		}
	}

	static error(value: any, options?: IOptions): void {
		if (options?.clear) {
			console.clear();
		}

		if (options?.cssRules) {
			console.error(`%c${this.standardizedMessage(options)}`, options.cssRules, value);
		} else {
			console.error(this.standardizedMessage(options), value);
		}
	}

	static info(value: any, options?: IOptions): void {
		if (options?.clear) {
			console.clear();
		}

		if (options?.cssRules) {
			console.info(`%c${this.standardizedMessage(options)}`, options.cssRules, value);
		} else {
			console.info(this.standardizedMessage(options), value);
		}
	}
}
