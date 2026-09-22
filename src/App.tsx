import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PackageSelector } from './components/PackageSelector';
import { CustomerForm } from './components/CustomerForm';
import { SummaryCard } from './components/SummaryCard';
import { OrderHistory } from './components/OrderHistory';
import { SqlModal } from './components/SqlModal';
import { BASE_PACKAGES, EXPRESS_ADDON } from './constants/services';
import {
  CustomerFormData,
  FormErrors,
  OrderRecord,
  PackageId,
} from './types';
import {
  fetchOrders,
  insertOrder,
  updateOrderStatus,
} from './lib/supabaseClient';

export default function App() {
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>('package_a');
  const [includeExpress, setIncludeExpress] = useState<boolean>(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: '',
    customerPhone: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccessUrl, setSubmissionSuccessUrl] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);

  // Load orders on initial mount
  const loadOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const records = await fetchOrders();
      setOrders(records);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch order history';
      setOrdersError(msg);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleFormChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const trimmedName = formData.customerName.trim();
    const trimmedPhone = formData.customerPhone.trim();

    // Name validation: min 2 chars
    if (!trimmedName) {
      errors.customerName = 'Customer name is required.';
    } else if (trimmedName.length < 2) {
      errors.customerName = 'Name must be at least 2 characters.';
    }

    // Phone validation: Indonesian prefixes (08, 628, +628), 10 to 15 digits
    if (!trimmedPhone) {
      errors.customerPhone = 'WhatsApp phone number is required.';
    } else {
      const isValidFormat = /^(\+?628|08)[0-9]{8,13}$/.test(trimmedPhone);
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      const validDigitCount = digitsOnly.length >= 10 && digitsOnly.length <= 15;

      if (!isValidFormat || !validDigitCount) {
        errors.customerPhone =
          'Enter a valid Indonesian WhatsApp number starting with 08, 628, or +628 (10 to 15 digits).';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = async (): Promise<string | null> => {
    if (!validateForm()) {
      return null;
    }

    // Step 2: Open blank tab synchronously before async tasks to avoid popup blocker
    let waTab: Window | null = null;
    try {
      waTab = window.open('about:blank', '_blank');
    } catch {
      console.warn('Popup blocked or not allowed in this environment');
    }

    setIsSubmitting(true);
    setSubmissionSuccessUrl(null);

    const selectedPkg =
      BASE_PACKAGES.find((p) => p.id === selectedPackageId) || BASE_PACKAGES[0];
    const selectedItems = includeExpress
      ? `${selectedPkg.name} + ${EXPRESS_ADDON.name}`
      : selectedPkg.name;
    const totalPrice =
      selectedPkg.price + (includeExpress ? EXPRESS_ADDON.price : 0);

    const customerName = formData.customerName.trim();
    const customerPhone = formData.customerPhone.trim();

    try {
      // Step 3: Insert order into Supabase with 4-second timeout safeguard
      const newRecord = await insertOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        selected_items: selectedItems,
        total_price: totalPrice,
        status: 'pending',
      });

      // Step 4: Construct WhatsApp message and destination URL
      const businessPhone =
        import.meta.env.VITE_BUSINESS_PHONE || '6281234567890';

      const message = [
        'Halo Admin, saya ingin memesan layanan cuci sepatu:',
        '',
        'Data Pelanggan:',
        `Nama: ${customerName}`,
        `Nomor WhatsApp: ${customerPhone}`,
        '',
        'Detail Layanan:',
        `Layanan: ${selectedItems}`,
        `Total Estimasi: Rp${totalPrice.toLocaleString('id-ID')}`,
        '',
        'Mohon konfirmasi ketersediaan jadwal penjemputan. Terima kasih.',
      ].join('\n');

      const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(
        message
      )}`;

      // Step 5: Dispatch to WhatsApp
      if (waTab && !waTab.closed) {
        waTab.location.href = whatsappUrl;
      } else {
        // Fallback if popup was blocked: present direct action button
        setSubmissionSuccessUrl(whatsappUrl);
      }

      // Step 6: Refresh local order list & reset state
      setOrders((prev) => [newRecord, ...prev.filter((o) => o.id !== newRecord.id)]);
      setSubmissionSuccessUrl(whatsappUrl);

      // Keep form inputs for easy review, or clear errors
      setFormErrors({});
      return whatsappUrl;
    } catch (err) {
      console.error('Failed to dispatch order:', err);
      if (waTab && !waTab.closed) {
        waTab.close();
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsProcessed = async (id: string) => {
    setProcessingId(id);
    try {
      await updateOrderStatus(id, 'processed');
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'processed' } : o))
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      <Header onOpenSql={() => setIsSqlModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Estimator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selections and Customer Form */}
          <div className="lg:col-span-7 space-y-6">
            <PackageSelector
              selectedPackageId={selectedPackageId}
              onSelectPackage={setSelectedPackageId}
              includeExpress={includeExpress}
              onToggleExpress={setIncludeExpress}
            />

            <CustomerForm
              formData={formData}
              onChange={handleFormChange}
              errors={formErrors}
            />
          </div>

          {/* Right Column: Sticky Summary & CTA */}
          <div className="lg:col-span-5">
            <SummaryCard
              selectedPackageId={selectedPackageId}
              includeExpress={includeExpress}
              formData={formData}
              formErrors={formErrors}
              onSubmitOrder={handleOrderSubmit}
              isSubmitting={isSubmitting}
              submissionSuccessUrl={submissionSuccessUrl}
              onClearSuccessUrl={() => setSubmissionSuccessUrl(null)}
            />
          </div>
        </div>

        {/* Order History Review Component */}
        <div className="pt-4 border-t border-neutral-200">
          <OrderHistory
            orders={orders}
            isLoading={isLoadingOrders}
            error={ordersError}
            onRetry={loadOrders}
            onMarkAsProcessed={handleMarkAsProcessed}
            processingId={processingId}
          />
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>Sneaker Care Price Estimator. Designed for instant quotes and WhatsApp order confirmation.</p>
          <p>Clean White Design System. Single Page Application.</p>
        </div>
      </footer>

      {/* SQL Schema Modal */}
      <SqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
