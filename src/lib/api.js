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

// Reusable fetch function
export async function fetchFromApi({
  endpoint,
  params = {},
  schema = PaginatedResponseSchema,
}) {
  try {
    const res = await api.get(endpoint, { params });
    return schema.parse(res.data);
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw new Error(`Failed to fetch from ${endpoint}`);
  }
}

// Login response schema

const BaseDataSchema = z.object({
  status: z.string(), // ✅ accept ANY status from backend
  msisdn: z.string(),
  is_first_time: z.boolean(),
  remaining_seconds: z.number(),
  carrier: z.string().nullable().optional(),
  subscription_link: z.string().url().nullable().optional(),
  subscriber_id: z.number().optional(),
  session_token: z.string().nullable().optional(),
  session_expires_at: z.string().datetime().nullable().optional(),
  start_time: z.string().datetime().nullable().optional(),
  end_time: z.string().datetime().nullable().optional(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: BaseDataSchema.nullable(), // ✅ backend decides status
  server_time: z.string().datetime().optional(),
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
