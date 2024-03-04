import { eIdData } from "../core/hooks/useEId";

import { ERROR_CODE } from "./lib/errorCodes";
import { IKeyboard } from "./lib/keyboardTypes";

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
	ENGLISH = "en",
	SPANISH = "es"
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
	keyboard?: IKeyboard;
	navigateToHomePageAfter?: number;
	pages: IPage[];
	ticketParameters?: ITicketParameters;
	displayDate?: IDateTime;
	displayTime?: IDateTime;
}

export interface ITicketParameters {
	firstname?: string;
	lastname?: string;
	nationalNumber?: string;
	email?: string;
	phone?: string;
	company?: string;
	comment?: string;
	idUserAgent?: string;
}

export interface IDateTime {
	format?: string
	style: IStyles
}

export interface IErrorManagement {
	genericError: IBackgroundImage;
	noPaper?: IBackgroundImage;
	notConnectedToInternet?: IBackgroundImage;
	serviceClosed?: {
		[key: string]: IBackgroundImage
	}
	eIdTimeout?: IBackgroundImage;
	//TODO: add more error options

	//? Not necessarily errors, might need some refactoring here
	eIdInserted?: IBackgroundImage;
	eIdRead?: IBackgroundImage;
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
	spanish?: string;
}

export interface IMedia {
	type: MEDIA_TYPE;
	content: IVideoContent | IImageContent | IInputContent;
}

export enum MEDIA_TYPE {
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
	animate?: ANIMATION_TYPE;
	styles: IStyles;
}

export enum ANIMATION_TYPE {
	RIGHTLEFT = "rightToLeft",
	BOTTOMTOP = "bottomToTop",
	TOPBOTTOM = "topToBottom",
	LEFTRIGHT = "leftToRight"
}

export interface IInputContent {
	name: string;
	type: INPUT_TYPE;
	actions: IInputAction[];
	styles: IStyles;
	textInputConfig?: ITextInputConfig;
	selectConfig?: ISelectConfig;
}

export enum INPUT_TYPE {
	BUTTON = "button",
	TEXT = "text",
	NUMBER = "number",
	CARDREADER = "cardReader",
	QRCODE = "qrCode",
	SELECT = "select",
}

export interface ITextInputConfig {
	textInput: IInputField
	placeholder?: Record<LANGUAGE, string>
	autoFocus?: boolean
	textPreview?: boolean
	forceLowerCase?: boolean
	forceUpperCase?: boolean
}

export interface ISelectConfig {
	provider: SELECT_PROVIDER;
	placeholders?: Record<LANGUAGE, string>;
	options?: IOption[];
	dropdownStyles?: IStyles;
	optionStyles?: IStyles;
	filterUnavailable?: boolean;
	filterIds?: string[];
}

export enum SELECT_PROVIDER {
	CUSTOM = "custom",
	USER_AGENTS = "userAgents",
	SERVICES = "services"
}

export interface IOption {
	key: string;
	label: string;
	value: string;
}

export interface IInputAction {
	type: ACTION_TYPE;
	navigateTo?: string;
	service?: IService;
	language?: LANGUAGE;
}

export enum ACTION_TYPE {
	NEXTPAGE = "nextpage",
	PREVIOUSPAGE = "previouspage",
	HOMEPAGE = "homepage",
	PRINTTICKET = "printticket",
	CREATETICKET = "createticket",
	SAVESERVICE = "saveservice",
	CHANGELANGUAGE = "changelanguage",
	CHECKIN = "checkin",
	CHECKOUT = "checkout",
	CUSTOM = "custom",
	CHECKTEXTINPUTS = "checktextinputs"
}

export interface IService {
	serviceId: number;
	devServiceId?: number;
	/**
 * 1 = normal
 * 2 = high
 * 3 = urgent
 */
	priority?: 1 | 2 | 3
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
	opacity?: number;

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
}

export interface ITicketDataState {
	eIdDatas: eIdData | null,
	textInputDatas: IInputField[],
	service: IService | undefined,
	language: LANGUAGE | undefined
}

export interface ITicketDataAction {
	type: TICKET_DATA_ACTION_TYPE
	payload: eIdData | IInputField | IService | boolean | LANGUAGE | undefined
}

