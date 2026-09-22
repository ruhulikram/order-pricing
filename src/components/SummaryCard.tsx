import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { BASE_PACKAGES, EXPRESS_ADDON } from '../constants/services';
import { CustomerFormData, FormErrors, PackageId } from '../types';

interface SummaryCardProps {
  selectedPackageId: PackageId;
  includeExpress: boolean;
  formData: CustomerFormData;
  formErrors: FormErrors;
  onSubmitOrder: () => Promise<string | null>;
  isSubmitting: boolean;
  submissionSuccessUrl: string | null;
  onClearSuccessUrl: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  selectedPackageId,
  includeExpress,
  formData,
  formErrors,
  onSubmitOrder,
  isSubmitting,
  submissionSuccessUrl,
  onClearSuccessUrl,
}) => {
  const selectedPackage =
    BASE_PACKAGES.find((p) => p.id === selectedPackageId) || BASE_PACKAGES[0];

  const expressPrice = includeExpress ? EXPRESS_ADDON.price : 0;
  const totalPrice = selectedPackage.price + expressPrice;

  return (
    <aside className="bg-white border border-neutral-200 rounded-lg p-6 lg:sticky lg:top-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Order Summary & Estimate
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Transparent breakdown before forwarding to staff.
        </p>
      </div>

      {/* Itemized list */}
      <div className="space-y-3 py-3 border-y border-neutral-200 text-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-neutral-900">{selectedPackage.name}</p>
            <p className="text-xs text-neutral-500">Base cleaning service</p>
          </div>
          <span className="font-semibold text-neutral-900 shrink-0">
            Rp{selectedPackage.price.toLocaleString('id-ID')}
          </span>
        </div>

        {includeExpress ? (
          <div className="flex items-start justify-between gap-2 pt-2 border-t border-dashed border-neutral-200">
            <div>
              <p className="font-medium text-neutral-900">{EXPRESS_ADDON.name}</p>
              <p className="text-xs text-neutral-500">Priority 24-hour turnaround</p>
            </div>
            <span className="font-semibold text-neutral-900 shrink-0">
              +Rp{EXPRESS_ADDON.price.toLocaleString('id-ID')}
            </span>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2 pt-2 border-t border-dashed border-neutral-200 text-neutral-400">
            <div>
              <p className="font-normal text-xs">{EXPRESS_ADDON.name}</p>
              <p className="text-xs">Standard queue turnaround</p>
            </div>
            <span className="text-xs font-normal">Rp0</span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 block">
          Total Estimated Price
        </span>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-3xl font-semibold text-neutral-900">
            Rp{totalPrice.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            (IDR Net)
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmitOrder}
          className="w-full h-11 min-h-[44px] px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Recording Order...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Order to WhatsApp</span>
            </>
          )}
        </button>

        {submissionSuccessUrl && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 space-y-2">
            <div className="flex items-center gap-1.5 font-medium text-neutral-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Order recorded in database.</span>
            </div>
            <p className="text-neutral-600">
              If your browser prevented the chat tab from launching automatically, click below:
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={submissionSuccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium"
              >
                <span>Open WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onClearSuccessUrl}
                className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Operational Assurance */}
      <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
          <span>Transparent upfront pricing</span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
          <span>Orders logged before chat dispatch</span>
        </p>
      </div>
    </aside>
  );
};
