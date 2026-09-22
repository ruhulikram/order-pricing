import React from 'react';
import { CustomerFormData, FormErrors } from '../types';

interface CustomerFormProps {
  formData: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
  errors: FormErrors;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <section className="space-y-4 pt-2">
      <div>
        <h2 className="text-base font-semibold text-neutral-900 mb-1">
          3. Customer Contact Details
        </h2>
        <p className="text-xs text-neutral-500">
          Required to prepare your order summary before dispatching to WhatsApp.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
        {/* Customer Name */}
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-neutral-800 mb-1.5"
          >
            Customer Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="e.g. Budi Santoso"
            value={formData.customerName}
            onChange={(e) => onChange('customerName', e.target.value)}
            className={`w-full h-11 min-h-[44px] px-3.5 bg-white border text-sm text-neutral-900 rounded-lg transition-colors placeholder:text-neutral-400 focus:outline-none ${
              errors.customerName
                ? 'border-red-500 focus:border-red-600'
                : 'border-neutral-300 focus:border-neutral-900'
            }`}
          />
          {errors.customerName && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.customerName}
            </p>
          )}
        </div>

        {/* Customer Phone */}
        <div>
          <label
            htmlFor="customerPhone"
            className="block text-sm font-medium text-neutral-800 mb-1.5"
          >
            WhatsApp Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            placeholder="e.g. 081234567890 or 6281234567890"
            value={formData.customerPhone}
            onChange={(e) => onChange('customerPhone', e.target.value)}
            className={`w-full h-11 min-h-[44px] px-3.5 bg-white border text-sm text-neutral-900 rounded-lg transition-colors placeholder:text-neutral-400 focus:outline-none ${
              errors.customerPhone
                ? 'border-red-500 focus:border-red-600'
                : 'border-neutral-300 focus:border-neutral-900'
            }`}
          />
          {errors.customerPhone ? (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.customerPhone}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-neutral-500">
              Must start with 08, 628, or +628 (10 to 15 digits).
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
