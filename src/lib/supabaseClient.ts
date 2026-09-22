import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderRecord, OrderStatus } from '../types';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check whether legitimate credentials exist (not empty, not placeholder)
export const isConfigured = Boolean(
  envUrl &&
  envAnonKey &&
  !envUrl.includes('xyzcompany') &&
  envUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(envUrl, envAnonKey)
  : null;

const LOCAL_STORAGE_KEY = 'sneaker_care_orders_v1';

// In-memory fallback / localStorage persistence for unconfigured environments
function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save order to localStorage', err);
  }
}

// Timeout helper with 4-second cutoff safeguard using PromiseLike
async function withTimeout<T>(promiseLike: PromiseLike<T>, ms = 4000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([Promise.resolve(promiseLike), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function fetchOrders(): Promise<OrderRecord[]> {
  if (supabase) {
    try {
      const response = await withTimeout(
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }),
        4000
      );

      if (response.error) {
        throw response.error;
      }
      return (response.data || []) as OrderRecord[];
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local records:', err);
      return getLocalOrders();
    }
  }

  // Local storage mode
  return getLocalOrders();
}

export async function insertOrder(
  payload: Omit<OrderRecord, 'id' | 'created_at'>
): Promise<OrderRecord> {
  const fallbackRecord: OrderRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `order_${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const response = await withTimeout(
        supabase
          .from('orders')
          .insert([
            {
              customer_name: payload.customer_name,
              customer_phone: payload.customer_phone,
              selected_items: payload.selected_items,
              total_price: payload.total_price,
              status: payload.status,
            },
          ])
          .select()
          .single(),
        4000
      );

      if (response.error) {
        throw response.error;
      }
      if (response.data) {
        return response.data as OrderRecord;
      }
    } catch (err) {
      console.warn('Supabase insert timed out or failed, recording locally:', err);
      // Even if network fails, persist to local storage so user record is not lost
      const current = getLocalOrders();
      const updated = [fallbackRecord, ...current];
      saveLocalOrders(updated);
      return fallbackRecord;
    }
  }

  // Local storage mode
  const current = getLocalOrders();
  const updated = [fallbackRecord, ...current];
  saveLocalOrders(updated);
  return fallbackRecord;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<void> {
  if (supabase) {
    try {
      const response = await withTimeout(
        supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId),
        4000
      );

      if (response.error) throw response.error;
    } catch (err) {
      console.warn('Supabase update failed, updating locally:', err);
    }
  }

  // Always sync local storage copy
  const current = getLocalOrders();
  const updated = current.map((item) =>
    item.id === orderId ? { ...item, status: newStatus } : item
  );
  saveLocalOrders(updated);
}
