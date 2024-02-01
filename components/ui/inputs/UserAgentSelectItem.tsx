import styles from "../../../styles/ui/UserAgentSelect.module.scss";

import { AgentData } from "../../../interfaces";

interface IUserAgentSelectItemProps {
	agent: AgentData
	onSelect: CallableFunction
	borderColor?: string
}

export default function UserAgentSelectItem(props: IUserAgentSelectItemProps): JSX.Element {
	const { agent, onSelect, borderColor, } = props;

	function clickHandler() {
		onSelect(agent);
	}

	return (
		<div className={styles.item} style={{ borderColor: borderColor ?? "#000000", }} onClick={clickHandler}>
			<p>{agent.name.firstname} {agent.name.lastname}</p>
		</div>
	);
}
