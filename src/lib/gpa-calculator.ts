export interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  isHypothetical?: boolean;
  semester?: string;
  year?: number;
}

export interface GradingScale {
  name: string;
  scale: { [key: string]: number };
}

export interface Semester {
  id: string;
  name: string;
  year: number;
  courses: Course[];
  gpa: number;
}

export const GRADING_SCALES: GradingScale[] = [
  {
    name: "4.0 Scale",
    scale: {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    }
  },
  {
    name: "Percentage to 4.0",
    scale: {
      "97-100": 4.0, "93-96": 4.0, "90-92": 3.7,
      "87-89": 3.3, "83-86": 3.0, "80-82": 2.7,
      "77-79": 2.3, "73-76": 2.0, "70-72": 1.7,
      "67-69": 1.3, "65-66": 1.0, "Below 65": 0.0
    }
  }
];

export function calculateGPA(courses: Course[], gradingScale: GradingScale, weighted = true): number {
  if (courses.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const gradePoint = gradingScale.scale[course.grade];
    if (gradePoint !== undefined) {
      if (weighted) {
        totalPoints += gradePoint * course.credits;
        totalCredits += course.credits;
      } else {
        totalPoints += gradePoint;
        totalCredits += 1;
      }
    }
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function calculateCumulativeGPA(semesters: Course[][], gradingScale: GradingScale): number {
  const allCourses = semesters.flat();
  return calculateGPA(allCourses, gradingScale, true);
}

export function calculateWhatIfGPA(
  currentCourses: Course[],
  hypotheticalCourses: Course[],
  gradingScale: GradingScale
): number {
  const allCourses = [...currentCourses, ...hypotheticalCourses];
  return calculateGPA(allCourses, gradingScale, true);
}

export function getImprovementSuggestion(
  currentGPA: number,
  targetGPA: number,
  currentCredits: number,
  plannedCredits: number
): string {
  if (currentGPA >= targetGPA) {
    return `Great! You've already achieved your target GPA of ${targetGPA.toFixed(2)}.`;
  }

  const requiredTotalPoints = targetGPA * (currentCredits + plannedCredits);
  const currentTotalPoints = currentGPA * currentCredits;
  const neededPoints = requiredTotalPoints - currentTotalPoints;
  const requiredAverage = neededPoints / plannedCredits;

  if (requiredAverage > 4.0) {
    return `To reach a ${targetGPA.toFixed(2)} GPA, you would need an average of ${requiredAverage.toFixed(2)} in your next ${plannedCredits} credits, which is above the maximum. Consider taking more credits or adjusting your target.`;
  }

  return `To reach a ${targetGPA.toFixed(2)} GPA, you need an average of ${requiredAverage.toFixed(2)} in your next ${plannedCredits} credits.`;
}

export function generateGradeOptions(gradingScale: GradingScale): string[] {
  return Object.keys(gradingScale.scale);
}

export function calculateSemesterGPAs(semesters: Semester[], gradingScale: GradingScale): Semester[] {
  return semesters.map(semester => ({
    ...semester,
    gpa: calculateGPA(semester.courses, gradingScale, true)
  }));
}
