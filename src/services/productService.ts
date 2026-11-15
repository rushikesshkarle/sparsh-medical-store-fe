import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';
import type { CustomResponse } from '../types/api';
import type { Product, ProductInput, ProductListParams, ProductPage, ProductStats } from '../types/product';

/** Drop empty params so the URL stays clean (?q= is not sent when blank). */
const cleanParams = (params: ProductListParams) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== false));

/** Multipart body for create/update. On update only changed fields are sent. */
const toFormData = (input: Partial<ProductInput>): FormData => {
  const form = new FormData();
  (['name', 'description', 'price', 'stock', 'category'] as const).forEach((key) => {
    const value = input[key];
    if (value !== undefined) form.append(key, value.trim());
  });
  if (input.is_available !== undefined) form.append('is_available', String(input.is_available));
  if (input.is_out_of_stock !== undefined) form.append('is_out_of_stock', String(input.is_out_of_stock));
  if (input.image) form.append('image', input.image);
  if (input.remove_image) form.append('remove_image', 'true');
  return form;
};

export const productService = {
  // ---- Public storefront ----
  async list(params: ProductListParams = {}): Promise<ProductPage> {
    const { data } = await apiClient.get<CustomResponse<ProductPage>>(API_ENDPOINTS.PRODUCTS, {
      params: cleanParams(params),
    });
    return data.result;
  },

  async categories(): Promise<string[]> {
    const { data } = await apiClient.get<CustomResponse<string[]>>(API_ENDPOINTS.PRODUCT_CATEGORIES);
    return data.result;
  },

  // ---- Admin ----
  async adminList(params: ProductListParams = {}): Promise<ProductPage> {
    const { data } = await apiClient.get<CustomResponse<ProductPage>>(API_ENDPOINTS.ADMIN_PRODUCTS, {
      params: cleanParams(params),
    });
    return data.result;
  },

  async stats(): Promise<ProductStats> {
    const { data } = await apiClient.get<CustomResponse<ProductStats>>(API_ENDPOINTS.ADMIN_PRODUCT_STATS);
    return data.result;
  },

  async adminGet(id: string): Promise<Product> {
    const { data } = await apiClient.get<CustomResponse<Product>>(API_ENDPOINTS.ADMIN_PRODUCT(id));
    return data.result;
  },

  async create(input: ProductInput): Promise<Product> {
    const { data } = await apiClient.post<CustomResponse<Product>>(
      API_ENDPOINTS.ADMIN_PRODUCTS,
      toFormData(input),
    );
    return data.result;
  },

  async update(id: string, changes: Partial<ProductInput>): Promise<Product> {
    const { data } = await apiClient.put<CustomResponse<Product>>(
      API_ENDPOINTS.ADMIN_PRODUCT(id),
      toFormData(changes),
    );
    return data.result;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.ADMIN_PRODUCT(id));
  },
};
