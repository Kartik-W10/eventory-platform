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
      admin_users: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      code_links: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          title: string
          url: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          url: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attendee_email: string | null
          attendee_name: string | null
          attendee_phone: string | null
          created_at: string | null
          event_id: string | null
          id: string
          payment_notes: string | null
          payment_proof_url: string | null
          payment_qr_code: string | null
          payment_status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attendee_email?: string | null
          attendee_name?: string | null
          attendee_phone?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          payment_notes?: string | null
          payment_proof_url?: string | null
          payment_qr_code?: string | null
          payment_status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attendee_email?: string | null
          attendee_name?: string | null
          attendee_phone?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          payment_notes?: string | null
          payment_proof_url?: string | null
          payment_qr_code?: string | null
          payment_status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          google_meet_link: string | null
          id: string
          location: string
          payment_qr_code: string | null
          price: number
          registration_deadline: string | null
          time: string
          title: string
        }
        Insert: {
          capacity?: number
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          google_meet_link?: string | null
          id?: string
          location: string
          payment_qr_code?: string | null
          price?: number
          registration_deadline?: string | null
          time: string
          title: string
        }
        Update: {
          capacity?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          google_meet_link?: string | null
          id?: string
          location?: string
          payment_qr_code?: string | null
          price?: number
          registration_deadline?: string | null
          time?: string
          title?: string
        }
        Relationships: []
      }
      meeting_preferences: {
        Row: {
          availability_end: string | null
          availability_start: string | null
          available_days: number[] | null
          buffer_time: number | null
          calendar_type: string | null
          created_at: string | null
          description: string | null
          duration_options: number[] | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability_end?: string | null
          availability_start?: string | null
          available_days?: number[] | null
          buffer_time?: number | null
          calendar_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_options?: number[] | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability_end?: string | null
          availability_start?: string | null
          available_days?: number[] | null
          buffer_time?: number | null
          calendar_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_options?: number[] | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      page_contents: {
        Row: {
          content: string
          created_at: string | null
          id: string
          last_updated_at: string | null
          last_updated_by: string | null
          page_key: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          page_key: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          page_key?: string
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          event_id: string | null
          id: string
          metadata: Json | null
          status: string
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      pdfs: {
        Row: {
          author: string | null
          description: string | null
          file_path: string
          id: string
          thumbnail_path: string | null
          title: string
          upload_date: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          author?: string | null
          description?: string | null
          file_path: string
          id?: string
          thumbnail_path?: string | null
          title: string
          upload_date?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          author?: string | null
          description?: string | null
          file_path?: string
          id?: string
          thumbnail_path?: string | null
          title?: string
          upload_date?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      scheduled_meetings: {
        Row: {
          calendar_event_id: string | null
          created_at: string | null
          duration: number
          end_time: string
          guest_email: string
          guest_name: string
          host_id: string
          id: string
          notes: string | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          calendar_event_id?: string | null
          created_at?: string | null
          duration: number
          end_time: string
          guest_email: string
          guest_name: string
          host_id: string
          id?: string
          notes?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          calendar_event_id?: string | null
          created_at?: string | null
          duration?: number
          end_time?: string
          guest_email?: string
          guest_name?: string
          host_id?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          status?: string
          updated_at?: string | null
          user_id?: string
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
    Enums: {},
  },
} as const
