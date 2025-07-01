"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle,
  Users,
  GraduationCap,
} from "lucide-react";
import type { Semester } from "@/lib/gpa-calculator";
import { format } from "date-fns";

interface EmailSharingProps {
  semesters: Semester[];
  currentGPA: number;
  totalCredits: number;
  children: React.ReactNode;
}

interface EmailData {
  recipients: string[];
  subject: string;
  message: string;
  template: 'parent' | 'advisor' | 'custom';
  includeAttachment: boolean;
}

interface CourseType {
  grade: string;
  credits: number;
}

const EMAIL_TEMPLATES = {
  parent: {
    subject: "Academic Progress Update - {semester}",
    message: `Dear Parents,

I wanted to share my academic progress update with you.

Current GPA: {gpa}
Total Credits Completed: {credits}
Recent Achievements: {achievements}

{customMessage}

This report was generated using GPACalc academic tracking system.

Best regards,
{studentName}`
  },
  advisor: {
    subject: "Academic Progress Report - {studentName}",
    message: `Dear Academic Advisor,

Please find my current academic progress summary below:

Current Cumulative GPA: {gpa}
Total Credits: {credits}
Semesters Completed: {semesters}

{recentPerformance}

{customMessage}

I would appreciate the opportunity to discuss my academic goals and any recommendations you might have.

Sincerely,
{studentName}`
  },
  custom: {
    subject: "Academic Progress Update",
    message: `Hello,

I wanted to share my academic progress with you.

Current GPA: {gpa}
Total Credits: {credits}

{customMessage}

Best regards`
  }
};

export function EmailSharing({
  semesters,
  currentGPA,
  totalCredits,
  children,
}: EmailSharingProps) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState("");
  const [emailData, setEmailData] = useState<EmailData>({
    recipients: [],
    subject: "",
    message: "",
    template: 'parent',
    includeAttachment: false,
  });

  const addRecipient = () => {
    if (currentRecipient && isValidEmail(currentRecipient)) {
      setEmailData({
        ...emailData,
        recipients: [...emailData.recipients, currentRecipient],
      });
      setCurrentRecipient("");
    }
  };

  const removeRecipient = (email: string) => {
    setEmailData({
      ...emailData,
      recipients: emailData.recipients.filter(r => r !== email),
    });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateEmailContent = () => {
    const template = EMAIL_TEMPLATES[emailData.template];
    const recentSemester = semesters[semesters.length - 1];
    const recentPerformance = recentSemester
      ? `Recent Semester: ${recentSemester.name} ${recentSemester.year} - GPA: ${calculateSemesterGPA(recentSemester.courses).toFixed(2)}`
      : "";

    const subject = template.subject
      .replace('{semester}', recentSemester ? `${recentSemester.name} ${recentSemester.year}` : 'Current')
      .replace('{studentName}', 'Student');

    const message = template.message
      .replace('{gpa}', currentGPA.toFixed(2))
      .replace('{credits}', totalCredits.toString())
      .replace('{semesters}', semesters.length.toString())
      .replace('{achievements}', getRecentAchievements())
      .replace('{recentPerformance}', recentPerformance)
      .replace('{customMessage}', emailData.message || '')
      .replace('{studentName}', 'Student');

    return { subject, message };
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

  const getRecentAchievements = () => {
    const achievements = [];
    if (currentGPA >= 3.5) achievements.push("Dean's List eligible");
    if (currentGPA >= 3.7) achievements.push("Magna Cum Laude track");
    if (totalCredits >= 30) achievements.push("Sophomore standing");

    return achievements.length > 0 ? achievements.join(", ") : "Steady academic progress";
  };

  const sendEmail = async () => {
    setSending(true);

    try {
      const { subject, message } = generateEmailContent();

      // Simulate email sending (in a real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically call your email API
      console.log('Sending email:', {
        recipients: emailData.recipients,
        subject,
        message,
        includeAttachment: emailData.includeAttachment,
      });

      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
      }, 2000);

    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Sent Successfully!</h3>
            <p className="text-gray-600">
              Your progress report has been sent to {emailData.recipients.length} recipient(s).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Share Progress Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select
              value={emailData.template}
              onValueChange={(value: 'parent' | 'advisor' | 'custom') =>
                setEmailData({ ...emailData, template: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Parent/Guardian
                  </div>
                </SelectItem>
                <SelectItem value="advisor">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Academic Advisor
                  </div>
                </SelectItem>
                <SelectItem value="custom">Custom Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <Label>Recipients</Label>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={currentRecipient}
                onChange={(e) => setCurrentRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
              />
              <Button
                onClick={addRecipient}
                variant="outline"
                disabled={!currentRecipient || !isValidEmail(currentRecipient)}
              >
                Add
              </Button>
            </div>

            {emailData.recipients.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {emailData.recipients.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeRecipient(email)}
                    >
                      {email} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subject Preview */}
          <div className="space-y-2">
            <Label>Subject Line</Label>
            <Input
              value={generateEmailContent().subject}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label>
              {emailData.template === 'custom' ? 'Message' : 'Additional Message'}
            </Label>
            <Textarea
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              placeholder={
                emailData.template === 'custom'
                  ? "Write your custom message..."
                  : "Add any additional notes (optional)..."
              }
              rows={4}
            />
          </div>

          {/* Message Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Message Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap max-h-32 overflow-y-auto">
                {generateEmailContent().message}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={emailData.includeAttachment}
                onChange={(e) =>
                  setEmailData({
                    ...emailData,
                    includeAttachment: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Include PDF report as attachment</span>
            </label>
          </div>

          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Current GPA:</span>
                  <span className="ml-2">{currentGPA.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium">Total Credits:</span>
                  <span className="ml-2">{totalCredits}</span>
                </div>
                <div>
                  <span className="font-medium">Semesters:</span>
                  <span className="ml-2">{semesters.length}</span>
                </div>
                <div>
                  <span className="font-medium">Recipients:</span>
                  <span className="ml-2">{emailData.recipients.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={sendEmail}
              disabled={sending || emailData.recipients.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
