"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Calculator } from "lucide-react";
import { AchievementGrid } from "@/components/achievement-badge";
import {
  type Course,
  GRADING_SCALES,
  calculateGPA,
  generateGradeOptions,
  getImprovementSuggestion
} from "@/lib/gpa-calculator";

export function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", grade: "", credits: 3 }
  ]);
  const [selectedScale, setSelectedScale] = useState(0);
  const [isWeighted, setIsWeighted] = useState(true);
  const [targetGPA, setTargetGPA] = useState(3.5);
  const [plannedCredits, setPlannedCredits] = useState(12);

  const currentGPA = calculateGPA(
    courses.filter(c => c.name && c.grade),
    GRADING_SCALES[selectedScale],
    isWeighted
  );

  const totalCredits = courses
    .filter(c => c.name && c.grade)
    .reduce((sum, course) => sum + course.credits, 0);

  const suggestion = getImprovementSuggestion(
    currentGPA,
    targetGPA,
    totalCredits,
    plannedCredits
  );

  const addCourse = () => {
    setCourses([...courses, {
      id: Date.now().toString(),
      name: "",
      grade: "",
      credits: 3
    }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const gradeOptions = generateGradeOptions(GRADING_SCALES[selectedScale]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Calculator className="h-6 w-6" />
          GPA Calculator
        </CardTitle>
        <p className="text-muted-foreground">
          Calculate your GPA instantly with our advanced calculator
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label>Calculation Type</Label>
            <Select value={isWeighted ? "weighted" : "unweighted"} onValueChange={(value) => setIsWeighted(value === "weighted")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weighted">Weighted (by credits)</SelectItem>
                <SelectItem value="unweighted">Unweighted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Current GPA Display */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div>
              <div className="text-3xl font-bold text-primary">{currentGPA.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Current GPA</div>
            </div>
            <div>
              <div className="text-xl font-semibold">{totalCredits}</div>
              <div className="text-sm text-muted-foreground">Total Credits</div>
            </div>
          </div>
        </div>

        {/* Course Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg">Courses</Label>
            <Button onClick={addCourse} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>

          <div className="space-y-3">
            {courses.map((course, index) => (
              <div key={course.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <Label className="text-sm">Course Name</Label>
                  <Input
                    placeholder="e.g., Calculus I"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Grade</Label>
                  <Select value={course.grade} onValueChange={(value) => updateCourse(course.id, "grade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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
                <div>
                  <Label className="text-sm">Credits</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Setting */}
        <Separator />
        <div className="space-y-4">
          <Label className="text-lg">Goal Planning</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label>Planned Credits</Label>
              <Input
                type="number"
                min="1"
                value={plannedCredits}
                onChange={(e) => setPlannedCredits(Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {totalCredits > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Improvement Suggestion</Label>
              <p className="text-sm mt-1">{suggestion}</p>
            </div>
          )}
        </div>

        {/* Achievement System */}
        <Separator />
        <AchievementGrid
          gpa={currentGPA}
          totalCredits={totalCredits}
          coursesCount={courses.filter(c => c.name && c.grade).length}
        />
      </CardContent>
    </Card>
  );
}
