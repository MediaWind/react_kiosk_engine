import { IScheduleItem, Route } from "../interfaces";

import isPublicHoliday from "./publicHolidays";

export default function checkCurrentFlow(route: Route): IScheduleItem | undefined {
	const now = new Date();
	const country = route.i18n.country;

	let currentDaySchedule;

	if (isPublicHoliday(now, country)) {
		currentDaySchedule = route.scheduling.publicHolidays;
	} else {
		switch(now.getDay()) {
			case 0: currentDaySchedule = route.scheduling.sunday;
				break;
			case 1: currentDaySchedule = route.scheduling.monday;
				break;
			case 2: currentDaySchedule = route.scheduling.tuesday;
				break;
			case 3: currentDaySchedule = route.scheduling.wednesday;
				break;
			case 4: currentDaySchedule = route.scheduling.thursday;
				break;
			case 5: currentDaySchedule = route.scheduling.friday;
				break;
			case 6:
			default: currentDaySchedule = route.scheduling.saturday;
				break;
		}
	}

	if (currentDaySchedule.length === 0) {
		return undefined;
	}

	if (currentDaySchedule.length === 1) {
		return currentDaySchedule[0];
	}

	const sortedFlows = currentDaySchedule.sort((schedule1: IScheduleItem, schedule2: IScheduleItem) => {
		let schedule1Date = undefined;
		let schedule2Date = undefined;

		if (schedule1.startTime) {
			if (!schedule2.startTime) {
				return 1;
			}
			const hours = schedule1.startTime.split(":")[0];
			const minutes = schedule1.startTime.split(":")[1];
			schedule1Date = new Date();
			schedule1Date.setHours(parseInt(hours));
			schedule1Date.setMinutes(parseInt(minutes));
		}

		if (schedule2.startTime) {
			if (!schedule1.startTime) {
				return -1;
			}
			const hours = schedule2.startTime.split(":")[0];
			const minutes = schedule2.startTime.split(":")[1];
			schedule2Date = new Date();
			schedule2Date.setHours(parseInt(hours));
			schedule2Date.setMinutes(parseInt(minutes));
		}

		if (schedule1Date && schedule2Date) {
			if (schedule1Date.getTime() > schedule2Date.getTime()) {
				return 1;
			} else if (schedule1Date.getTime() < schedule2Date.getTime()) {
				return -1;
			}
		}

		return 0;
	});

	const currentFlow = sortedFlows.filter((scheduleItem) => {
		if (scheduleItem.startTime) {
			const itemTime = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${scheduleItem.startTime}`);

			if (itemTime.getTime() <= now.getTime()) {
				return scheduleItem;
			}
		}
	}).slice(-1)[0];

	if (currentFlow) {
		return currentFlow;
	} else {
		return undefined;
	}
}
