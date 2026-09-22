import React from 'react';
import { RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderHistoryProps {
  orders: OrderRecord[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onMarkAsProcessed: (id: string) => Promise<void>;
  processingId: string | null;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  isLoading,
  error,
  onRetry,
  onMarkAsProcessed,
  processingId,
}) => {
  return (
    <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Order Review & History Log
          </h2>
          <p className="text-xs text-neutral-500">
            Internal record log for shop staff to track and update order fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-50 min-h-[36px] self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* State 1: Loading State */}
      {isLoading && (
        <div className="space-y-3 py-4">
          <div className="bg-neutral-200 animate-pulse rounded h-6 my-2 w-full" />
          <div className="bg-neutral-200 animate-pulse rounded h-6 my-2 w-full" />
          <div className="bg-neutral-200 animate-pulse rounded h-6 my-2 w-full" />
        </div>
      )}

      {/* State 2: Error State */}
      {!isLoading && error && (
        <div className="border border-neutral-200 bg-neutral-50 rounded-lg p-6 text-center space-y-3">
          <p className="text-sm text-neutral-800 font-medium">{error}</p>
          <p className="text-xs text-neutral-500">
            Could not retrieve orders from the database. Please verify your connection or database credentials.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 min-h-[44px]"
          >
            Retry Fetching Orders
          </button>
        </div>
      )}

      {/* State 3: Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="border border-dashed border-neutral-200 bg-neutral-50 rounded-lg p-8 text-center text-neutral-500 space-y-1">
          <p className="text-sm font-medium text-neutral-700">
            No orders have been placed yet
          </p>
          <p className="text-xs text-neutral-500">
            Use the estimator above to submit your first order.
          </p>
        </div>
      )}

      {/* State 4: Data State */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">WhatsApp Phone</th>
                <th className="py-3 px-4">Selected Services</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.map((order) => {
                const isPending = order.status === 'pending';
                const isItemProcessing = processingId === order.id;

                let formattedDate = 'Recent';
                try {
                  const d = new Date(order.created_at);
                  formattedDate = d.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                } catch {
                  formattedDate = order.created_at;
                }

                return (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-neutral-500 whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-900">
                      {order.customer_name}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 font-mono text-xs">
                      {order.customer_phone}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 text-xs">
                      {order.selected_items}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 whitespace-nowrap">
                      Rp{Number(order.total_price).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-200 text-neutral-800 border border-neutral-300">
                          <Clock className="w-3 h-3 text-neutral-600" />
                          <span>pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                          <CheckCircle2 className="w-3 h-3 text-neutral-600" />
                          <span>processed</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isPending ? (
                        <button
                          type="button"
                          disabled={isItemProcessing}
                          onClick={() => onMarkAsProcessed(order.id)}
                          className="h-11 min-h-[44px] px-3.5 text-xs font-medium text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:border-neutral-400 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {isItemProcessing ? 'Updating...' : 'Mark as Processed'}
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400 font-medium px-2 py-1">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
