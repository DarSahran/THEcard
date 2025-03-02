export interface Profile {
  id: string;
  full_name: string | null;
  aadhaar_number: string | null;
  aadhaar_verified: boolean;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  created_at: string;
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string | null;
  benefits: string | null;
  official_link: string | null;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface AadhaarVerification {
  aadhaar_number: string;
  otp: string;
}