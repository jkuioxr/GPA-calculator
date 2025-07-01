"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BookOpen,
  Calendar,
  BarChart3,
} from "lucide-react";
import type { Semester } from "@/lib/gpa-calculator";

interface AnalyticsDashboardProps {
  semesters: Semester[];
  currentGPA: number;
  totalCredits: number;
}

interface GPATrendData {
  semester: string;
  gpa: number;
  cumulativeGPA: number;
  credits: number;
}

interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export function AnalyticsDashboard({
  semesters,
  currentGPA,
  totalCredits,
}: AnalyticsDashboardProps) {
  const [trendData, setTrendData] = useState<GPATrendData[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([]);
  const [stats, setStats] = useState({
    highestGPA: 0,
    lowestGPA: 0,
    averageGPA: 0,
    totalCourses: 0,
    improvementTrend: 0,
  });

  useEffect(() => {
    calculateAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesters]);

  const calculateAnalytics = () => {
    if (semesters.length === 0) return;

    // Calculate trend data
    let cumulativeCredits = 0;
    let cumulativePoints = 0;
    const trends: GPATrendData[] = [];

    for (const semester of semesters) {
      const semesterCredits = semester.courses.reduce((sum, course) => sum + course.credits, 0);
      const semesterPoints = semester.courses.reduce((sum, course) => {
        const gradePoint = getGradePoint(course.grade);
        return sum + (gradePoint * course.credits);
      }, 0);

      cumulativeCredits += semesterCredits;
      cumulativePoints += semesterPoints;

      const semesterGPA = semesterCredits > 0 ? semesterPoints / semesterCredits : 0;
      const cumulativeGPA = cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0;

      trends.push({
        semester: `${semester.name} ${semester.year}`,
        gpa: Number(semesterGPA.toFixed(2)),
        cumulativeGPA: Number(cumulativeGPA.toFixed(2)),
        credits: semesterCredits,
      });
    }

    setTrendData(trends);

    // Calculate grade distribution
    const gradeCount: { [key: string]: number } = {};
    let totalCourses = 0;

    for (const semester of semesters) {
      for (const course of semester.courses) {
        if (course.grade) {
          gradeCount[course.grade] = (gradeCount[course.grade] || 0) + 1;
          totalCourses++;
        }
      }
    }

    const gradeColors: { [key: string]: string } = {
      'A+': '#10b981', 'A': '#10b981', 'A-': '#059669',
      'B+': '#3b82f6', 'B': '#3b82f6', 'B-': '#2563eb',
      'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#d97706',
      'D+': '#ef4444', 'D': '#ef4444', 'D-': '#dc2626',
      'F': '#991b1b'
    };

    const distribution = Object.entries(gradeCount).map(([grade, count]) => ({
      grade,
      count,
      percentage: Number(((count / totalCourses) * 100).toFixed(1)),
      color: gradeColors[grade] || '#6b7280',
    }));

    setGradeDistribution(distribution);

    // Calculate statistics
    const semesterGPAs = trends.map(t => t.gpa).filter(gpa => gpa > 0);
    const highestGPA = Math.max(...semesterGPAs);
    const lowestGPA = Math.min(...semesterGPAs);
    const averageGPA = semesterGPAs.reduce((sum, gpa) => sum + gpa, 0) / semesterGPAs.length;

    // Calculate improvement trend (last 3 semesters)
    const recent = trends.slice(-3);
    const improvementTrend = recent.length > 1
      ? recent[recent.length - 1].gpa - recent[0].gpa
      : 0;

    setStats({
      highestGPA: Number(highestGPA.toFixed(2)),
      lowestGPA: Number(lowestGPA.toFixed(2)),
      averageGPA: Number(averageGPA.toFixed(2)),
      totalCourses,
      improvementTrend: Number(improvementTrend.toFixed(2)),
    });
  };

  const getGradePoint = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    return gradePoints[grade] || 0;
  };

  const StatCard = ({ title, value, icon: Icon, trend, description }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <div className={`p-3 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-600' :
            trend === 'down' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current GPA"
          value={currentGPA.toFixed(2)}
          icon={Target}
          trend={stats.improvementTrend > 0 ? 'up' : stats.improvementTrend < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Total Credits"
          value={totalCredits}
          icon={BookOpen}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={Calendar}
        />
        <StatCard
          title="Trend"
          value={stats.improvementTrend > 0 ? `+${stats.improvementTrend}` : stats.improvementTrend}
          icon={stats.improvementTrend >= 0 ? TrendingUp : TrendingDown}
          trend={stats.improvementTrend >= 0 ? 'up' : 'down'}
          description="Last 3 semesters"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">GPA Trends</TabsTrigger>
          <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
          <TabsTrigger value="comparison">Semester Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GPA Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 4]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Semester GPA"
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeGPA"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Cumulative GPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.highestGPA}</div>
                <div className="text-sm text-gray-600">Highest GPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageGPA}</div>
                <div className="text-sm text-gray-600">Average GPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.lowestGPA}</div>
                <div className="text-sm text-gray-600">Lowest GPA</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, percentage }) => `${grade} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {gradeDistribution.map((entry) => (
                        <Cell key={entry.grade} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {gradeDistribution.map((grade) => (
                    <div key={grade.grade} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: grade.color }}
                        />
                        <span className="font-medium">{grade.grade}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{grade.count} courses</div>
                        <div className="text-sm text-gray-500">{grade.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Semester Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 4]} />
                  <Tooltip />
                  <Bar dataKey="gpa" fill="#10b981" name="Semester GPA" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
