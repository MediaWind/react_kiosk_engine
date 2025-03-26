import { CSSProperties, SetStateAction } from "react";

import { eIdData } from "../core/hooks/useEId";

import { ERROR_CODE } from "./lib/errorCodes";
import { IKeyboard } from "./lib/keyboardTypes";

//* --------------------------- *//
//* JSON based types/interfaces *//
//* --------------------------- *//
export type Route = {
	name: string,
	i18n: IInternationalization
	scheduling: ISchedule,
	flows: IFlow[]
	errorManagement?: IErrorManagement
	eventManagement?: IEventManagement
};

export interface IInternationalization {
	country: COUNTRY //* setting up dynamic public holidays
	defaultLanguage: string
	languages: string[]
}

export enum COUNTRY {
	BELGIUM = "be",
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
	navigateToHomePageAfter?: number;
	ticketParameters?: ITicketParameters;
	keyboard?: IKeyboard;
	displayDate?: IDateTime;
	displayTime?: IDateTime;
	pages: IPage[];
}

export interface ITicketParameters {
	firstname?: string;
	lastname?: string;
	birthDate?: string;
	address?: string;
	zipAndCity?: string;
	nationalNumber?: string;
	email?: string;
	phone?: string;
	company?: string;
	comment?: string;
	idUserAgent?: string;
}

export interface IDateTime {
	format?: string
	style: CSSProperties
}

export interface IErrorManagement {
	genericError: IBackgroundImage;
	noPaper?: IBackgroundImage;
	notConnectedToInternet?: IBackgroundImage;
	serviceClosed?: {
		[key: string]: IBackgroundImage
	}
	eIdTimeout?: IBackgroundImage;
	unknownCard?: IBackgroundImage;
	unresponsiveCard?: IBackgroundImage;
	unreadableCard?: IBackgroundImage;
	serviceQuotaLimitExceeded?: {
		[key: string]: IBackgroundImage
	}
	//TODO: add more error options

	//? Not necessarily errors, might need some refactoring here
	eIdInserted?: IBackgroundImage;
	eIdRead?: IBackgroundImage;
}

export interface IEventManagement {
	eIdRead? : IReadPage;
}

export interface IReadPage {
	id: string;
	name: string;
	backgroundImage: IBackgroundImage;
	navigateToAfter?: ITimer
	medias?: IMedia[];
	displayDate?: IDateTime;
	displayTime?: IDateTime;
	zIndex?: number;
	actions? : {
		type: IReadActionType;
		endpoint: string;
		headers: Record<string, string>;
		body?: Record<string, string>;
	}[]
}

export enum IReadActionType {
	POST = "POST",
	PUT = "PUT",
}

export interface IPage {
	id: string;
	name: string;
	backgroundImage: IBackgroundImage;
	navigateToAfter?: ITimer
	medias?: IMedia[];
	displayDate?: IDateTime;
	displayTime?: IDateTime;
	zIndex?: number;
}

export interface ITimer {
	navigateTo: string;
	delay: number;
	printTicket?: boolean;
	service?: IService;
}

export interface IBackgroundImage {
	default: string;
	[key: string]: string;
}

export interface IMedia {
	type: MEDIA_TYPE;
	content: IVideoContent | IImageContent | IInputContent | IInputAreaContent;
}

export enum MEDIA_TYPE {
	VIDEO = "video",
	IMAGE = "image",
	INPUT = "input",
	INPUT_AREA = "inputArea",
}

export interface IVideoContent {
	name: string;
	src: string;
	type: string;
	controls?: boolean;
	styles: CSSProperties;
}

export interface IImageContent {
	name: string;
	src: string;
	animate?: ANIMATION_TYPE;
	styles: CSSProperties;
}

//TODO: use snake case instead
export enum ANIMATION_TYPE {
	RIGHTLEFT = "rightToLeft",
	BOTTOMTOP = "bottomToTop",
	TOPBOTTOM = "topToBottom",
	LEFTRIGHT = "leftToRight"
}

export interface IInputAreaContent {
	name: string;
	provider: PROVIDER;
	styles: CSSProperties;
	actions?: IInputAction[];
	filterUnavailable?: boolean;
	filterIds?: string[];
	inputsConfig?: {
		type: INPUT_TYPE;
		styles: CSSProperties;
	}
}

