import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="container py-20 md:py-32">
      <div className="mx-auto flex max-w-[800px] flex-col items-center gap-8 rounded-lg border bg-muted/50 p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to Transform Your Job Search?
        </h2>
        <p className="text-lg text-muted-foreground">
          Join Anentaa today and take the first step towards a more organized
          and successful job search journey.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/signin">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Already have an account?
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

