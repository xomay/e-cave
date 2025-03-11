import { createContext } from "react";

// Définir les types pour le contexte
interface FilterContextType {
    selectedFilters: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

// Créer le contexte avec un type par défaut
export const RegionsContext = createContext<FilterContextType>({
    selectedFilters: [],
    setSelectedFilters: () => {},
});

export const MetsContext = createContext<FilterContextType>({
    selectedFilters: [],
    setSelectedFilters: () => {},
});

export const CepagesContext = createContext<FilterContextType>({
    selectedFilters: [],
    setSelectedFilters: () => {},
});

export const MillesimeContext = createContext<FilterContextType>({
    selectedFilters: [],
    setSelectedFilters: () => {},
});

export const SearchContext = createContext<FilterContextType>({
    selectedFilters: [],
    setSelectedFilters: () => {},
});

//export const RegionsContext = createContext(null);
/*export const MetsContext = createContext<string[]>([]);
export const CepagesContext = createContext<string[]>([]);
export const CouleursContext = createContext<string[]>([]);*/