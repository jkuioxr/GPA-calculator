"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FileText,
  Mail,
  Download,
  ExternalLink,
  Plus,
  Settings,
  User,
  BookOpen,
  Award,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { GPACalculator } from "@/components/gpa-calculator";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { PDFReportGenerator } from "@/components/pdf-report-generator";
import { EmailSharing } from "@/components/email-sharing";
import { LMSIntegration } from "@/components/lms-integration";
import { AchievementGrid } from "@/components/achievement-badge";
import { useAuth } from "@/lib/auth-context";
import { dataAccess } from "@/lib/data-access";
import type { Semester, Course } from "@/lib/gpa-calculator";
import { calculateGPA, GRADING_SCALES } from "@/lib/gpa-calculator";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const currentGPA = calculateGPA(allCourses.filter(c => !c.isHypothetical), GRADING_SCALES[0], true);
  const totalCredits = allCourses
    .filter(c => !c.isHypothetical && c.grade)
    .reduce((sum, course) => sum + course.credits, 0);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [semestersData, coursesData] = await Promise.all([
        dataAccess.getSemesters(user.id),
        dataAccess.getCourses(user.id),
      ]);

      setSemesters(semestersData);
      setAllCourses(coursesData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportCourses = async (importedCourses: Course[]) => {
    if (!user) return;

    try {
      // Create courses in database
      for (const course of importedCourses) {
        await dataAccess.createCourse(user.id, course);
      }

      // Reload data
      await loadUserData();
    } catch (error) {
      console.error('Error importing courses:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, description }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    change?: string;
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {change}
              </p>
            )}
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to access the dashboard.</p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-800">GPACalc</span>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.user_metadata?.full_name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Academic Dashboard</h1>
          <p className="text-gray-600">Track your progress, analyze trends, and plan your academic future.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Current GPA"
                value={currentGPA.toFixed(2)}
                icon={TrendingUp}
                change="+0.1 from last semester"
              />
              <StatCard
                title="Total Credits"
                value={totalCredits}
                icon={BookOpen}
                description="Completed credit hours"
              />
              <StatCard
                title="Semesters"
                value={semesters.length}
                icon={Calculator}
                description="Academic periods tracked"
              />
              <StatCard
                title="Courses"
                value={allCourses.filter(c => !c.isHypothetical).length}
                icon={Award}
                description="Total courses completed"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <PDFReportGenerator
                    semesters={semesters}
                    currentGPA={currentGPA}
                    totalCredits={totalCredits}
                  >
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-6 w-6" />
                      <span>Generate Report</span>
                    </Button>
                  </PDFReportGenerator>

                  <EmailSharing
                    semesters={semesters}
                    currentGPA={currentGPA}
                    totalCredits={totalCredits}
                  >
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Mail className="h-6 w-6" />
                      <span>Share Progress</span>
                    </Button>
                  </EmailSharing>

                  <LMSIntegration onImportCourses={handleImportCourses}>
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <ExternalLink className="h-6 w-6" />
                      <span>Import from LMS</span>
                    </Button>
                  </LMSIntegration>

                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {semesters.slice(0, 3).map((semester) => (
                    <div key={semester.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{semester.name} {semester.year}</h4>
                        <p className="text-sm text-gray-600">{semester.courses.length} courses</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{semester.gpa.toFixed(2)} GPA</div>
                        <div className="text-sm text-gray-500">
                          {semester.courses.reduce((sum, c) => sum + c.credits, 0)} credits
                        </div>
                      </div>
                    </div>
                  ))}

                  {semesters.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No semester data yet. Start by adding courses in the calculator!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <GPACalculator />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard
              semesters={semesters}
              currentGPA={currentGPA}
              totalCredits={totalCredits}
            />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Create professional academic reports and transcripts.</p>
                  <PDFReportGenerator
                    semesters={semesters}
                    currentGPA={currentGPA}
                    totalCredits={totalCredits}
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate PDF Report
                    </Button>
                  </PDFReportGenerator>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Share Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Email your progress reports to advisors or family.</p>
                  <EmailSharing
                    semesters={semesters}
                    currentGPA={currentGPA}
                    totalCredits={totalCredits}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Mail className="mr-2 h-4 w-4" />
                      Share via Email
                    </Button>
                  </EmailSharing>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>LMS Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Import courses directly from your learning management system.</p>
                  <LMSIntegration onImportCourses={handleImportCourses}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect to LMS
                    </Button>
                  </LMSIntegration>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Export your academic data in various formats.</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export as CSV
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export as JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <AchievementGrid
                  gpa={currentGPA}
                  totalCredits={totalCredits}
                  coursesCount={allCourses.filter(c => !c.isHypothetical).length}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