export enum TICKET_DATA_ACTION_TYPE {
	EIDUPDATE = "eidupdate",
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
	errorServiceId?: string
}

export interface IErrorAction {
	type: ERROR_ACTION_TYPE;
	payload?: IErrorState;
}

export enum ERROR_ACTION_TYPE {
	SETERROR = "setError",
	CLEARERROR = "clearError"
}

//* ------------------- *//
//* Appointment Reducer *//
//* ------------------- *//
export interface IAppointmentState {
	isCheckingIn: boolean
	isCheckingOut: boolean
	isCheckedIn: boolean
	isCheckedOut: boolean
}

export interface IAppointmentAction {
	type: APPOINTMENT_ACTION_TYPE
	payload?: boolean
}

export enum APPOINTMENT_ACTION_TYPE {
	UPDATECHECKINGIN = "updateCheckIn",
	UPDATECHECKINGOUT = "updateCheckOut",
	UPDATECHECKEDIN = "updateCheckedIn",
	UPDATECHECKEDOUT = "updateCheckedOut",
	CLEARALL = "clearAll",
}

//* --------------- *//
//* Printer reducer *//
//* --------------- *//
export interface IPrintState {
	ticketPDF: string | null
	ticketCreationRequested: boolean
	printRequested: boolean
}

export interface IPrintAction {
	type: string
	payload?: boolean | string | null
}

export enum PRINT_ACTION_TYPE {
	REQUESTPRINT = "requestPrint",
	REQUESTTICKETCREATION = "requestTicketCreation",
	UPDATETICKETPDF = "updateTicketPDF",
	CLEARALL = "clearAll",
}

//* ------ *//
//* Agents *//
//* ------ *//
export type AgentData = {
	cannot_select_desk: string
	id_desk: string
	id_project: string
	id_user: string
	id_user_create: string
	name: {
		account_spoc: string
		admin_account: string
		admin_financials: string
		admin_server: string
		auto_pause: string
		cloud_login: string
		company: string
		custom_editable: string
		dateCreate: string
		dateModif: string
		default: string
		disable_cloud_login: string
		disable_third_autologin: string
		email: string
		email_reporting: string
		firstname: string
		function: string
		id: string
		id_account: string
		id_company: string
		id_group: string
		id_user: string
		id_userCloudCreate: string
		id_userCreate: string
		id_userModif: string
		id_user_cloud: string
		language: string
		lastDateActivity: string
		lastname: string
		ldap: string
		login: string
		mobile: string
		monitoring: string
		office365_uid: string
		only_cloud_login: string
		password_type: string
		phone: string
		ref_external: string
		root_restricted: string
		status: string
		timezone: string
		url_picture: string
		ws_enabled: string
	}
	notify_display: string
	notify_email: string
	notify_sms: string
	ref_external: string
	services_restricted: string
	type: string
	url_ics_availibility: string
	url_ics_no_availibility: string
	use_group: string
}

//* -------- *//
//* Services *//
//* -------- *//
export type ServiceData = {
	id: string,
	key_language: string,
	id_main: string,
	type: string,
	disabled: string,
	id_project: string,
	name_fr: string,
	name_en: string,
	name_nl: string,
	prefix_ticket: string,
	last_incremental: string,
	char_nb_ticket: string,
	color: string,
	priority: string,
	url_icon: string,
	duration_estimated: string,
	id_room_wait: string,
	timezone: string,
	notify_display: string,
	url_icone: string,
	ref_external: string,
	maximum_waiting: string,
	schedule_main: string,
	id_rescue: string,
	id_adapted: string,
	service_is_disabled: number,
	service_is_open: boolean,
	label: string,
	is_closed_day: number,
	nbr_agent: string,
	nbTicketWait: number,
	nbTicketBusy: number,
	array_waiting_room: {
		id: string,
		key_language: string,
		id_project: string,
		label: string,
		type: string,
		id_player_checkin: string,
		route: string,
		id_floor: string,
		name_floor: string | null,
		capacity: string,
		id_waiting_room_temp: string,
		ref_external: string,
		id_bms: string
	}
}
