import React from 'react';
import { Database, Copy, Check, FileText } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../constants/services';
import { isConfigured } from '../lib/supabaseClient';

interface HeaderProps {
  onOpenSql: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSql }) => {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Sneaker Care Price Estimator
            </h1>
            <p className="mt-1 text-sm sm:text-base text-neutral-600">
              Select cleaning packages, calculate accurate costs in real time, and confirm pickup directly on WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-700">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-500' : 'bg-neutral-400'
                }`}
              />
              <span>{isConfigured ? 'Supabase Connected' : 'Local Storage Mode'}</span>
            </div>

            <button
              type="button"
              onClick={onOpenSql}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 min-h-[36px]"
              title="View Supabase SQL schema"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              <span>SQL Schema</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
