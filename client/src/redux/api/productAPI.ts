import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductsResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";
import { baseQueryWithAuth } from "../../utils/setAuthHeader";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProduct: builder.query<AllProductsResponse, string>({
      query: () => "/api/v1/product/latest",
      providesTags: ["product"],
    }),

    allProduct: builder.query<AllProductsResponse, string>({
      query: (id) => `/api/v1/product/admin-products?id=${id}`,
      providesTags: ["product"],
    }),

    categories: builder.query<CategoriesResponse, string>({
      query: () => `/api/v1/product/categories`,
      providesTags: ["product"],
    }),

    searchProduct: builder.query<SearchProductsResponse, SearchProductsRequest>(
      {
        query: ({ price, search, sort, category, page }) => {
          let base = `/api/v1/product/all?page=${page}`;

          if (search) base += `&search=${search}`;
          if (price) base += `&price=${price}`;
          if (sort) base += `&sort=${sort}`;
          if (category) base += `&category=${category}`;

          return base;
        },
        providesTags: ["product"],
      }
    ),

    productDetails: builder.query<ProductsResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductQuery,
  useAllProductQuery,
  useCategoriesQuery,
  useSearchProductQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
