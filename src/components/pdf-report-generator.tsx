"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  FileText,
  Download,
  Share,
  Loader2,
  CheckCircle,
} from "lucide-react";
import type { Semester } from "@/lib/gpa-calculator";
import { format } from "date-fns";

interface PDFReportGeneratorProps {
  semesters: Semester[];
  currentGPA: number;
  totalCredits: number;
  children: React.ReactNode;
}

interface ReportSettings {
  title: string;
  includePersonalInfo: boolean;
  includeCourseDetails: boolean;
  includeAnalytics: boolean;
  includeAchievements: boolean;
  template: 'academic' | 'professional' | 'transcript';
  notes: string;
}

interface CourseType {
  grade: string;
  credits: number;
}

export function PDFReportGenerator({
  semesters,
  currentGPA,
  totalCredits,
  children,
}: PDFReportGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [settings, setSettings] = useState<ReportSettings>({
    title: "Academic Progress Report",
    includePersonalInfo: true,
    includeCourseDetails: true,
    includeAnalytics: true,
    includeAchievements: true,
    template: 'academic',
    notes: "",
  });

  const generatePDF = async () => {
    setGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(settings.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Summary Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Academic Summary', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      const summaryData = [
        ['Current GPA:', currentGPA.toFixed(2)],
        ['Total Credits:', totalCredits.toString()],
        ['Total Semesters:', semesters.length.toString()],
        ['Total Courses:', semesters.reduce((sum, sem) => sum + sem.courses.length, 0).toString()],
      ];

      for (const [label, value] of summaryData) {
        pdf.text(label, 25, yPosition);
        pdf.text(value, 80, yPosition);
        yPosition += 7;
      }

      yPosition += 10;

      // Course Details
      if (settings.includeCourseDetails) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Course History', 20, yPosition);
        yPosition += 10;

        for (const semester of semesters) {
          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${semester.name} ${semester.year}`, 25, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');

          // Table headers
          pdf.text('Course', 30, yPosition);
          pdf.text('Grade', 120, yPosition);
          pdf.text('Credits', 150, yPosition);
          yPosition += 5;

          // Draw line under headers
          pdf.line(30, yPosition, 170, yPosition);
          yPosition += 5;

          for (const course of semester.courses) {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.text(course.name.substring(0, 40), 30, yPosition);
            pdf.text(course.grade || 'N/A', 120, yPosition);
            pdf.text(course.credits.toString(), 150, yPosition);
            yPosition += 6;
          }

          // Semester GPA
          const semesterGPA = calculateSemesterGPA(semester.courses);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Semester GPA: ${semesterGPA.toFixed(2)}`, 30, yPosition + 5);
          yPosition += 15;
        }
      }

      // Analytics Section
      if (settings.includeAnalytics && yPosition < pageHeight - 40) {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Performance Analytics', 20, yPosition);
        yPosition += 10;

        const gradeDistribution = calculateGradeDistribution();
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');

        for (const [grade, count] of Object.entries(gradeDistribution)) {
          pdf.text(`${grade}: ${count} courses`, 25, yPosition);
          yPosition += 7;
        }
      }

      // Notes
      if (settings.notes.trim()) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const noteLines = pdf.splitTextToSize(settings.notes, pageWidth - 40);
        pdf.text(noteLines, 25, yPosition);
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Generated by GPACalc - Academic Progress Tracker', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`${settings.title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);

      setOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  const calculateSemesterGPA = (courses: CourseType[]) => {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const gradePoint = getGradePoint(course.grade);
      totalPoints += gradePoint * course.credits;
      totalCredits += course.credits;
    }

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
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

  const calculateGradeDistribution = () => {
    const distribution: { [key: string]: number } = {};

    for (const semester of semesters) {
      for (const course of semester.courses) {
        if (course.grade) {
          distribution[course.grade] = (distribution[course.grade] || 0) + 1;
        }
      }
    }

    return distribution;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate PDF Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) =>
                  setSettings({ ...settings, title: e.target.value })
                }
                placeholder="Academic Progress Report"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template Style</Label>
              <Select
                value={settings.template}
                onValueChange={(value: 'academic' | 'professional' | 'transcript') =>
                  setSettings({ ...settings, template: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Report</SelectItem>
                  <SelectItem value="professional">Professional Summary</SelectItem>
                  <SelectItem value="transcript">Transcript Style</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Include Sections</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeCourseDetails}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        includeCourseDetails: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Course Details</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeAnalytics}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        includeAnalytics: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Performance Analytics</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeAchievements}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        includeAchievements: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Achievements</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={settings.notes}
                onChange={(e) =>
                  setSettings({ ...settings, notes: e.target.value })
                }
                placeholder="Add any additional notes or comments..."
                rows={3}
              />
            </div>
          </div>

          {/* Preview Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Report Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Semesters:</span>
                <span>{semesters.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Courses:</span>
                <span>{semesters.reduce((sum, sem) => sum + sem.courses.length, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current GPA:</span>
                <span>{currentGPA.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={generatePDF}
              disabled={generating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
