import { createContext, useContext } from "react";

import { ServiceData } from "../interfaces";

type ServiceTranslation = {
	lang: string;
	value: string;
};

type ServiceScheduleSlot = {
	hour_start: string;
	hour_end: string;
};

export type ServiceCatalogItem = Omit<ServiceData, "service_is_open"> & {
	service_is_open?: boolean | number;
	array_translations?: Record<string, ServiceTranslation>;
	schedule?: Record<string, ServiceScheduleSlot[]>;
};

type ServicesCatalogContextType = {
	servicesCatalog: ServiceCatalogItem[];
	setServicesCatalog: React.Dispatch<React.SetStateAction<ServiceCatalogItem[]>>;
};

export const ServicesCatalogContext = createContext<ServicesCatalogContextType>({
	servicesCatalog: [],
	setServicesCatalog: () => [],
});

export const useServicesCatalogContext = () => useContext(ServicesCatalogContext);
