"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with GPA tracking",
    features: [
      "Basic GPA calculator",
      "Up to 20 courses",
      "Achievement badges",
      "What-if scenarios",
      "1 semester history"
    ],
    limitations: [
      "Limited data retention",
      "No PDF reports",
      "No email sharing"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    id: "plus",
    name: "Plus",
    price: "$4.99",
    period: "month",
    description: "Advanced features for serious students",
    features: [
      "Everything in Free",
      "Unlimited courses",
      "Advanced analytics",
      "PDF report generation",
      "Email sharing",
      "6 years data retention",
      "Semester comparisons",
      "Grade trend analysis"
    ],
    limitations: [],
    buttonText: "Start Plus Trial",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "month",
    description: "Complete academic management suite",
    features: [
      "Everything in Plus",
      "Lifetime data retention",
      "LMS integration",
      "Custom report templates",
      "Priority support",
      "Academic advisor sharing",
      "Bulk grade import",
      "Advanced what-if modeling",
      "Goal setting & tracking"
    ],
    limitations: [],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your academic journey. All plans include our core GPA calculator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative hover:shadow-lg transition-shadow ${
                plan.popular ? 'ring-2 ring-emerald-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period !== "forever" && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className={`w-full ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-900">
                    Features Included
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                      Limitations
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>✓ Cancel anytime</span>
            <span>✓ Student discounts available</span>
            <span>✓ Educational institution pricing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
