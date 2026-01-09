import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, BarChart3, FileText, Sparkles, Calendar, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Application Tracker",
    description:
      "Keep a detailed record of all your job applications, including company details, job titles, application dates, and current status.",
  },
  {
    icon: BarChart3,
    title: "Activity Dashboard",
    description:
      "Visualize your job search progress with an interactive dashboard that provides insights into your application activities and success rates.",
  },
  {
    icon: FileText,
    title: "Resume Management",
    description:
      "Store and manage multiple resumes. Use AI to get reviews and match your resume with job descriptions for better opportunities.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description:
      "Leverage AI to improve your resumes and get personalized job matching with scoring to identify the best opportunities.",
  },
  {
    icon: Calendar,
    title: "Activity Tracking",
    description:
      "Track your job search activities, interviews, networking events, and time spent on each activity to stay organized.",
  },
  {
    icon: CheckCircle2,
    title: "Self-Hosted",
    description:
      "Self-hosted for full control over your data and privacy.",
  },
];

export function LandingFeatures() {
  return (
    <section className="container py-20 md:py-32">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to streamline your job search process
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

