import { eIdData } from "../core/hooks/useEId";

//* --------------------------- *//
//* JSON based types/interfaces *//
//* --------------------------- *//
export type Route = {
	name: string,
	languages: LANGUAGE[],
	scheduling: ISchedule,
	flows: IFlow[]
	errorManagement?: IErrorManagement
};

export enum LANGUAGE {
	FRENCH = "fr",
	DUTCH = "nl",
	ENGLISH = "en"
}

export interface ISchedule {
	monday: IScheduleItem[],
	tuesday: IScheduleItem[],
	wednesday: IScheduleItem[],
	thursday: IScheduleItem[],
	friday: IScheduleItem[],
	saturday: IScheduleItem[],
	sunday: IScheduleItem[]
	publicHolidays: IScheduleItem[]
}

export interface IScheduleItem {
	id: string;
	startTime?: string;
}

export interface IFlow {
	id: string;
	name: string;
	homePage: string;
	keyboardLayout?: KeyboardLayout;
	navigateToHomePageAfter?: number;
	pages: IPage[];
	ticketParameters?: ITicketParameters;
	displayDate?: IDateTime;
	displayTime?: IDateTime;
}

export interface ITicketParameters {
	firstname?: string;
	lastname?: string;
	company?: string;
	phone?: string;
	email?: string;
	comment?: string;
	id_userAgent?: string;
	registre_national?: string;
}

export interface IDateTime {
	format?: string
	style: IStyles
}

export interface IErrorManagement {
	genericError: IBackgroundImage;
	noPaper?: IBackgroundImage;
	notConnectedToInternet?: IBackgroundImage;
	serviceClosed?: IBackgroundImage;
	//TODO: add more error options
}

export enum KeyboardLayout {
	CLASSIC = "classic",
	CUSTOMMADE = "customMade"
}

export interface IPage {
	id: string;
	name: string;
	backgroundImage: IBackgroundImage;
	medias?: IMedia[];
	navigateToAfter?: ITimer
}

export interface ITimer {
	navigateTo: string;
	delay: number;
	printTicket?: boolean;
	service?: IService;
}

export interface IBackgroundImage {
	default: string;
	french?: string;
	dutch?: string;
	english?: string
}

export interface IMedia {
	type: MediaType;
	content: IVideoContent | IImageContent | IInputContent;
}

export enum MediaType {
	VIDEO = "video",
	IMAGE = "image",
	INPUT = "input"
}

export interface IVideoContent {
	name: string;
	src: string;
	type: string;
	controls?: boolean;
	styles: IStyles;
}

export interface IImageContent {
	name: string;
	src: string;
	animate?: AnimationType;
	styles: IStyles;
}

export enum AnimationType {
	RIGHTLEFT = "rightToLeft",
	BOTTOMTOP = "bottomToTop",
	TOPBOTTOM = "topToBottom",
	LEFTRIGHT = "leftToRight"
}

export interface IInputContent {
	name: string;
	type: InputType;
	action: IInputAction | IInputAction[];
	placeholder?: string;
	autoFocus?: boolean;
	textInput?: IInputField;
	styles: IStyles;
}

export interface IInputAction {
	type: ActionType;
	navigateTo?: string;
	service?: IService;
	language?: LANGUAGE;
}

export enum ActionType {
	NEXTPAGE = "nextpage",
	PREVIOUSPAGE = "previouspage",
	HOMEPAGE = "homepage",
	PRINTTICKET = "printticket",
	SAVESERVICE = "saveservice",
	SAVEDATA = "savedata",
	CHANGELANGUAGE = "changelanguage",
}

export interface IService {
	serviceID: number;
	/**
 * 1 = normal
 * 2 = high
 * 3 = urgent
 */
	priority?: 1 | 2 | 3
}

export enum InputType {
	BUTTON = "button",
	TEXT = "text",
	NUMBER = "number",
	CARDREADER = "cardReader"
}

export interface IStyles {
	all?: "initial" | "inherit" | "unset" | "revert";

	top: string;
	left: string;
	bottom?: string;
	right?: string;

	width: string;
	height: string;

	padding?: string;
	margin?: string;

	borderWidth?: string;
	borderStyle?: string;
	borderColor?: string;
	borderRadius?: string;

	backgroundColor?: string;

	fontFamily?: string;
	textColor?: string;
	fontSize?: string;
	textAlign?: "left" | "right" | "center";
}

//* ------------------------- *//
//* Ticket Data State Reducer *//
//* ------------------------- *//
export interface IInputField {
	id: string;
	value: string;
	required?: boolean;
	//TODO: adapt to all possible data we might need
}

export interface ITicketDataState {
	eIdDatas: eIdData | null,
	eIdRead: boolean,
	pageIsListeningToEId: boolean,
	textInputDatas: IInputField[],
	service: IService | undefined,
	language: LANGUAGE | undefined
}

export interface ITicketDataAction {
	type: TicketDataActionType
	payload: eIdData | IInputField | IService | boolean | LANGUAGE | undefined
}

export enum TicketDataActionType {
	EIDUPDATE = "eidupdate",
	EIDLISTENINGUPDATE = "eidlisteningupdate",
	EIDREADUPDATE = "eidreadupdate",
	INPUTTEXTUPDATE = "inputtextupdate",
	SERVICEUPDATE = "serviceupdate",
	LANGUAGEUPDATE = "languageupdate",
	READYTOPRINTUPDATE = "readytoprintupdate",
	CLEARDATA = "cleardata"
}

//* ------------- *//
//* Error reducer *//
//* ------------- *//
export interface IErrorState {
	hasError: boolean;
	errorCode: ERROR_CODE;
	message: string;
}

export interface IErrorAction {
	type: ERROR_ACTION_TYPE;
	payload: IErrorState | undefined;
}

export enum ERROR_ACTION_TYPE {
	SETERROR = "setError",
	CLEARERROR = "clearError"
}

export enum ERROR_CODE {
	/**
	 * 200: All good!
	 */
	A200 = "200",
	/**
	 * 500-A: Something went wrong when trying to print ticket
	 */
	A500 = "500-A",
	/**
	 * 500-B: Something went wrong when trying to fetch ticket PDF
	 */
	B500 = "500-B",
	/**
	 * 500-C: Service is closed
	 */
	C500 = "500-C",
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
