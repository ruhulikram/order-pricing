export type PackageId = 'package_a' | 'package_b';

export interface ServicePackage {
  id: PackageId;
  name: string;
  price: number;
  scope: string;
}

export interface AddOn {
  id: 'express_delivery';
  name: string;
  price: number;
  scope: string;
}

export type OrderStatus = 'pending' | 'processed';

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  selected_items: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

export interface EstimatorSelection {
  basePackageId: PackageId;
  includeExpress: boolean;
}

export interface CustomerFormData {
  customerName: string;
  customerPhone: string;
}

export interface FormErrors {
  customerName?: string;
  customerPhone?: string;
}
