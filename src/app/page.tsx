// Enhanced GPA Calculator - Surpasses gpacalculator.io in every aspect
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  GraduationCap,
  TrendingUp,
  Users,
  Star,
  BookOpen,
  Award,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Menu,
  X
} from "lucide-react";
import { EnhancedGPACalculator } from "@/components/enhanced-gpa-calculator";
import { ThemeToggle } from "@/components/theme-toggle";
import { PricingSection } from "@/components/pricing-section";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { user, logout } = useAuth();

// ... existing code ... <features, testimonials, and faqs arrays>

  const features = [
    {
      id: "advanced-calculation",
      icon: <Calculator className="h-8 w-8" />,
      title: "Advanced GPA Calculation",
      description: "Support for multiple grading systems, weighted and unweighted calculations with real-time results."
    },
    {
      id: "academic-analytics",
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Academic Analytics",
      description: "Track your progress with detailed charts, trend analysis, and predictive insights."
    },
    {
      id: "what-if-scenarios",
      icon: <BookOpen className="h-8 w-8" />,
      title: "What-If Scenarios",
      description: "Plan your future with hypothetical grade calculations and improvement suggestions."
    },
    {
      id: "achievement-system",
      icon: <Award className="h-8 w-8" />,
      title: "Achievement System",
      description: "Earn badges and points for academic milestones and consistent performance."
    }
  ];

  const testimonials = [
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      role: "Harvard University",
      quote: "This GPA calculator helped me plan my courses strategically to maintain my Dean's List status.",
      rating: 5
    },
    {
      id: "michael-rodriguez",
      name: "Michael Rodriguez",
      role: "Stanford University",
      quote: "The what-if scenarios are incredibly useful for academic planning. Best tool I've used!",
      rating: 5
    },
    {
      id: "emily-johnson",
      name: "Emily Johnson",
      role: "Academic Advisor",
      quote: "I recommend this to all my students. The analytics and reporting features are outstanding.",
      rating: 5
    }
  ];

  const faqs = [
    {
      id: "accuracy",
      question: "How accurate are the GPA calculations?",
      answer: "Our calculations follow standard academic formulas and support multiple grading scales. The accuracy depends on the correct input of your grades and credit hours."
    },
    {
      id: "save-data",
      question: "Can I save my data for future use?",
      answer: "Yes! Create a free account to save your courses and track your GPA over time. Premium plans offer extended data retention."
    },
    {
      id: "grading-systems",
      question: "Do you support different grading systems?",
      answer: "Absolutely! We support 4.0 scale, percentage-based systems, and custom grading scales used by different institutions."
    },
    {
      id: "premium-plans",
      question: "What's included in the premium plans?",
      answer: "Premium plans include extended data storage (6 years for Plus, lifetime for Pro), advanced analytics, PDF reports, and priority support."
    },
    {
      id: "data-security",
      question: "Is my academic data secure?",
      answer: "Yes, we use SSL encryption and follow strict privacy standards. Your academic information is never shared with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-800">GPACalc</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">Pro</Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#calculator" className="text-sm font-medium hover:text-emerald-600 transition-colors">Calculator</a>
            <a href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-emerald-600 transition-colors">Reviews</a>
            <a href="#pricing" className="text-sm font-medium hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium hover:text-emerald-600 transition-colors">FAQ</a>
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AuthDialog>
                  <Button variant="outline" size="sm">Sign In</Button>
                </AuthDialog>
                <AuthDialog>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                </AuthDialog>
              </div>
            )}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <a href="#calculator" className="block py-2 text-sm font-medium">Calculator</a>
              <a href="#features" className="block py-2 text-sm font-medium">Features</a>
              <a href="#testimonials" className="block py-2 text-sm font-medium">Reviews</a>
              <a href="#pricing" className="block py-2 text-sm font-medium">Pricing</a>
              <a href="#faq" className="block py-2 text-sm font-medium">FAQ</a>
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                {user ? (
                  <div className="space-y-2">
                    <Link href="/dashboard">
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AuthDialog>
                      <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                    </AuthDialog>
                    <AuthDialog>
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                    </AuthDialog>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>



      {/* Hero Section with Calculator */}
      <section id="calculator" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-emerald-900 mb-6">
              Calculate Your GPA with
              <span className="text-emerald-600"> Precision</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The most advanced GPA calculator designed for students, educators, and academic advisors.
              Track, analyze, and plan your academic success with Ivy League precision.
            </p>
            <div className="flex justify-center space-x-4 mb-12">
              <Badge variant="secondary" className="text-sm">Multi-Institution Support</Badge>
              <Badge variant="secondary" className="text-sm">What-If Scenarios</Badge>
              <Badge variant="secondary" className="text-sm">Advanced Analytics</Badge>
            </div>
          </div>

          <EnhancedGPACalculator />
        </div>
      </section>

      {/* How to Use Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
              How to Use GPACalc
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and unlock powerful academic insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Courses</h3>
              <p className="text-gray-600">Add your course names, grades, and credit hours using our intuitive interface.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Scale</h3>
              <p className="text-gray-600">Select your institution's grading scale and calculation method for accurate results.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
              <p className="text-gray-600">View your GPA instantly and explore what-if scenarios for future planning.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-emerald-600 mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how GPACalc is helping students achieve their academic goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`${testimonial.id}-star-${i}`} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-emerald-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about GPACalc
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={faq.id}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8" />
                <span className="text-2xl font-bold">GPACalc</span>
              </div>
              <p className="text-emerald-100 mb-6 max-w-md">
                Empowering students worldwide with advanced GPA calculation and academic planning tools.
                Achieve your academic goals with precision and confidence.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-white hover:text-emerald-200">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-emerald-200">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-emerald-200">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-emerald-200">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-emerald-100">
                <li><a href="#calculator" className="hover:text-white transition-colors">GPA Calculator</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Analytics Dashboard</Link></li>
                <li><a href="/planner" className="hover:text-white transition-colors">What-If Planner</a></li>
                <li><a href="/reports" className="hover:text-white transition-colors">Custom Reports</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-emerald-100">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-emerald-100">
            <p>&copy; 2025 GPACalc. All rights reserved. Built with academic excellence in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
