import { Variables } from "../../variables";

interface IService {
	id: string;
	key_language: string;
	id_main: string;
	type: string;
	disabled: string;
	id_project: string;
	name_fr: string;
	name_en: string;
	name_nl: string;
	prefix_ticket: string;
	last_incremental: string;
	char_nb_ticket: string;
	color: string;
	priority: string;
	url_icon: string;
	duration_estimated: string;
	id_room_wait: string;
	timezone: string;
	notify_display: string;
	url_icone: string;
	ref_external: string;
	maximum_waiting: string;
	schedule_main: string;
	id_rescue: string;
	id_adapted: string;
	service_is_disabled: number;
	service_is_open: boolean;
	label: string;
	array_translations: {
		en: {
			idProject: string;
			keyLang: string;
			lang: string;
			value: string
		}
	}
	is_closed_day: number;
	nbr_agent: string;
	nbTicketWait: number;
	nbTicketBusy: number;
	array_waiting_room: {
		id: string;
		key_language: string;
		id_project: string;
		label: string;
		type: string;
		id_player_checkin: string;
		route: string;
		id_floor: string;
		name_floor: string | null;
		capacity: string;
		id_waiting_room_temp: string;
		ref_external: string;
		id_bms: string
	}
	schedule: {
		0: IServiceSchedule[];
		1: IServiceSchedule[];
		2: IServiceSchedule[];
		3: IServiceSchedule[];
		4: IServiceSchedule[];
		5: IServiceSchedule[];
		6: IServiceSchedule[];
	}
	reasons: string[]
}

interface IServiceSchedule {
	hour_start: string;
	hour_end: string;
}

export default async function getServices() {
	const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php?id_project=${Variables.W_ID_PROJECT}&serial=${"0001C02F5C36"}`;

	try {
		const response = await fetch(url);

		const data = await response.json();
		console.log("🚀 ~ getServices ~ data:", data);

		if (data.array_services) {
			return data.array_services as IService[];
		}
	} catch (error) {
		console.log(error);
	}
}
