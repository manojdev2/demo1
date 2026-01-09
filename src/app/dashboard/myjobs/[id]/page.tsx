import { getJobDetails } from "@/actions/job.actions";
import JobDetails from "@/components/myjobs/JobDetails";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface JobDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getJobDetails(id);

  if (!result || !("success" in result) || !result.success || !("job" in result) || !result.job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${result.job.JobTitle.label} at ${result.job.Company.label} - Anentaa`,
    description: `Job application details for ${result.job.JobTitle.label} position at ${result.job.Company.label}`,
  };
}

async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const result = await getJobDetails(id);

  if (!result || !("success" in result) || !result.success || !("job" in result) || !result.job) {
    notFound();
  }

  return (
    <div className="col-span-3">
      <JobDetails job={result.job} />
    </div>
  );
}

export default JobDetailsPage;
