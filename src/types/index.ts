import { z } from "zod";

// Membership Tiers
export type MembershipType =
  | "core"
  | "lifetime"
  | "5_year"
  | "2_year"
  | "none"
  | null;

// Profile Entity
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  batch?: string | null;
  graduation_year?: number | null;
  branch?: string | null;
  company?: string | null;
  role_title?: string | null;
  emp_type?: "Intern" | "Full-time" | null;
  city?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  roles?: string[];
  mentorship_available?: boolean | null;
  membership_type?: MembershipType;
  membership_expires_at?: string | null;
  created_at?: string;
}

// Membership Request Entity
export interface MembershipRequest {
  id: string;
  user_id: string;
  plan_type: "lifetime" | "5_year" | "2_year";
  transaction_id: string;
  receipt_url?: string | null;
  status: "pending" | "approved" | "rejected";
  moderator_notes?: string | null;
  created_at: string;
  updated_at?: string;
  profiles?: Partial<Profile> | null;
}

// Connection/Mentorship Request Entity
export interface ConnectionRequest {
  id: string;
  student_id: string;
  alumni_id: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  student_profile?: Partial<Profile>;
  alumni_profile?: Partial<Profile>;
}

// Announcement Entity
export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role?: "all" | "alumni" | "student" | null;
  is_pinned?: boolean;
  author_id?: string;
  created_at: string;
  likes_count?: number;
  user_has_liked?: boolean;
  author_profile?: Partial<Profile>;
}

// Zod Validation Schemas
export const MembershipRequestSchema = z.object({
  plan_type: z.enum(["lifetime", "5_year", "2_year"]),
  transaction_id: z
    .string()
    .min(4, "Transaction ID must be at least 4 characters")
    .max(100, "Transaction ID too long")
    .trim(),
  receipt_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

export const MentorshipRequestSchema = z.object({
  alumni_id: z.string().uuid("Invalid Alumni ID"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message cannot exceed 1000 characters")
    .trim(),
});

export const AnnouncementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title too long")
    .trim(),
  content: z
    .string()
    .min(5, "Content must be at least 5 characters")
    .max(5000, "Content too long")
    .trim(),
  target_role: z.enum(["all", "alumni", "student"]).default("all"),
});