export interface IInputContent {
	name: string;
	type: INPUT_TYPE;
	styles: CSSProperties;
	actions?: IInputAction[];
	advancedButtonConfig?: IAdvancedButtonConfig;
	textInputConfig?: ITextInputConfig;
	selectConfig?: ISelectConfig;
}

export enum INPUT_TYPE {
	BUTTON = "button",
	ADVANCED_BUTTON = "advancedButton",
	TEXT = "text",
	NUMBER = "number",
	//TODO: replace "cardReader" by "eIdReader"?
	CARDREADER = "cardReader",
	SCANNER = "scanner",
	SELECT = "select",
}

export interface IAdvancedButtonConfig {
	backgroundImage?: IBackgroundImage;
	/**
	 * expects a language code as key
	 */
	label?: Record<string, string>;
	labelStyle?: CSSProperties;
	pressed?: {
		backgroundImage?: IBackgroundImage;
		/**
		 * expects a language code as key
		 */
		label?: Record<string, string>;
		animation?: BUTTON_ANIMATION;
		style: CSSProperties
	}
}

export enum BUTTON_ANIMATION {
	MOVE_DOWN = "moveDown",
	EMBOSSED = "embossed",
	FLIP = "flip",
	SHINE = "shine",
	ROLL = "roll",
	BOUNCE = "bounce",
}

export interface ITextInputConfig {
	textInput: IInputField;
	placeholder?: Record<string, string>;
	autoFocus?: boolean;
	textPreview?: boolean;
	forceLowerCase?: boolean;
	forceUpperCase?: boolean;
}

export interface ISelectConfig {
	provider: PROVIDER;
	placeholders?: Record<string, string>;
	options?: IOption[];
	dropdownStyles?: CSSProperties;
	optionStyles?: CSSProperties;
	filterUnavailable?: boolean;
	filterIds?: string[];
}

export enum PROVIDER {
	CUSTOM = "custom",
	USER_AGENTS = "userAgents",
	SERVICES = "services"
}

export interface IOption {
	key: string;
	label: string;
	value: string;
}

type ConditionValue = string | number | boolean;

interface Condition {
	[key: string]: ConditionValue[] | Condition[];
}

export interface IInputAction {
	type: ACTION_TYPE;
	navigateTo?: string;
	service?: IService;
	language?: string;
	id?: string;
	params?: IInputActionParams;
	onSuccess?: IInputAction[];
	onFailure?: IInputAction[];
	conditions?: Condition;
}

export interface IInputActionParams {
	nationalNumber?: boolean;
	birthDate?: boolean;
	services?: [number];
	minBeforeAppointment?: number;
	minAfterAppointment?: number;
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
	CHECKTEXTINPUTS = "checktextinputs",
	RESETCUSTOMPAGE = "resetcustompage",
	CONDITION = "condition",
}

export interface IService {
	serviceId?: number;
	serviceFlowId?: number;
	devServiceId?: number;
	devServiceFlowId?: number;
	/**
 * 1 = normal
 * 2 = high
 * 3 = urgent
 */
	priority?: 1 | 2 | 3
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
	language: string
}

export interface ITicketDataAction {
	type: TICKET_DATA_ACTION_TYPE
	payload: eIdData | IInputField | IService | boolean | string | undefined
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

export type SuperContext = {
	router: {
		state: IPage[],
		dispatcher: {
			nextPage: CallableFunction,
			previousPage: CallableFunction
			homePage: CallableFunction,
		},
	},
	language: {
		state: string,
		dispatcher: React.Dispatch<SetStateAction<string>>,
	},
	ticket: {
		state: ITicketDataState,
		dispatcher: React.Dispatch<ITicketDataAction>,
	},
	appointment: {
		state: IAppointmentState,
		dispatcher: React.Dispatch<IAppointmentAction>,
	},
	hooks: {
		useAppointment: [string, CallableFunction, CallableFunction, CallableFunction],
	},
	print: {
		state: IPrintState,
		dispatcher: React.Dispatch<IPrintAction>,
	},
	error: {
		state: IErrorState,
		dispatcher: React.Dispatch<IErrorAction>,
	},
	customAction: {
		state: {
			page: JSX.Element | undefined
			id?: string
		},
		dispatcher: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
	}
}
