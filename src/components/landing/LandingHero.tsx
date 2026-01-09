import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="w-full">
      <div className="container flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-0 pb-4 md:pt-0 md:pb-6 lg:pt-0 lg:pb-8 px-4 md:px-6">
        <div className="flex-1 flex flex-col gap-6 lg:max-w-[550px] lg:border-r-2 lg:pr-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-900">
              Take Control of Your
              <br />
              <span className="bg-gradient-to-r from-[#059861] to-[#06b875] bg-clip-text text-transparent">
                Job Search Journey
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Anentaa is your all-in-one job application tracking system. Manage
              applications, track your progress, and leverage AI-powered insights
              to land your dream job faster.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#059861]/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059861]" />
              </div>
              <span className="text-sm md:text-base text-gray-700">
                Track all your job applications in one place
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#059861]/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059861]" />
              </div>
              <span className="text-sm md:text-base text-gray-700">
                AI-powered resume reviews and job matching
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#059861]/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059861]" />
              </div>
              <span className="text-sm md:text-base text-gray-700">
                Visualize your progress with interactive dashboards
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/signup">
              <Button
                className="bg-[#059861] hover:bg-[#047a4d] text-white text-sm px-5 py-2.5 h-auto rounded-md shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                variant="outline"
                className="text-sm px-5 py-2.5 h-auto rounded-md border w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center lg:justify-end lg:pl-12">
          <div className="relative w-full max-w-[550px] lg:max-w-[650px] aspect-[9/16] rounded-lg overflow-hidden h-[80vh]">
            <iframe
              src="https://player.vimeo.com/video/1117851937?h=0267c9d4e9&autoplay=1&loop=1&muted=1&playsinline=1&controls=0&background=1"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Anentaa Hero Video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

