// ============================================================
// HOOK: Global filter state using React Context
// ============================================================

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { GlobalFilters } from '../utils/metrics';

interface FiltersCtx {
    filters: GlobalFilters;
    setFilter: (key: keyof GlobalFilters, value: string | number) => void;
    resetFilters: () => void;
}

const defaultFilters: GlobalFilters = {
    year: 2024,
    universityId: 'all',
    subject: 'all',
    candidateRegion: 'all',
    officePreference: 'all',
};

const FilterContext = createContext<FiltersCtx>({
    filters: defaultFilters,
    setFilter: () => { },
    resetFilters: () => { },
});

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);

    const setFilter = (key: keyof GlobalFilters, value: string | number) => {
        setFilters((prev) => ({ ...prev, [key]: value === 'all' ? 'all' : key === 'year' ? Number(value) : value }));
    };

    const resetFilters = () => setFilters(defaultFilters);

    return (
        <FilterContext.Provider value={{ filters, setFilter, resetFilters }
        }>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    return useContext(FilterContext);
}
