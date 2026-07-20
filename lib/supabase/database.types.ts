export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_name: string;
          account_number: string;
          active: boolean;
          bank_name: string;
          created_at: string;
          id: string;
          is_primary: boolean;
          updated_at: string;
        };
        Insert: {
          account_name: string;
          account_number: string;
          active?: boolean;
          bank_name: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          updated_at?: string;
        };
        Update: {
          account_name?: string;
          account_number?: string;
          active?: boolean;
          bank_name?: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_items: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          name: string;
          service_type: Database["public"]["Enums"]["service_type"];
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name: string;
          service_type: Database["public"]["Enums"]["service_type"];
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name?: string;
          service_type?: Database["public"]["Enums"]["service_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_variants: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          item_id: string;
          label: string;
          price: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          item_id: string;
          label: string;
          price: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          item_id?: string;
          label?: string;
          price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "catalog_variants_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "catalog_items";
            referencedColumns: ["id"];
          },
        ];
      };
      credential_access_log: {
        Row: {
          accessed_at: string;
          id: string;
          order_id: string;
        };
        Insert: {
          accessed_at?: string;
          id?: string;
          order_id: string;
        };
        Update: {
          accessed_at?: string;
          id?: string;
          order_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "credential_access_log_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          cancellation_reason: string | null;
          cancelled_at: string | null;
          catalog_item_name: string;
          catalog_variant_id: string | null;
          catalog_variant_label: string;
          completed_at: string | null;
          completion_proof_url: string | null;
          created_at: string;
          credentials_purge_at: string | null;
          customer_whatsapp_number: string;
          details: Json | null;
          game_account_email_enc: string | null;
          game_account_password_enc: string | null;
          id: string;
          payment_proof_url: string | null;
          price: number;
          sender_account_name: string;
          service_type: Database["public"]["Enums"]["service_type"];
          status: Database["public"]["Enums"]["order_status"];
          updated_at: string;
        };
        Insert: {
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          catalog_item_name: string;
          catalog_variant_id?: string | null;
          catalog_variant_label: string;
          completed_at?: string | null;
          completion_proof_url?: string | null;
          created_at?: string;
          credentials_purge_at?: string | null;
          customer_whatsapp_number: string;
          details?: Json | null;
          game_account_email_enc?: string | null;
          game_account_password_enc?: string | null;
          id?: string;
          payment_proof_url?: string | null;
          price: number;
          sender_account_name: string;
          service_type: Database["public"]["Enums"]["service_type"];
          status?: Database["public"]["Enums"]["order_status"];
          updated_at?: string;
        };
        Update: {
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          catalog_item_name?: string;
          catalog_variant_id?: string | null;
          catalog_variant_label?: string;
          completed_at?: string | null;
          completion_proof_url?: string | null;
          created_at?: string;
          credentials_purge_at?: string | null;
          customer_whatsapp_number?: string;
          details?: Json | null;
          game_account_email_enc?: string | null;
          game_account_password_enc?: string | null;
          id?: string;
          payment_proof_url?: string | null;
          price?: number;
          sender_account_name?: string;
          service_type?: Database["public"]["Enums"]["service_type"];
          status?: Database["public"]["Enums"]["order_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_catalog_variant_id_fkey";
            columns: ["catalog_variant_id"];
            isOneToOne: false;
            referencedRelation: "catalog_variants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrypt_game_credentials: {
        Args: { p_order_id: string };
        Returns: {
          email: string;
          password: string;
        }[];
      };
      encrypt_game_credentials: {
        Args: { p_email: string; p_password: string };
        Returns: {
          email_enc: string;
          password_enc: string;
        }[];
      };
    };
    Enums: {
      order_status:
        | "payment_submitted"
        | "verified"
        | "completed"
        | "cancelled";
      service_type: "gaming" | "giftcard";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      order_status: ["payment_submitted", "verified", "completed", "cancelled"],
      service_type: ["gaming", "giftcard"],
    },
  },
} as const;
