import { eIdData } from "../core/hooks/useEId";

//* --------------------------- *//
//* JSON based types/interfaces *//
//* --------------------------- *//
export type Route = {
	name: string,
	languages: LANGUAGE[],
	scheduling: ISchedule,
	flows: IFlow[]
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
	PRINTTICKET = "printticket",
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
	all?: "initial" | "inherit" | "unset" | "revert";
	cursor?: string;

	backgroundColor?: string;
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
	//TODO: adapt to all possible data we might need
}

export interface ITicketDataState {
	eIdDatas: eIdData | null,
	eIdRead: boolean,
	pageIsListeningToEId: boolean,
	textInputDatas: IInputField[],
	service: IService | undefined,
	readyToPrint: boolean,
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
	CLEARDATA = "cleardata"
}

//* ---------------- *//
//* Error management *//
//* ---------------- *//
export enum ERROR_CODE {
	/**
	 * 200: All good!
	 */
	A200 = "200",
	/**
	 * 400-A: No user data defined
	 */
	A400 = "400-A",
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
