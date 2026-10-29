import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .refine((v) => /^[+()\d\s-]{7,20}$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7, {
      message: "Please enter a valid phone number",
    }),
  email: z.union([z.string().trim().email("Please enter a valid email").max(255), z.literal("")]).optional(),
  subjectOfInterest: z.string().trim().min(1, "Please tell us what you're interested in").max(120),
  preferredContact: z.enum(["phone", "whatsapp", "email"]),
  message: z.string().trim().max(1000).optional(),
  // Honeypot: real users never fill this field.
  website: z.string().max(200).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type EnquiryResult = { ok: true } | { ok: false; error: string };

/**
 * Public enquiry submission. Unauthenticated by design (parents are not signed
 * in); protected by same-origin CSRF middleware, Zod validation, a honeypot
 * field and a write-only anon RLS policy — this table cannot be read through
 * the Data API.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<EnquiryResult> => {
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, error: "Please check your details and try again." };
    }
    const input = parsed.data;

    // Silently accept bot submissions without storing anything.
    if (input.website) return { ok: true };

    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(url, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("enquiries").insert({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      subject_of_interest: input.subjectOfInterest,
      preferred_contact: input.preferredContact,
      message: input.message || null,
    });

    if (error) {
      console.error("enquiry insert failed:", error.code ?? error.message);
      return { ok: false, error: "Something went wrong while sending your enquiry. Please try again." };
    }
    return { ok: true };
  });
