export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      invites: {
        Row: {
          created_at: string
          id: string
          listing_id: string | null
          message: string | null
          sender_id: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id?: string | null
          message?: string | null
          sender_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string | null
          message?: string | null
          sender_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      landlord_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          management_type: Database["public"]["Enums"]["management_type"] | null
          preferred_tenant_criteria: string | null
          property_count: number | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
          verification_documents: string[] | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          is_verified?: boolean | null
          management_type?:
            | Database["public"]["Enums"]["management_type"]
            | null
          preferred_tenant_criteria?: string | null
          property_count?: number | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          verification_documents?: string[] | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          management_type?:
            | Database["public"]["Enums"]["management_type"]
            | null
          preferred_tenant_criteria?: string | null
          property_count?: number | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          verification_documents?: string[] | null
          years_experience?: number | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          address: string | null
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          owner_id: string
          price: number | null
          square_feet: number | null
          state: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          address?: string | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          owner_id: string
          price?: number | null
          square_feet?: number | null
          state?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          address?: string | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          owner_id?: string
          price?: number | null
          square_feet?: number | null
          state?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      realtor_profiles: {
        Row: {
          agency: string | null
          bio: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          license_number: string | null
          specialties: string[] | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
          verification_documents: string[] | null
          years_experience: number | null
        }
        Insert: {
          agency?: string | null
          bio?: string | null
          created_at?: string
          id: string
          is_verified?: boolean | null
          license_number?: string | null
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          verification_documents?: string[] | null
          years_experience?: number | null
        }
        Update: {
          agency?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          verification_documents?: string[] | null
          years_experience?: number | null
        }
        Relationships: []
      }
      tenant_profiles: {
        Row: {
          bio: string | null
          contact_preferences: Json | null
          created_at: string
          household_income: number | null
          household_size: number | null
          id: string
          is_pre_screened: boolean | null
          last_activity: string | null
          move_in_date: string | null
          pets: boolean | null
          preferred_locations: string[] | null
          profile_image_url: string | null
          screening_status: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact_preferences?: Json | null
          created_at?: string
          household_income?: number | null
          household_size?: number | null
          id: string
          is_pre_screened?: boolean | null
          last_activity?: string | null
          move_in_date?: string | null
          pets?: boolean | null
          preferred_locations?: string[] | null
          profile_image_url?: string | null
          screening_status?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact_preferences?: Json | null
          created_at?: string
          household_income?: number | null
          household_size?: number | null
          id?: string
          is_pre_screened?: boolean | null
          last_activity?: string | null
          move_in_date?: string | null
          pets?: boolean | null
          preferred_locations?: string[] | null
          profile_image_url?: string | null
          screening_status?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      management_type: "self" | "company" | "hybrid"
      profile_status: "incomplete" | "basic" | "verified" | "premium"
      user_role: "tenant" | "agent" | "landlord" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      management_type: ["self", "company", "hybrid"],
      profile_status: ["incomplete", "basic", "verified", "premium"],
      user_role: ["tenant", "agent", "landlord", "admin"],
    },
  },
} as const
