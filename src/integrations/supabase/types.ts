export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      anonymous_salaries: {
        Row: {
          base_salary: number
          bonus: number | null
          company_size: string | null
          contributor_id: string | null
          equity_value: number | null
          id: string
          industry: string
          job_title: string
          location: string
          submitted_at: string
          verified: boolean | null
          years_experience: number
        }
        Insert: {
          base_salary: number
          bonus?: number | null
          company_size?: string | null
          contributor_id?: string | null
          equity_value?: number | null
          id?: string
          industry: string
          job_title: string
          location: string
          submitted_at?: string
          verified?: boolean | null
          years_experience: number
        }
        Update: {
          base_salary?: number
          bonus?: number | null
          company_size?: string | null
          contributor_id?: string | null
          equity_value?: number | null
          id?: string
          industry?: string
          job_title?: string
          location?: string
          submitted_at?: string
          verified?: boolean | null
          years_experience?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          applied: boolean | null
          expires_at: string | null
          granted_at: string
          id: string
          reward_type: string
          user_id: string
        }
        Insert: {
          applied?: boolean | null
          expires_at?: string | null
          granted_at?: string
          id?: string
          reward_type: string
          user_id: string
        }
        Update: {
          applied?: boolean | null
          expires_at?: string | null
          granted_at?: string
          id?: string
          reward_type?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_id: string
          rewarded_at: string | null
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id: string
          rewarded_at?: string | null
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          rewarded_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      salary_contributions: {
        Row: {
          contributed_at: string
          contribution_id: string
          id: string
          user_id: string
        }
        Insert: {
          contributed_at?: string
          contribution_id: string
          id?: string
          user_id: string
        }
        Update: {
          contributed_at?: string
          contribution_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_contributions_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "anonymous_salaries"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_timeline: {
        Row: {
          base_salary: number
          bonus: number | null
          company: string | null
          created_at: string
          equity_value: number | null
          id: string
          job_title: string
          notes: string | null
          recorded_at: string
          user_id: string
        }
        Insert: {
          base_salary: number
          bonus?: number | null
          company?: string | null
          created_at?: string
          equity_value?: number | null
          id?: string
          job_title: string
          notes?: string | null
          recorded_at?: string
          user_id: string
        }
        Update: {
          base_salary?: number
          bonus?: number | null
          company?: string | null
          created_at?: string
          equity_value?: number | null
          id?: string
          job_title?: string
          notes?: string | null
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          analysis_result: Json
          bonus: number | null
          company: string | null
          created_at: string
          current_salary: number
          hours_per_week: number
          id: string
          job_satisfaction: number
          job_title: string
          location: string
          stress_level: number
          user_id: string
          years_experience: number
        }
        Insert: {
          analysis_result: Json
          bonus?: number | null
          company?: string | null
          created_at?: string
          current_salary: number
          hours_per_week: number
          id?: string
          job_satisfaction: number
          job_title: string
          location: string
          stress_level: number
          user_id: string
          years_experience: number
        }
        Update: {
          analysis_result?: Json
          bonus?: number | null
          company?: string | null
          created_at?: string
          current_salary?: number
          hours_per_week?: number
          id?: string
          job_satisfaction?: number
          job_title?: string
          location?: string
          stress_level?: number
          user_id?: string
          years_experience?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
