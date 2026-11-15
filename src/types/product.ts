export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  /** Staff switched it off ("out of stock") without changing the count. */
  is_out_of_stock: boolean;
  /** Orderable: stock > 0 and not switched off. */
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc';
export type ProductStatus = 'all' | 'live' | 'hidden' | 'low_stock';

export interface ProductListParams {
  q?: string;
  category?: string;
  page?: number;
  page_size?: number;
  sort?: ProductSort;
  /** Public listing: hide sold-out products. */
  in_stock?: boolean;
  /** Admin listing only. */
  status?: ProductStatus;
}

export interface ProductStats {
  total: number;
  live: number;
  hidden: number;
  low_stock: number;
  out_of_stock: number;
}

/** What the admin product form submits. */
export interface ProductInput {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  is_available: boolean;
  is_out_of_stock: boolean;
  image: File | null;
  remove_image: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
