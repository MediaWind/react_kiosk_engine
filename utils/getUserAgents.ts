import { Variables } from "../../variables";

export default async function getUserAgents() {
	const agents: IAgent[] = [];
	const url = `${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/listUserAgent.php?id_project=${Variables.W_ID_PROJECT}&serial=${Variables.SERIAL}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log("🚀 ~ file: getUserAgents.ts:10 ~ getUserAgents ~ data:", data);

		if (data.status == 1) {
			data.userAgent.forEach((agent: AgentDatas) => {
				agents.push({
					id: agent.id_user,
					firstname: agent.name.firstname,
					lastname: agent.name.lastname,
				} as IAgent);
			});

			return agents;
		}
	} catch (err) {
		console.log(err);
	}
}

type AgentDatas = {
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

interface IAgent {
	id: string
	firstname: string
	lastname: string
}
