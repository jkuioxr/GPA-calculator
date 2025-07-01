"use client";

import { Badge } from "@/components/ui/badge";
import {
  Award,
  Trophy,
  Star,
  Target,
  TrendingUp,
  BookOpen,
  Zap,
  Crown,
  type LucideIcon
} from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  earned: boolean;
  condition: (gpa: number, totalCredits: number, coursesCount: number) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-calculation",
    name: "Getting Started",
    description: "Complete your first GPA calculation",
    icon: Zap,
    color: "bg-blue-500",
    earned: false,
    condition: (_, __, coursesCount) => coursesCount >= 1
  },
  {
    id: "deans-list",
    name: "Dean's List",
    description: "Achieve a GPA of 3.5 or higher",
    icon: Award,
    color: "bg-emerald-500",
    earned: false,
    condition: (gpa) => gpa >= 3.5
  },
  {
    id: "magna-cum-laude",
    name: "Magna Cum Laude",
    description: "Achieve a GPA of 3.7 or higher",
    icon: Trophy,
    color: "bg-amber-500",
    earned: false,
    condition: (gpa) => gpa >= 3.7
  },
  {
    id: "summa-cum-laude",
    name: "Summa Cum Laude",
    description: "Achieve a GPA of 3.9 or higher",
    icon: Crown,
    color: "bg-purple-500",
    earned: false,
    condition: (gpa) => gpa >= 3.9
  },
  {
    id: "perfect-score",
    name: "Perfectionist",
    description: "Achieve a perfect 4.0 GPA",
    icon: Star,
    color: "bg-yellow-500",
    earned: false,
    condition: (gpa) => gpa === 4.0
  },
  {
    id: "course-master",
    name: "Course Master",
    description: "Track 10 or more courses",
    icon: BookOpen,
    color: "bg-indigo-500",
    earned: false,
    condition: (_, __, coursesCount) => coursesCount >= 10
  },
  {
    id: "credit-accumulator",
    name: "Credit Accumulator",
    description: "Accumulate 30 or more credit hours",
    icon: Target,
    color: "bg-green-500",
    earned: false,
    condition: (_, totalCredits) => totalCredits >= 30
  },
  {
    id: "consistent-performer",
    name: "Consistent Performer",
    description: "Maintain above 3.0 GPA with 15+ credits",
    icon: TrendingUp,
    color: "bg-teal-500",
    earned: false,
    condition: (gpa, totalCredits) => gpa >= 3.0 && totalCredits >= 15
  }
];

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
}

export function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const Icon = achievement.icon;

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`
          ${sizeClasses[size]}
          ${achievement.earned ? achievement.color : 'bg-gray-300'}
          rounded-full flex items-center justify-center text-white
          ${achievement.earned ? 'shadow-lg' : 'opacity-50'}
          transition-all duration-200
        `}
      >
        <Icon className={iconSizes[size]} />
      </div>
      <div className="text-center">
        <div className={`font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {achievement.name}
        </div>
        {size !== 'sm' && (
          <div className="text-xs text-muted-foreground max-w-20 text-center">
            {achievement.description}
          </div>
        )}
      </div>
      {achievement.earned && (
        <Badge variant="secondary" className="text-xs">
          Earned!
        </Badge>
      )}
    </div>
  );
}

interface AchievementGridProps {
  gpa: number;
  totalCredits: number;
  coursesCount: number;
}

export function AchievementGrid({ gpa, totalCredits, coursesCount }: AchievementGridProps) {
  const updatedAchievements = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    earned: achievement.condition(gpa, totalCredits, coursesCount)
  }));

  const earnedCount = updatedAchievements.filter(a => a.earned).length;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Achievements</h3>
        <p className="text-sm text-muted-foreground">
          {earnedCount} of {ACHIEVEMENTS.length} earned
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {updatedAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}
