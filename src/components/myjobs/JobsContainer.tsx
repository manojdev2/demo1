"use client";
import {
  Card,
  CardContent,
  CardHeader,
} from "../ui/card";
import Loading from "../Loading";
import {
  Company,
  JobLocation,
  JobSource,
  JobStatus,
  JobTitle,
} from "@/models/job.model";
import { useJobsContainer } from "./hooks/useJobsContainer";
import { JobsContainerHeader } from "./JobsContainerHeader";
import { JobsContainerContent } from "./JobsContainerContent";
import { JobsContainerEmptyState } from "./JobsContainerEmptyState";

type MyJobsProps = {
  statuses: JobStatus[];
  companies: Company[];
  titles: JobTitle[];
  locations: JobLocation[];
  sources: JobSource[];
};

function JobsContainer({
  statuses,
  companies,
  titles,
  locations,
  sources,
}: MyJobsProps) {
  const {
    jobs,
    page,
    totalJobs,
    filterKey,
    editJob,
    loading,
    loadJobs,
    onDeleteJob,
    onEditJob,
    onChangeJobStatus,
    resetEditJob,
    onFilterChange,
    downloadJobsList,
  } = useJobsContainer();

  const handleLoadMore = () => {
    loadJobs(page + 1, filterKey);
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <JobsContainerHeader
          filterKey={filterKey}
          onFilterChange={onFilterChange}
          onDownload={downloadJobsList}
          loading={loading}
          statuses={statuses}
          companies={companies}
          titles={titles}
          locations={locations}
          sources={sources}
          editJob={editJob}
          resetEditJob={resetEditJob}
        />
      </CardHeader>
      <CardContent className="p-6">
        {loading && <Loading />}
        {jobs.length > 0 ? (
          <JobsContainerContent
            jobs={jobs}
            totalJobs={totalJobs}
            page={page}
            loading={loading}
            filterKey={filterKey}
            statuses={statuses}
            onDeleteJob={onDeleteJob}
            onEditJob={onEditJob}
            onChangeJobStatus={onChangeJobStatus}
            onLoadMore={handleLoadMore}
          />
        ) : (
          <JobsContainerEmptyState
            statuses={statuses}
            companies={companies}
            titles={titles}
            locations={locations}
            sources={sources}
            editJob={editJob}
            resetEditJob={resetEditJob}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default JobsContainer;
