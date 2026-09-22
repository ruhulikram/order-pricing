import React from 'react';
import { Check } from 'lucide-react';
import { BASE_PACKAGES, EXPRESS_ADDON } from '../constants/services';
import { PackageId } from '../types';

interface PackageSelectorProps {
  selectedPackageId: PackageId;
  onSelectPackage: (id: PackageId) => void;
  includeExpress: boolean;
  onToggleExpress: (val: boolean) => void;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackageId,
  onSelectPackage,
  includeExpress,
  onToggleExpress,
}) => {
  return (
    <section className="space-y-6">
      {/* Base Packages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-neutral-900">
            1. Select Base Cleaning Package
          </h2>
          <span className="text-xs text-neutral-500 font-normal">
            Choose exactly one package
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BASE_PACKAGES.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <div
                key={pkg.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectPackage(pkg.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPackage(pkg.id);
                  }
                }}
                className={`flex flex-col justify-between p-5 rounded-lg cursor-pointer transition-colors min-h-[44px] ${
                  isSelected
                    ? 'bg-neutral-50 border-2 border-neutral-900 text-neutral-900'
                    : 'bg-white border border-neutral-200 text-neutral-900 hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base text-neutral-900">
                      {pkg.name}
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {pkg.scope}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/70 flex items-baseline justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Package Price
                  </span>
                  <span className="text-lg font-bold text-neutral-900">
                    Rp{pkg.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Add-on */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-neutral-900">
            2. Optional Add-on Service
          </h2>
          <span className="text-xs text-neutral-500 font-normal">
            Optional priority handling
          </span>
        </div>

        <div
          role="checkbox"
          tabIndex={0}
          aria-checked={includeExpress}
          onClick={() => onToggleExpress(!includeExpress)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleExpress(!includeExpress);
            }
          }}
          className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-lg cursor-pointer transition-colors min-h-[44px] gap-4 ${
            includeExpress
              ? 'bg-neutral-50 border-2 border-neutral-900 text-neutral-900'
              : 'bg-white border border-neutral-200 text-neutral-900 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                includeExpress
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              {includeExpress && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-neutral-900">
                  {EXPRESS_ADDON.name}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-neutral-200 text-neutral-800">
                  24 Hours
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                {EXPRESS_ADDON.scope}
              </p>
            </div>
          </div>

          <div className="text-right sm:shrink-0">
            <span className="text-base font-bold text-neutral-900">
              +Rp{EXPRESS_ADDON.price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
