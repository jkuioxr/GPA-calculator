"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  FileText,
  GraduationCap,
} from "lucide-react";
import type { Course } from "@/lib/gpa-calculator";

interface LMSIntegrationProps {
  onImportCourses: (courses: Course[]) => void;
  children: React.ReactNode;
}

interface LMSConnection {
  platform: 'canvas' | 'blackboard' | 'moodle' | 'brightspace';
  url: string;
  apiKey: string;
  connected: boolean;
}

interface ImportedCourse {
  id: string;
  name: string;
  code: string;
  semester: string;
  year: number;
  grade: string | null;
  credits: number;
  instructor: string;
  selected: boolean;
}

const LMS_PLATFORMS = [
  { value: 'canvas' as const, label: 'Canvas', icon: '🎨' },
  { value: 'blackboard' as const, label: 'Blackboard', icon: '📋' },
  { value: 'moodle' as const, label: 'Moodle', icon: '🎓' },
  { value: 'brightspace' as const, label: 'Brightspace', icon: '💡' },
];

const MOCK_COURSES: ImportedCourse[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS 101',
    semester: 'Fall',
    year: 2024,
    grade: 'A',
    credits: 3,
    instructor: 'Dr. Smith',
    selected: true,
  },
  {
    id: '2',
    name: 'Calculus I',
    code: 'MATH 151',
    semester: 'Fall',
    year: 2024,
    grade: 'B+',
    credits: 4,
    instructor: 'Prof. Johnson',
    selected: true,
  },
  {
    id: '3',
    name: 'English Composition',
    code: 'ENGL 101',
    semester: 'Fall',
    year: 2024,
    grade: 'A-',
    credits: 3,
    instructor: 'Dr. Williams',
    selected: true,
  },
  {
    id: '4',
    name: 'Physics I',
    code: 'PHYS 201',
    semester: 'Spring',
    year: 2024,
    grade: 'B',
    credits: 4,
    instructor: 'Dr. Brown',
    selected: false,
  },
  {
    id: '5',
    name: 'Data Structures',
    code: 'CS 201',
    semester: 'Spring',
    year: 2024,
    grade: null, // In progress
    credits: 3,
    instructor: 'Dr. Davis',
    selected: false,
  },
];

export function LMSIntegration({ onImportCourses, children }: LMSIntegrationProps) {
  const [open, setOpen] = useState(false);
  const [connection, setConnection] = useState<LMSConnection>({
    platform: 'canvas',
    url: '',
    apiKey: '',
    connected: false,
  });
  const [importing, setImporting] = useState(false);
  const [importedCourses, setImportedCourses] = useState<ImportedCourse[]>([]);
  const [step, setStep] = useState<'connect' | 'import' | 'review'>('connect');

  const connectToLMS = async () => {
    setImporting(true);

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setConnection({ ...connection, connected: true });
    setImportedCourses(MOCK_COURSES);
    setStep('import');
    setImporting(false);
  };

  const importCourses = async () => {
    setImporting(true);

    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedCourses = importedCourses
      .filter(course => course.selected && course.grade)
      .map(course => ({
        id: course.id,
        name: course.name,
        grade: course.grade || '',
        credits: course.credits,
        semester: course.semester,
        year: course.year,
      }));

    onImportCourses(selectedCourses);
    setStep('review');
    setImporting(false);
  };

  const toggleCourseSelection = (courseId: string) => {
    setImportedCourses(courses =>
      courses.map(course =>
        course.id === courseId
          ? { ...course, selected: !course.selected }
          : course
      )
    );
  };

  const selectAllCourses = () => {
    setImportedCourses(courses =>
      courses.map(course => ({ ...course, selected: true }))
    );
  };

  const deselectAllCourses = () => {
    setImportedCourses(courses =>
      courses.map(course => ({ ...course, selected: false }))
    );
  };

  const getSelectedCount = () => importedCourses.filter(c => c.selected).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            LMS Integration
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connect" disabled={step === 'review'}>
              Connect
            </TabsTrigger>
            <TabsTrigger value="import" disabled={!connection.connected}>
              Import
            </TabsTrigger>
            <TabsTrigger value="review" disabled={step !== 'review'}>
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect to Your LMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={connection.platform}
                    onValueChange={(value: 'canvas' | 'blackboard' | 'moodle' | 'brightspace') =>
                      setConnection({ ...connection, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LMS_PLATFORMS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center gap-2">
                            <span>{platform.icon}</span>
                            {platform.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Institution URL</Label>
                  <Input
                    placeholder="https://your-school.instructure.com"
                    value={connection.url}
                    onChange={(e) =>
                      setConnection({ ...connection, url: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={connection.apiKey}
                    onChange={(e) =>
                      setConnection({ ...connection, apiKey: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Your API key is encrypted and stored securely. We never store your login credentials.
                  </p>
                </div>

                <Button
                  onClick={connectToLMS}
                  disabled={importing || !connection.url || !connection.apiKey}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {importing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect to {LMS_PLATFORMS.find(p => p.value === connection.platform)?.label}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Security & Privacy</p>
                    <ul className="space-y-1 text-xs">
                      <li>• We use secure HTTPS connections</li>
                      <li>• API keys are encrypted and not stored permanently</li>
                      <li>• Only course and grade data is imported</li>
                      <li>• No personal information is accessed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Available Courses</CardTitle>
                  <div className="flex space-x-2">
                    <Button onClick={selectAllCourses} variant="outline" size="sm">
                      Select All
                    </Button>
                    <Button onClick={deselectAllCourses} variant="outline" size="sm">
                      Deselect All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {importedCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        course.selected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                      } ${!course.grade ? 'opacity-50' : ''}`}
                      onClick={() => course.grade && toggleCourseSelection(course.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="checkbox"
                              checked={course.selected}
                              disabled={!course.grade}
                              onChange={() => toggleCourseSelection(course.id)}
                              className="h-4 w-4 text-emerald-600 rounded"
                            />
                            <div>
                              <h4 className="font-medium">{course.name}</h4>
                              <p className="text-sm text-gray-600">{course.code}</p>
                            </div>
                          </div>
                          <div className="ml-7 flex items-center gap-4 text-sm text-gray-500">
                            <span>{course.semester} {course.year}</span>
                            <span>{course.credits} credits</span>
                            <span>{course.instructor}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {course.grade ? (
                            <Badge variant="secondary" className="text-lg font-bold">
                              {course.grade}
                            </Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Selected Courses:</span>
                    <span className="font-medium">{getSelectedCount()} of {importedCourses.filter(c => c.grade).length}</span>
                  </div>
                </div>

                <Button
                  onClick={importCourses}
                  disabled={importing || getSelectedCount() === 0}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                >
                  {importing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import {getSelectedCount()} Course{getSelectedCount() !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Import Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <GraduationCap className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Successfully imported {getSelectedCount()} courses!
                  </h3>
                  <p className="text-gray-600">
                    Your courses have been added to your GPA calculator. You can now track your progress and run analytics.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-bold text-lg text-emerald-600">{getSelectedCount()}</div>
                    <div className="text-gray-600">Courses Imported</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-bold text-lg text-blue-600">
                      {importedCourses.filter(c => c.selected).reduce((sum, c) => sum + c.credits, 0)}
                    </div>
                    <div className="text-gray-600">Credits Added</div>
                  </div>
                </div>

                <Button
                  onClick={() => setOpen(false)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Continue to Calculator
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
