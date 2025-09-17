// lib/api.js
import axios from "axios";
import { z } from "zod";

// Define base instance with env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// schema (based on API)
const VideoSchema = z.object({
  id: z.number(),
  match_id: z.number(),
  title: z.string(),
  category: z.string(),
  match_date: z.string(),
  league: z.string(),
  video_url: z.string(),
  country: z.string(),
  thumbnail: z.string(),
});

// backend has `metadata`, not `pagination`
const PaginatedResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(VideoSchema),
  metadata: z.object({
    total_items: z.number(),
    page: z.number(),
    pageSize: z.number(),
    total_pages: z.number(),
    has_previous: z.boolean(),
    has_next: z.boolean(),
    previous_page: z.number().nullable(),
    next_page: z.number().nullable(),
  }),
});

const SearchResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    query: z.string().optional(),
    filters: z.object({
      q: z.string().optional(),
      league: z.array(z.any()),
      team: z.array(z.any()),
      category: z.array(z.any()),
      location: z.array(z.any()),
      limit: z.number(),
      offset: z.number(),
    }),
    results: z.array(VideoSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
    }),
  }),
});

// --- Filter Options ---
const FilterOptionsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    type: z.string(),
    query: z.string(),
    options: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    ),
    total: z.number(),
  }),
});

// Reusable fetch function
export async function fetchFromApi({
  endpoint,
  params = {},
  schema = PaginatedResponseSchema,
}) {
  try {
    const res = await api.get(endpoint, { params });

    // ✅ Handle /search
    if (endpoint === "/search") {
      const parsed = SearchResponseSchema.parse(res.data);
      return {
        data: parsed.data.results,
        metadata: {
          total_items: parsed.data.pagination.total,
          page: parsed.data.pagination.page,
          pageSize: parsed.data.pagination.limit,
          total_pages: Math.ceil(
            parsed.data.pagination.total / parsed.data.pagination.limit
          ),
          has_previous: parsed.data.pagination.page > 1,
          has_next:
            parsed.data.pagination.page <
            Math.ceil(
              parsed.data.pagination.total / parsed.data.pagination.limit
            ),
          previous_page:
            parsed.data.pagination.page > 1
              ? parsed.data.pagination.page - 1
              : null,
          next_page:
            parsed.data.pagination.page <
            Math.ceil(
              parsed.data.pagination.total / parsed.data.pagination.limit
            )
              ? parsed.data.pagination.page + 1
              : null,
        },
      };
    }

    // ✅ Handle /filter-options
    if (endpoint === "/filter-options") {
      const parsed = FilterOptionsResponseSchema.parse(res.data);

      // normalize: return array of options
      return {
        available: parsed.data.total > 0,
        options: parsed.data.options,
        type: parsed.data.type,
      };
    }

    // ✅ Normal case (videos, categories)
    return schema.parse(res.data);
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw new Error(`Failed to fetch from ${endpoint}`);
  }
}

// Login response schema

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    status: z.string(),
    msisdn: z.string(),
    subscriber_id: z.number().optional().nullable(),
    start_time: z.string().nullable().optional(),
    end_time: z.string().nullable().optional(),
    session_token: z.string().nullable().optional(),
    session_expires_at: z.string().nullable().optional(),
    is_first_time: z.boolean().optional(),
    remaining_seconds: z.number().optional(),
    carrier: z.string().optional(),
    subscription_link: z.string().optional(),
  }),
  server_time: z.string().nullable().optional(),
});

export async function loginApi(phoneNumber) {
  try {
    const res = await api.post("/auth/login", { msisdn: phoneNumber });
    return LoginResponseSchema.parse(res.data);
  } catch (err) {
    console.error("Login Error:", err);
    throw new Error("Login request failed");
  }
}
