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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          payload_json: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          payload_json?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          payload_json?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      billable_events: {
        Row: {
          amount: number
          broker_id: string
          created_at: string
          event_type: string | null
          fee_id: string
          id: string
          opportunity_id: string | null
          reference_month: string | null
          status: string
        }
        Insert: {
          amount: number
          broker_id: string
          created_at?: string
          event_type?: string | null
          fee_id: string
          id?: string
          opportunity_id?: string | null
          reference_month?: string | null
          status?: string
        }
        Update: {
          amount?: number
          broker_id?: string
          created_at?: string
          event_type?: string | null
          fee_id?: string
          id?: string
          opportunity_id?: string | null
          reference_month?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "billable_events_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billable_events_fee_id_fkey"
            columns: ["fee_id"]
            isOneToOne: false
            referencedRelation: "fees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billable_events_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_products: {
        Row: {
          broker_id: string
          created_at: string
          custom_fee_type: string | null
          custom_fee_value: number | null
          id: string
          is_active: boolean | null
          max_leads_per_week: number | null
          priority_rank: number | null
          product_id: string
        }
        Insert: {
          broker_id: string
          created_at?: string
          custom_fee_type?: string | null
          custom_fee_value?: number | null
          id?: string
          is_active?: boolean | null
          max_leads_per_week?: number | null
          priority_rank?: number | null
          product_id: string
        }
        Update: {
          broker_id?: string
          created_at?: string
          custom_fee_type?: string | null
          custom_fee_value?: number | null
          id?: string
          is_active?: boolean | null
          max_leads_per_week?: number | null
          priority_rank?: number | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_products_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_regions: {
        Row: {
          broker_id: string
          city: string | null
          id: string
          state: string | null
          zip_end: string | null
          zip_start: string | null
        }
        Insert: {
          broker_id: string
          city?: string | null
          id?: string
          state?: string | null
          zip_end?: string | null
          zip_start?: string | null
        }
        Update: {
          broker_id?: string
          city?: string | null
          id?: string
          state?: string | null
          zip_end?: string | null
          zip_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_regions_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      brokers: {
        Row: {
          accepts_auto_distribution: boolean | null
          accepts_manual_distribution: boolean | null
          address: string | null
          city: string | null
          cnpj: string | null
          company_name: string
          contact_name: string | null
          created_at: string
          current_capacity_used: number | null
          email: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          phone: string | null
          priority_level: number | null
          state: string | null
          trade_name: string | null
          updated_at: string
          weekly_capacity: number | null
          whatsapp: string | null
        }
        Insert: {
          accepts_auto_distribution?: boolean | null
          accepts_manual_distribution?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string
          current_capacity_used?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string | null
          priority_level?: number | null
          state?: string | null
          trade_name?: string | null
          updated_at?: string
          weekly_capacity?: number | null
          whatsapp?: string | null
        }
        Update: {
          accepts_auto_distribution?: boolean | null
          accepts_manual_distribution?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string
          current_capacity_used?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string | null
          priority_level?: number | null
          state?: string | null
          trade_name?: string | null
          updated_at?: string
          weekly_capacity?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      fees: {
        Row: {
          amount: number
          broker_id: string
          created_at: string
          fee_name: string
          fee_type: string
          id: string
          is_active: boolean | null
          product_id: string | null
        }
        Insert: {
          amount: number
          broker_id: string
          created_at?: string
          fee_name: string
          fee_type: string
          id?: string
          is_active?: boolean | null
          product_id?: string | null
        }
        Update: {
          amount?: number
          broker_id?: string
          created_at?: string
          fee_name?: string
          fee_type?: string
          id?: string
          is_active?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fees_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fees_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          billable_event_id: string | null
          description: string
          id: string
          invoice_id: string
          quantity: number | null
          total: number
        }
        Insert: {
          amount: number
          billable_event_id?: string | null
          description: string
          id?: string
          invoice_id: string
          quantity?: number | null
          total: number
        }
        Update: {
          amount?: number
          billable_event_id?: string | null
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_billable_event_id_fkey"
            columns: ["billable_event_id"]
            isOneToOne: false
            referencedRelation: "billable_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          broker_id: string
          created_at: string
          discount: number | null
          due_date: string
          id: string
          paid_at: string | null
          reference_month: string
          status: string
          subtotal: number
          total: number
        }
        Insert: {
          broker_id: string
          created_at?: string
          discount?: number | null
          due_date: string
          id?: string
          paid_at?: string | null
          reference_month: string
          status?: string
          subtotal?: number
          total?: number
        }
        Update: {
          broker_id?: string
          created_at?: string
          discount?: number | null
          due_date?: string
          id?: string
          paid_at?: string | null
          reference_month?: string
          status?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_answers: {
        Row: {
          answer_json: Json | null
          answer_text: string | null
          field_key: string
          id: string
          lead_id: string
        }
        Insert: {
          answer_json?: Json | null
          answer_text?: string | null
          field_key: string
          id?: string
          lead_id: string
        }
        Update: {
          answer_json?: Json | null
          answer_text?: string | null
          field_key?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_answers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          best_contact_time: string | null
          city: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          lgpd_consent: boolean | null
          notes: string | null
          phone: string | null
          product_id: string | null
          qualification_score: number | null
          source: string | null
          state: string | null
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          best_contact_time?: string | null
          city?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          lgpd_consent?: boolean | null
          notes?: string | null
          phone?: string | null
          product_id?: string | null
          qualification_score?: number | null
          source?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          best_contact_time?: string | null
          city?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          lgpd_consent?: boolean | null
          notes?: string | null
          phone?: string | null
          product_id?: string | null
          qualification_score?: number | null
          source?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          accepted_at: string | null
          broker_id: string
          closed_at: string | null
          created_at: string
          dispatcher_id: string | null
          expired_at: string | null
          id: string
          internal_notes: string | null
          lead_id: string
          lost_at: string | null
          lost_reason: string | null
          product_id: string
          refused_at: string | null
          route_mode: string | null
          sla_accept_until: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          broker_id: string
          closed_at?: string | null
          created_at?: string
          dispatcher_id?: string | null
          expired_at?: string | null
          id?: string
          internal_notes?: string | null
          lead_id: string
          lost_at?: string | null
          lost_reason?: string | null
          product_id: string
          refused_at?: string | null
          route_mode?: string | null
          sla_accept_until?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          broker_id?: string
          closed_at?: string | null
          created_at?: string
          dispatcher_id?: string | null
          expired_at?: string | null
          id?: string
          internal_notes?: string | null
          lead_id?: string
          lost_at?: string | null
          lost_reason?: string | null
          product_id?: string
          refused_at?: string | null
          route_mode?: string | null
          sla_accept_until?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_dispatcher_id_fkey"
            columns: ["dispatcher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_status_history: {
        Row: {
          changed_by_user_id: string | null
          created_at: string
          id: string
          new_status: string
          note: string | null
          opportunity_id: string
          previous_status: string | null
        }
        Insert: {
          changed_by_user_id?: string | null
          created_at?: string
          id?: string
          new_status: string
          note?: string | null
          opportunity_id: string
          previous_status?: string | null
        }
        Update: {
          changed_by_user_id?: string | null
          created_at?: string
          id?: string
          new_status?: string
          note?: string | null
          opportunity_id?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_status_history_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_status_history_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      product_form_fields: {
        Row: {
          created_at: string
          field_key: string
          field_type: string
          id: string
          is_required: boolean | null
          label: string
          options_json: Json | null
          placeholder: string | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          field_key: string
          field_type: string
          id?: string
          is_required?: boolean | null
          label: string
          options_json?: Json | null
          placeholder?: string | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          field_key?: string
          field_type?: string
          id?: string
          is_required?: boolean | null
          label?: string
          options_json?: Json | null
          placeholder?: string | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_form_fields_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          default_fee_type: string | null
          default_fee_value: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          public_page_enabled: boolean | null
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          default_fee_type?: string | null
          default_fee_value?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          public_page_enabled?: boolean | null
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          default_fee_type?: string | null
          default_fee_value?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          public_page_enabled?: boolean | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      routing_rules: {
        Row: {
          broker_id: string | null
          city: string | null
          created_at: string
          id: string
          is_active: boolean | null
          priority: number | null
          product_id: string | null
          rule_config_json: Json | null
          rule_type: string | null
          state: string | null
        }
        Insert: {
          broker_id?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          product_id?: string | null
          rule_config_json?: Json | null
          rule_type?: string | null
          state?: string | null
        }
        Update: {
          broker_id?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          product_id?: string | null
          rule_config_json?: Json | null
          rule_type?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routing_rules_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routing_rules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          broker_id: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          broker_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          broker_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_broker_id: { Args: { _auth_id: string }; Returns: string }
      get_user_role: { Args: { _auth_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_dispatcher: { Args: { _auth_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "dispatcher" | "dono_corretora" | "operador_corretora"
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
    Enums: {
      app_role: ["admin", "dispatcher", "dono_corretora", "operador_corretora"],
    },
  },
} as const
