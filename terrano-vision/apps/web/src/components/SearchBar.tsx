import React from 'react';
import { useAppStore } from '../stores/appStore';
import { Search, X } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useAppStore();

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          placeholder="Rechercher une chaîne ou un groupe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10 pr-10 w-full"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
