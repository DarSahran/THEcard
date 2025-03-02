import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Scheme } from '../types/database';

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.title}</h3>
      <p className="text-gray-600 mb-4">{scheme.description}</p>
      
      {scheme.eligibility && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Eligibility</h4>
          <p className="text-sm text-gray-600">{scheme.eligibility}</p>
        </div>
      )}
      
      {scheme.benefits && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900">Benefits</h4>
          <p className="text-sm text-gray-600">{scheme.benefits}</p>
        </div>
      )}
      
      {scheme.official_link && (
        <a
          href={scheme.official_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          Official Website
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      )}
    </div>
  );
}