import { createSupabaseClient } from './supabase'
import type { Database } from './database.types'
import type { Course, Semester } from './gpa-calculator'

type Tables = Database['public']['Tables']
type CourseRow = Tables['courses']['Row']
type SemesterRow = Tables['semesters']['Row']
type GPARecordRow = Tables['gpa_records']['Row']

interface SemesterWithCourses {
  id: string;
  name: string;
  year: number;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
  courses: CourseRow[];
}

export class DataAccess {
  private supabase = createSupabaseClient()

  // Semester operations
  async getSemesters(userId: string): Promise<Semester[]> {
    const { data, error } = await this.supabase
      .from('semesters')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('name', { ascending: true })

    if (error) throw error

    return (data as SemesterWithCourses[]).map(semester => ({
      id: semester.id,
      name: semester.name,
      year: semester.year,
      courses: semester.courses.map((course: CourseRow) => ({
        id: course.id,
        name: course.name,
        grade: course.grade || '',
        credits: course.credits,
        semester: semester.name,
        year: semester.year,
        isHypothetical: course.is_hypothetical
      })),
      gpa: 0 // Will be calculated
    }))
  }

  async createSemester(userId: string, semester: Omit<SemesterRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('semesters')
      .insert({
        user_id: userId,
        ...semester
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateSemester(semesterId: string, updates: Partial<SemesterRow>) {
    const { data, error } = await this.supabase
      .from('semesters')
      .update(updates)
      .eq('id', semesterId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteSemester(semesterId: string) {
    const { error } = await this.supabase
      .from('semesters')
      .delete()
      .eq('id', semesterId)

    if (error) throw error
  }

  // Course operations
  async getCourses(userId: string, semesterId?: string): Promise<Course[]> {
    let query = this.supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)

    if (semesterId) {
      query = query.eq('semester_id', semesterId)
    }

    const { data, error } = await query.order('created_at', { ascending: true })

    if (error) throw error

    return data.map(course => ({
      id: course.id,
      name: course.name,
      grade: course.grade || '',
      credits: course.credits,
      isHypothetical: course.is_hypothetical
    }))
  }

  async createCourse(userId: string, course: Omit<Course, 'id'> & { semesterId?: string }) {
    const { data, error } = await this.supabase
      .from('courses')
      .insert({
        user_id: userId,
        semester_id: course.semesterId,
        name: course.name,
        grade: course.grade,
        credits: course.credits,
        is_hypothetical: course.isHypothetical || false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCourse(courseId: string, updates: Partial<Course>) {
    const { data, error } = await this.supabase
      .from('courses')
      .update({
        name: updates.name,
        grade: updates.grade,
        credits: updates.credits,
        is_hypothetical: updates.isHypothetical
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCourse(courseId: string) {
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) throw error
  }

  // GPA Records
  async saveGPARecord(userId: string, record: {
    semesterId?: string
    semesterGPA?: number
    cumulativeGPA: number
    totalCredits: number
    totalQualityPoints: number
  }) {
    const { data, error } = await this.supabase
      .from('gpa_records')
      .insert({
        user_id: userId,
        semester_id: record.semesterId,
        semester_gpa: record.semesterGPA,
        cumulative_gpa: record.cumulativeGPA,
        total_credits: record.totalCredits,
        total_quality_points: record.totalQualityPoints
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getGPAHistory(userId: string): Promise<GPARecordRow[]> {
    const { data, error } = await this.supabase
      .from('gpa_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: true })

    if (error) throw error
    return data
  }

  // Achievements
  async getUserAchievements(userId: string) {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  async unlockAchievement(userId: string, achievementId: string) {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      })
      .select()
      .single()

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error
    }
    return data
  }

  // Reports
  async saveReport(userId: string, report: {
    title: string
    type: string
    data: Record<string, unknown>
  }) {
    const { data, error } = await this.supabase
      .from('reports')
      .insert({
        user_id: userId,
        title: report.title,
        type: report.type,
        data: report.data
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getReports(userId: string) {
    const { data, error } = await this.supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export const dataAccess = new DataAccess()
