"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  Plus,
  Calculator,
  TrendingUp,
  Target,
  BookOpen,
  MoreVertical,
  Copy,
  Download,
  Share,
  Zap,
  Trophy,
  Star,
  Sparkles,
  GraduationCap,
  BarChart3,
  Calendar,
  Settings
} from "lucide-react";
import {
  type Course,
  GRADING_SCALES,
  calculateGPA,
  generateGradeOptions,
  getImprovementSuggestion
} from "@/lib/gpa-calculator";
import { AchievementGrid } from "@/components/achievement-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Semester {
  id: string;
  name: string;
  courses: Course[];
  isExpanded: boolean;
}

interface GPAStats {
  current: number;
  target: number;
  totalCredits: number;
  totalCourses: number;
  highestSemester: number;
  lowestSemester: number;
  trend: "up" | "down" | "stable";
}

export function EnhancedGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: "1",
      name: "Semester 1",
      courses: [{ id: "1", name: "", grade: "", credits: 3 }],
      isExpanded: true
    }
  ]);

  const [selectedScale, setSelectedScale] = useState(0);
  const [isWeighted, setIsWeighted] = useState(true);
  const [targetGPA, setTargetGPA] = useState(3.5);
  const [plannedCredits, setPlannedCredits] = useState(12);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate comprehensive GPA statistics
  const calculateStats = useCallback((): GPAStats => {
    const allCourses = semesters.flatMap(sem =>
      sem.courses.filter(c => c.name && c.grade)
    );

    const currentGPA = calculateGPA(allCourses, GRADING_SCALES[selectedScale], isWeighted);
    const totalCredits = allCourses.reduce((sum, course) => sum + course.credits, 0);

    // Calculate semester GPAs for trend analysis
    const semesterGPAs = semesters.map(sem => {
      const validCourses = sem.courses.filter(c => c.name && c.grade);
      return validCourses.length > 0
        ? calculateGPA(validCourses, GRADING_SCALES[selectedScale], isWeighted)
        : 0;
    }).filter(gpa => gpa > 0);

    const trend = semesterGPAs.length >= 2
      ? semesterGPAs[semesterGPAs.length - 1] > semesterGPAs[semesterGPAs.length - 2]
        ? "up" : semesterGPAs[semesterGPAs.length - 1] < semesterGPAs[semesterGPAs.length - 2]
        ? "down" : "stable"
      : "stable";

    return {
      current: currentGPA,
      target: targetGPA,
      totalCredits,
      totalCourses: allCourses.length,
      highestSemester: Math.max(...semesterGPAs, 0),
      lowestSemester: Math.min(...semesterGPAs, 4),
      trend
    };
  }, [semesters, selectedScale, isWeighted, targetGPA]);

  const stats = calculateStats();

  const addSemester = () => {
    const newId = (semesters.length + 1).toString();
    setSemesters([...semesters, {
      id: newId,
      name: `Semester ${semesters.length + 1}`,
      courses: [{ id: "1", name: "", grade: "", credits: 3 }],
      isExpanded: true
    }]);
  };

  const removeSemester = (semesterId: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== semesterId));
    }
  };

  const toggleSemester = (semesterId: string) => {
    setSemesters(semesters.map(s =>
      s.id === semesterId ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const addCourse = (semesterId: string) => {
    setSemesters(semesters.map(s =>
      s.id === semesterId
        ? {
            ...s,
            courses: [...s.courses, {
              id: Date.now().toString(),
              name: "",
              grade: "",
              credits: 3
            }]
          }
        : s
    ));
  };

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(s =>
      s.id === semesterId
        ? { ...s, courses: s.courses.filter(c => c.id !== courseId) }
        : s
    ));
  };

  const updateCourse = (semesterId: string, courseId: string, field: keyof Course, value: string | number) => {
    setSemesters(semesters.map(s =>
      s.id === semesterId
        ? {
            ...s,
            courses: s.courses.map(c =>
              c.id === courseId ? { ...c, [field]: value } : c
            )
          }
        : s
    ));
  };

  const gradeOptions = generateGradeOptions(GRADING_SCALES[selectedScale]);
  const suggestion = getImprovementSuggestion(stats.current, stats.target, stats.totalCredits, plannedCredits);

  const TrendIcon = stats.trend === "up" ? TrendingUp : stats.trend === "down" ? TrendingUp : Target;
  const trendColor = stats.trend === "up" ? "text-green-500" : stats.trend === "down" ? "text-red-500" : "text-gray-500";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with GPA Display */}
      <Card className="overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950 dark:via-gray-900 dark:to-amber-950">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-emerald-600" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Enhanced GPA Calculator
            </CardTitle>
            <Sparkles className="h-8 w-8 text-amber-500" />
          </div>

          {/* Large GPA Display */}
          <div className="relative">
            <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 dark:from-emerald-900 dark:to-amber-900 border-8 border-white dark:border-gray-800 shadow-xl">
              <div className="text-center">
                <div className="text-6xl font-bold text-emerald-600">{stats.current.toFixed(2)}</div>
                <div className="text-lg text-muted-foreground">Cumulative GPA</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  <span className="text-sm text-muted-foreground">
                    {stats.totalCredits} credits
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Ring */}
            <div className="absolute -top-4 -right-4 flex flex-col gap-2">
              <Badge variant="secondary" className="text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Highest: {stats.highestSemester.toFixed(2)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                {stats.totalCourses} courses
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Panel */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Calculator Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Grading Scale</Label>
              <Select value={selectedScale.toString()} onValueChange={(value) => setSelectedScale(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADING_SCALES.map((scale, index) => (
                    <SelectItem key={scale.name} value={index.toString()}>
                      {scale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Weighted Calculation
                <Switch
                  checked={isWeighted}
                  onCheckedChange={setIsWeighted}
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                {isWeighted ? "Credits affect the calculation" : "All courses weighted equally"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy GPA
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Share Results
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={addSemester}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Semester
                </Button>
              </div>
            </div>
          </div>

          {showAdvanced && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target GPA</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={targetGPA}
                    onChange={(e) => setTargetGPA(Number.parseFloat(e.target.value) || 0)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Planned Credits</Label>
                  <Input
                    type="number"
                    min="1"
                    value={plannedCredits}
                    onChange={(e) => setPlannedCredits(Number.parseInt(e.target.value) || 0)}
                    className="text-lg"
                  />
                </div>
              </div>

              {stats.totalCredits > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <Label className="text-sm font-medium">AI Suggestion</Label>
                      <p className="text-sm mt-1">{suggestion}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Semesters */}
      <div className="space-y-4">
        {semesters.map((semester, semesterIndex) => {
          const semesterGPA = calculateGPA(
            semester.courses.filter(c => c.name && c.grade),
            GRADING_SCALES[selectedScale],
            isWeighted
          );
          const semesterCredits = semester.courses
            .filter(c => c.name && c.grade)
            .reduce((sum, course) => sum + course.credits, 0);

          return (
            <Card key={semester.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSemester(semester.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-xl">{semester.name}</CardTitle>
                    <Badge variant="secondary" className="font-mono">
                      GPA: {semesterGPA.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {semesterCredits} credits
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addCourse(semester.id);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {semesters.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSemester(semester.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {semester.isExpanded && (
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div className="col-span-4">Course Name</div>
                      <div className="col-span-2">Grade</div>
                      <div className="col-span-2">Credits</div>
                      <div className="col-span-2">Points</div>
                      <div className="col-span-2">Actions</div>
                    </div>

                    {/* Course Rows */}
                    {semester.courses.map((course) => {
                      const gradePoint = GRADING_SCALES[selectedScale].scale[course.grade] || 0;
                      const points = gradePoint * course.credits;

                      return (
                        <div key={course.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="col-span-4">
                            <Input
                              placeholder="e.g., Calculus I"
                              value={course.name}
                              onChange={(e) => updateCourse(semester.id, course.id, "name", e.target.value)}
                              className="border-0 bg-transparent"
                            />
                          </div>
                          <div className="col-span-2">
                            <Select
                              value={course.grade}
                              onValueChange={(value) => updateCourse(semester.id, course.id, "grade", value)}
                            >
                              <SelectTrigger className="border-0 bg-transparent">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                {gradeOptions.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              value={course.credits}
                              onChange={(e) => updateCourse(semester.id, course.id, "credits", Number.parseInt(e.target.value) || 0)}
                              className="border-0 bg-transparent"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm font-mono bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded text-center">
                              {course.grade ? points.toFixed(1) : "—"}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCourse(semester.id, course.id)}
                              disabled={semester.courses.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      variant="outline"
                      onClick={() => addCourse(semester.id)}
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course to {semester.name}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Achievement System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Academic Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementGrid
            gpa={stats.current}
            totalCredits={stats.totalCredits}
            coursesCount={stats.totalCourses}
          />
        </CardContent>
      </Card>
    </div>
  );
}
