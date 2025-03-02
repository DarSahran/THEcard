import React from 'react';
import * as Icons from 'lucide-react';
import type { Category } from '../types/database';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectCategory(null)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
          selectedCategory === null
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        All Schemes
      </button>
      
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons];
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              selectedCategory === category.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}