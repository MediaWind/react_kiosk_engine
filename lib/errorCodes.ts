export enum ERROR_CODE {
	/**
	 * 200: All good!
	 */
	A200 = "200",

	//? -- Bad request -- //

	/**
	 * 400-A: Ticket PDF is null
	 */
	A400 = "400-A",

	/**
	 * 400-B: No appointment key given
	 */
	B400 = "400-B",

	/**
	 * 400-C: No ticket key given
	 */
	C400 = "400-C",

	/**
	 * Service provided doesn't exist
	 */
	D400 = "400-D",

	/**
	 * 400-E: Wrong parameters
	 */
	E400 = "400-E",

	//? -- Unauthorized -- //

	/**
	 * 401-A: Wrong user
	 */
	A401 = "401-A",

	//? -- Not found -- //

	/**
	 * 404-A: Flow not found
	 */
	A404 = "404-A",

	/**
	 * 404-B: Appointment not found
	 */
	B404 = "404-B",

	/**
	 * 404-C: Ticket not found
	 */
	C404 = "404-B",

	/**
	 * 404-D: Service secretariat not found
	 */
	D404= "404-D",

	/**
	 * 404-E: Desk not found
	 */
	E404 = "404-E",

	/**
	 * 404-F: Service not found
	 */
	F404 = "404-F",

	/**
	 * 404-G: No waiting room found
	 */
	G404 = "404-G",

	/**
	 * 404-H: Agent not found
	 */
	H404 = "404-H",

	//? -- Request time out -- //

	/**
	 * 408-A: eId reading timeout
	 */
	A408 = "408-A",

	//? -- Conflict -- //

	/**
	 * 409-A: Serveral tickets for ref external
	 */
	A409 = "409-A",

	/**
	 * 409-B: Desk is busy
	 */
	B409 = "409-B",

	/**
	 * 409-C: Appointment cancelled
	 */
	C409 = "409-C",

	//? -- Too many requests -- //

	/**
	 * 429-A: Troo many retries
	 */
	A429 = "429-A",

	//? -- Internal server error --//

	/**
	 * 500-A: Something went wrong when trying to print ticket
	 */
	A500 = "500-A",

	/**
	 * 500-B: Something went wrong when trying to fetch ticket PDF
	 */
	B500 = "500-B",

	/**
	 * 500-C: Service closed
	 */
	C500 = "500-C",

	/**
	 * 500-D: Something went wrong when trying to fetch agents
	 */
	D500 = "500-D",

	//? -- Service unavailable/hardware errors -- //

	/**
	 * 503-A: Kiosk is not connected to internet
	 */
	A503 = "503-A",

	/**
	 * 503-B: Printer is not connected
	 */
	B503 = "503-B",

	/**
	 * 503-C: Printer has no more paper
	 */
	C503 = "503-C",

	/**
	 * 503-D: Printer has an unsupported error
	 */
	D503 = "503-D"
}