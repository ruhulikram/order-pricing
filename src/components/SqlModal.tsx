import React, { useState } from 'react';
import { Copy, Check, X, Database } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../constants/services';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlModal: React.FC<SqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60">
      <div className="bg-white border border-neutral-200 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-neutral-800" />
            <h3 className="font-semibold text-base text-neutral-900">
              Supabase SQL Table Schema
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <p className="text-xs text-neutral-600">
            Execute this SQL script directly in your Supabase project SQL Editor to provision the <code>orders</code> table and Row Level Security policies.
          </p>

          <div className="relative">
            <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-200 bg-neutral-50 rounded-b-lg">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium min-h-[44px] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy SQL Query</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
