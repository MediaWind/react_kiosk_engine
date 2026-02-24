import { Variables } from "../../variables";

export default function getKioskFlowURL(): URL {
	return new URL(`${Variables.DOMAINE_HTTP}/modules/Modules/KioskFlow/services/flows/findOne.php?id_project=${Variables.W_ID_FLOW}&serial=${Variables.SERIAL}&key_protect=${Variables.KEY_PLAYER}&id_easyqueue=${Variables.W_ID_PROJECT}`);
}