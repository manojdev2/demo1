"use strict";

import { useCallback, useEffect, useState } from "react";
import { getJobsList } from "@/actions/job.actions";
import { toast } from "@/components/ui/use-toast";
import { JobResponse } from "@/models/job.model";
import { APP_CONSTANTS } from "@/lib/constants";
import { useJobDownload } from "./useJobDownload";
import { useJobActions } from "./useJobActions";

export function useJobsContainer() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filterKey, setFilterKey] = useState<string>();
  const [editJob, setEditJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const jobsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;

  const loadJobs = useCallback(
    async (page: number, filter?: string) => {
      setLoading(true);
      const result = await getJobsList(
        page,
        jobsPerPage,
        filter
      );
      if (result.success && "data" in result && result.data) {
        const jobsData = result.data as JobResponse[];
        setJobs((prev) => (page === 1 ? jobsData : [...prev, ...jobsData]));
        setTotalJobs(result.total ?? 0);
        setPage(page);
        setLoading(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "message" in result ? result.message : "Failed to load jobs",
        });
        setLoading(false);
      }
    },
    [jobsPerPage]
  );

  const reloadJobs = useCallback(async () => {
    await loadJobs(1);
    if (filterKey !== "none") {
      setFilterKey("none");
    }
  }, [loadJobs, filterKey]);

  const resetEditJob = () => {
    setEditJob(null);
  };

  const onFilterChange = (filterBy: string) => {
    if (filterBy === "none") {
      reloadJobs();
    } else {
      setFilterKey(filterBy);
      loadJobs(1, filterBy);
    }
  };

  const { downloadJobsList } = useJobDownload();

  const { onDeleteJob, onEditJob, onChangeJobStatus } = useJobActions({
    setEditJob,
    reloadJobs,
  });

  useEffect(() => {
    (async () => await loadJobs(1))();
  }, [loadJobs]);

  return {
    jobs,
    page,
    totalJobs,
    filterKey,
    editJob,
    loading,
    loadJobs,
    reloadJobs,
    onDeleteJob,
    onEditJob,
    onChangeJobStatus,
    resetEditJob,
    onFilterChange,
    downloadJobsList,
  };
}

