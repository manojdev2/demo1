"use client";

import { Button } from "../ui/button";
import { File } from "lucide-react";
import { AddJob } from "./AddJob";
import { JobsFilterSelect } from "./JobsFilterSelect";
import {
  Company,
  JobLocation,
  JobResponse,
  JobSource,
  JobStatus,
  JobTitle,
} from "@/models/job.model";

interface JobsContainerHeaderProps {
  filterKey?: string;
  onFilterChange: (filterBy: string) => void;
  onDownload: () => void;
  loading: boolean;
  statuses: JobStatus[];
  companies: Company[];
  titles: JobTitle[];
  locations: JobLocation[];
  sources: JobSource[];
  editJob: JobResponse | null;
  resetEditJob: () => void;
}

export function JobsContainerHeader({
  filterKey,
  onFilterChange,
  onDownload,
  loading,
  statuses,
  companies,
  titles,
  locations,
  sources,
  editJob,
  resetEditJob,
}: JobsContainerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Jobs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and track your job applications
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <JobsFilterSelect filterKey={filterKey} onFilterChange={onFilterChange} />
        <Button
          size="sm"
          variant="outline"
          className="h-9 gap-2 border-border/60 hover:bg-muted/80"
          disabled={loading}
          onClick={onDownload}
        >
          <File className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
        <AddJob
          jobStatuses={statuses}
          companies={companies}
          jobTitles={titles}
          locations={locations}
          jobSources={sources}
          editJob={editJob}
          resetEditJob={resetEditJob}
        />
      </div>
    </div>
  );
}

