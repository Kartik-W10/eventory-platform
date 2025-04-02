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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
