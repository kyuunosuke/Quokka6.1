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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_setup_log: {
        Row: {
          created_at: string | null
          email: string
          id: string
          notes: string | null
          setup_date: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          notes?: string | null
          setup_date?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          notes?: string | null
          setup_date?: string | null
        }
        Relationships: []
      }
      client_submissions: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          banner_url: string | null
          category: string
          client_id: string
          company_description: string | null
          company_name: string | null
          created_at: string | null
          description: string | null
          detailed_description: string | null
          difficulty_level: string | null
          end_date: string
          entry_fee: number | null
          id: string
          is_team_competition: boolean | null
          judging_end_date: string | null
          judging_start_date: string | null
          max_participants: number | null
          max_team_size: number | null
          min_team_size: number | null
          organizer_email: string
          organizer_name: string
          organizer_website: string | null
          prize_amount: number | null
          prize_currency: string | null
          prize_description: string | null
          published_at: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          rules: string | null
          start_date: string
          status: string | null
          subcategory: string | null
          submission_deadline: string
          submitted_at: string | null
          tags: string[] | null
          terms_conditions_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          winner_announcement_date: string | null
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          banner_url?: string | null
          category: string
          client_id: string
          company_description?: string | null
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          difficulty_level?: string | null
          end_date: string
          entry_fee?: number | null
          id?: string
          is_team_competition?: boolean | null
          judging_end_date?: string | null
          judging_start_date?: string | null
          max_participants?: number | null
          max_team_size?: number | null
          min_team_size?: number | null
          organizer_email: string
          organizer_name: string
          organizer_website?: string | null
          prize_amount?: number | null
          prize_currency?: string | null
          prize_description?: string | null
          published_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          rules?: string | null
          start_date: string
          status?: string | null
          subcategory?: string | null
          submission_deadline: string
          submitted_at?: string | null
          tags?: string[] | null
          terms_conditions_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          winner_announcement_date?: string | null
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          banner_url?: string | null
          category?: string
          client_id?: string
          company_description?: string | null
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          difficulty_level?: string | null
          end_date?: string
          entry_fee?: number | null
          id?: string
          is_team_competition?: boolean | null
          judging_end_date?: string | null
          judging_start_date?: string | null
          max_participants?: number | null
          max_team_size?: number | null
          min_team_size?: number | null
          organizer_email?: string
          organizer_name?: string
          organizer_website?: string | null
          prize_amount?: number | null
          prize_currency?: string | null
          prize_description?: string | null
          published_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          rules?: string | null
          start_date?: string
          status?: string | null
          subcategory?: string | null
          submission_deadline?: string
          submitted_at?: string | null
          tags?: string[] | null
          terms_conditions_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          winner_announcement_date?: string | null
        }
        Relationships: []
      }
      competition_categories: {
        Row: {
          color_scheme: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
        }
        Insert: {
          color_scheme?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
        }
        Update: {
          color_scheme?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      competition_eligibility: {
        Row: {
          competition_id: string
          created_at: string | null
          eligibility_type: string
          id: string
          is_mandatory: boolean | null
          requirement_text: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          eligibility_type: string
          id?: string
          is_mandatory?: boolean | null
          requirement_text: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          eligibility_type?: string
          id?: string
          is_mandatory?: boolean | null
          requirement_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_eligibility_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_requirements: {
        Row: {
          competition_id: string
          created_at: string | null
          id: string
          is_mandatory: boolean | null
          order_index: number | null
          requirement_description: string
          requirement_title: string
          requirement_type: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          order_index?: number | null
          requirement_description: string
          requirement_title: string
          requirement_type: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          order_index?: number | null
          requirement_description?: string
          requirement_title?: string
          requirement_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_requirements_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_requirements_selected: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          requirement_option_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          requirement_option_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          requirement_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_requirements_selected_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_requirements_selected_requirement_option_id_fkey"
            columns: ["requirement_option_id"]
            isOneToOne: false
            referencedRelation: "requirement_options"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_rules: {
        Row: {
          competition_id: string
          created_at: string | null
          id: string
          order_index: number | null
          rule_category: string
          rule_description: string
          rule_title: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          rule_category: string
          rule_description: string
          rule_title: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          rule_category?: string
          rule_description?: string
          rule_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_rules_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_submissions: {
        Row: {
          competition_id: string
          created_at: string | null
          id: string
          status: string
          submission_data: Json | null
          submission_description: string | null
          submission_files: Json | null
          submission_title: string
          submitted_at: string | null
          team_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          id?: string
          status?: string
          submission_data?: Json | null
          submission_description?: string | null
          submission_files?: Json | null
          submission_title: string
          submitted_at?: string | null
          team_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          id?: string
          status?: string
          submission_data?: Json | null
          submission_description?: string | null
          submission_files?: Json | null
          submission_title?: string
          submitted_at?: string | null
          team_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          banner_url: string | null
          category: string
          created_at: string | null
          current_participants: number | null
          description: string | null
          detailed_description: string | null
          draw_date: string | null
          end_date: string
          entry_fee: number | null
          featured: boolean | null
          id: string
          is_team_competition: boolean | null
          judging_end_date: string | null
          judging_start_date: string | null
          max_participants: number | null
          max_team_size: number | null
          min_team_size: number | null
          organizer_email: string | null
          organizer_id: string | null
          organizer_name: string | null
          organizer_website: string | null
          participating_requirement: string | null
          permits: string | null
          prize_amount: number | null
          prize_currency: string | null
          prize_description: string | null
          region: string | null
          rules: string | null
          start_date: string
          status: string
          subcategory: string | null
          submission_deadline: string
          tags: string[] | null
          terms_conditions_url: string | null
          thumbnail_url: string | null
          title: string
          total_prize: string | null
          type_of_game: string
          updated_at: string | null
          winner_announcement_date: string | null
        }
        Insert: {
          banner_url?: string | null
          category: string
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          detailed_description?: string | null
          draw_date?: string | null
          end_date: string
          entry_fee?: number | null
          featured?: boolean | null
          id?: string
          is_team_competition?: boolean | null
          judging_end_date?: string | null
          judging_start_date?: string | null
          max_participants?: number | null
          max_team_size?: number | null
          min_team_size?: number | null
          organizer_email?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          organizer_website?: string | null
          participating_requirement?: string | null
          permits?: string | null
          prize_amount?: number | null
          prize_currency?: string | null
          prize_description?: string | null
          region?: string | null
          rules?: string | null
          start_date: string
          status?: string
          subcategory?: string | null
          submission_deadline: string
          tags?: string[] | null
          terms_conditions_url?: string | null
          thumbnail_url?: string | null
          title: string
          total_prize?: string | null
          type_of_game?: string
          updated_at?: string | null
          winner_announcement_date?: string | null
        }
        Update: {
          banner_url?: string | null
          category?: string
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          detailed_description?: string | null
          draw_date?: string | null
          end_date?: string
          entry_fee?: number | null
          featured?: boolean | null
          id?: string
          is_team_competition?: boolean | null
          judging_end_date?: string | null
          judging_start_date?: string | null
          max_participants?: number | null
          max_team_size?: number | null
          min_team_size?: number | null
          organizer_email?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          organizer_website?: string | null
          participating_requirement?: string | null
          permits?: string | null
          prize_amount?: number | null
          prize_currency?: string | null
          prize_description?: string | null
          region?: string | null
          rules?: string | null
          start_date?: string
          status?: string
          subcategory?: string | null
          submission_deadline?: string
          tags?: string[] | null
          terms_conditions_url?: string | null
          thumbnail_url?: string | null
          title?: string
          total_prize?: string | null
          type_of_game?: string
          updated_at?: string | null
          winner_announcement_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          education: string | null
          email: string | null
          ethnicity: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          hobbies: string[] | null
          home_ownership: string | null
          id: string
          income_range: string | null
          interests: string[] | null
          is_active: boolean | null
          languages_spoken: string[] | null
          last_name: string | null
          location: string | null
          marital_status: string | null
          nickname: string | null
          occupation: string | null
          pet_ownership: string | null
          phone: string | null
          postcode: string | null
          preferences: Json | null
          role: string
          social_links: Json | null
          updated_at: string | null
          vehicle_ownership: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education?: string | null
          email?: string | null
          ethnicity?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          home_ownership?: string | null
          id: string
          income_range?: string | null
          interests?: string[] | null
          is_active?: boolean | null
          languages_spoken?: string[] | null
          last_name?: string | null
          location?: string | null
          marital_status?: string | null
          nickname?: string | null
          occupation?: string | null
          pet_ownership?: string | null
          phone?: string | null
          postcode?: string | null
          preferences?: Json | null
          role?: string
          social_links?: Json | null
          updated_at?: string | null
          vehicle_ownership?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education?: string | null
          email?: string | null
          ethnicity?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          home_ownership?: string | null
          id?: string
          income_range?: string | null
          interests?: string[] | null
          is_active?: boolean | null
          languages_spoken?: string[] | null
          last_name?: string | null
          location?: string | null
          marital_status?: string | null
          nickname?: string | null
          occupation?: string | null
          pet_ownership?: string | null
          phone?: string | null
          postcode?: string | null
          preferences?: Json | null
          role?: string
          social_links?: Json | null
          updated_at?: string | null
          vehicle_ownership?: string | null
          website?: string | null
        }
        Relationships: []
      }
      requirement_options: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_competitions: {
        Row: {
          competition_id: string
          id: string
          notes: string | null
          saved_at: string | null
          user_id: string
        }
        Insert: {
          competition_id: string
          id?: string
          notes?: string | null
          saved_at?: string | null
          user_id: string
        }
        Update: {
          competition_id?: string
          id?: string
          notes?: string | null
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_competitions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_competitions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: {
          admin_email: string
          admin_name?: string
          admin_password: string
        }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_competition_status_on_end_date: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_admin_credentials: {
        Args: { check_email: string; check_password: string }
        Returns: boolean
      }
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
