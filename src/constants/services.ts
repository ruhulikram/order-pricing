import { ServicePackage, AddOn } from '../types';

export const BASE_PACKAGES: ServicePackage[] = [
  {
    id: 'package_a',
    name: 'Package A (Basic Clean)',
    price: 50000,
    scope: 'Upper, midsole, and outer sole standard cleaning for daily footwear.',
  },
  {
    id: 'package_b',
    name: 'Package B (Deep Clean)',
    price: 90000,
    scope: 'Comprehensive treatment including upper, midsole, outsole, insole, laces, and deep stain removal.',
  },
];

export const EXPRESS_ADDON: AddOn = {
  id: 'express_delivery',
  name: 'Express Delivery',
  price: 25000,
  scope: 'Priority pick-up and drop-off processing within 24 hours.',
};

export const SUPABASE_SQL_SCHEMA = `-- Supabase Database Schema for Sneaker Care Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  selected_items text not null,
  total_price numeric not null,
  status text not null default 'pending',
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security
alter table public.orders enable row level security;

-- Allow anonymous inserts from the customer form
create policy "Allow anonymous inserts"
on public.orders
for insert
to anon
with check (true);

-- Allow anonymous reads for order history display
create policy "Allow anonymous reads"
on public.orders
for select
to anon
using (true);

-- Allow anonymous status updates for administrative processing
create policy "Allow anonymous updates"
on public.orders
for update
to anon
using (true)
with check (true);`;
