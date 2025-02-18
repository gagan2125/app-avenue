import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
    placeFilter: string | null;
    priceFilter: { min: number; max: number } | null;
    dateFilter: string[] | null;
    totalResults: number;
    setPlaceFilter: (place: string | null) => void;
    setPriceFilter: (price: { min: number; max: number } | null) => void;
    setDateFilter: (dates: string[] | null) => void;
    setTotalResults: (total: number) => void;
    clearAllFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
    const [placeFilter, setPlaceFilter] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
    const [dateFilter, setDateFilter] = useState<string[] | null>(null);
    const [totalResults, setTotalResults] = useState<number>(0);

    const clearAllFilters = () => {
        setPlaceFilter(null);
        setPriceFilter(null);
        setDateFilter(null);
        setTotalResults(0);
    };

    return (
        <FilterContext.Provider
            value={{
                placeFilter,
                priceFilter,
                dateFilter,
                totalResults,
                setPlaceFilter,
                setPriceFilter,
                setDateFilter,
                setTotalResults,
                clearAllFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
} 