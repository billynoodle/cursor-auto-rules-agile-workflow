import React, { useState, useEffect, useRef } from 'react';
import './CountrySelector.css';

interface Country {
  code: string;
  name: string;
  region: string;
  flag: string;
}

interface CountrySelectorProps {
  onSelect: (countryCode: string) => void;
  selectedCountry?: string;
}

// Sample countries data - in a real app, this would be fetched from an API
const countries: Country[] = [
  { code: 'US', name: 'United States', region: 'North America', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', region: 'North America', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', region: 'Oceania', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania', flag: '🇳🇿' },
  { code: 'DE', name: 'Germany', region: 'Europe', flag: '🇩🇪' },
  { code: 'FR', name: 'France', region: 'Europe', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', region: 'Europe', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', region: 'Europe', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', region: 'Asia', flag: '🇯🇵' },
  // Add more countries as needed
];

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  onSelect,
  selectedCountry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onSelect(filteredCountries[highlightedIndex].code);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSearchFocus = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleCountryClick = (countryCode: string) => {
    onSelect(countryCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  return (
    <div className="country-selector" ref={dropdownRef}>
      <label htmlFor="country-search" className="country-label">
        Select Country
      </label>
      <div className="search-container">
        <div
          className="selected-country"
          onClick={() => {
            setIsOpen(!isOpen);
            searchInputRef.current?.focus();
          }}
        >
          {selectedCountryData ? (
            <>
              <span className="country-flag">{selectedCountryData.flag}</span>
              <span className="country-name">{selectedCountryData.name}</span>
            </>
          ) : (
            <span className="placeholder">Select a country</span>
          )}
        </div>
        {isOpen && (
          <div className="dropdown-container" onKeyDown={handleKeyDown}>
            <input
              ref={searchInputRef}
              type="text"
              id="country-search"
              className="country-search"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleSearchFocus}
              aria-expanded={isOpen}
              aria-controls="country-list"
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `country-${filteredCountries[highlightedIndex].code}`
                  : undefined
              }
            />
            <div className="country-list" id="country-list" role="listbox">
              {Object.entries(groupedCountries).map(([region, countries]) => (
                <div key={region} className="region-group">
                  <div className="region-header">{region}</div>
                  {countries.map((country, index) => (
                    <div
                      key={country.code}
                      className={`country-option ${
                        highlightedIndex === index ? 'highlighted' : ''
                      } ${selectedCountry === country.code ? 'selected' : ''}`}
                      onClick={() => handleCountryClick(country.code)}
                      role="option"
                      aria-selected={selectedCountry === country.code}
                      id={`country-${country.code}`}
                    >
                      <span className="country-flag">{country.flag}</span>
                      <span className="country-name">{country.name}</span>
                      <span className="country-code">({country.code})</span>
                    </div>
                  ))}
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className="no-results">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 