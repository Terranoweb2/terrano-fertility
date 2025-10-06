import React from 'react';
import { useAppStore } from '../stores/appStore';
import { clsx } from 'clsx';

interface FilterBarProps {
  groups: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ groups }) => {
  const { selectedGroup, setSelectedGroup } = useAppStore();

  const filters = [
    { id: null, label: 'Tous', count: null },
    { id: 'favorites', label: 'Favoris', count: null },
    { id: 'recent', label: 'Récents', count: null },
    ...groups.map(group => ({ id: group, label: group, count: null }))
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id || 'all'}
          onClick={() => setSelectedGroup(filter.id)}
          className={clsx(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedGroup === filter.id
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
