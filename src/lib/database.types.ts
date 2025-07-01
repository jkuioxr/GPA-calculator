export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      semesters: {
        Row: {
          id: string
          user_id: string
          name: string
          year: number
          start_date: string | null
          end_date: string | null
          is_current: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          year: number
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          year?: number
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          user_id: string
          semester_id: string | null
          name: string
          code: string | null
          grade: string | null
          credits: number
          grading_scale: string
          is_hypothetical: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          semester_id?: string | null
          name: string
          code?: string | null
          grade?: string | null
          credits?: number
          grading_scale?: string
          is_hypothetical?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          semester_id?: string | null
          name?: string
          code?: string | null
          grade?: string | null
          credits?: number
          grading_scale?: string
          is_hypothetical?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gpa_records: {
        Row: {
          id: string
          user_id: string
          semester_id: string | null
          semester_gpa: number | null
          cumulative_gpa: number | null
          total_credits: number | null
          total_quality_points: number | null
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          semester_id?: string | null
          semester_gpa?: number | null
          cumulative_gpa?: number | null
          total_credits?: number | null
          total_quality_points?: number | null
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          semester_id?: string | null
          semester_gpa?: number | null
          cumulative_gpa?: number | null
          total_credits?: number | null
          total_quality_points?: number | null
          recorded_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          data?: Json | null
          created_at?: string
        }
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
  }
}
