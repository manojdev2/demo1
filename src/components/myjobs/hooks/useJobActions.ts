"use strict";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  deleteJobById,
  getJobDetails,
  updateJobStatus,
} from "@/actions/job.actions";
import { toast } from "@/components/ui/use-toast";
import { JobResponse, JobStatus } from "@/models/job.model";

interface UseJobActionsProps {
  setEditJob: (job: JobResponse | null) => void;
  reloadJobs: () => void;
}

export function useJobActions({ setEditJob, reloadJobs }: UseJobActionsProps) {
  const router = useRouter();

  const onDeleteJob = useCallback(
    async (jobId: string) => {
      const result = await deleteJobById(jobId);
      if (result.success) {
        toast({
          variant: "success",
          description: `Job has been deleted successfully`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        });
      }
      reloadJobs();
    },
    [reloadJobs]
  );

  const onEditJob = useCallback(
    async (jobId: string) => {
      const result = await getJobDetails(jobId);
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        });
        return;
      }
      setEditJob(result.job ?? null);
    },
    [setEditJob]
  );

  const onChangeJobStatus = useCallback(
    async (jobId: string, jobStatus: JobStatus) => {
      const result = await updateJobStatus(jobId, jobStatus);
      if (result.success) {
        router.refresh();
        toast({
          variant: "success",
          description: `Job has been updated successfully`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        });
      }
      reloadJobs();
    },
    [reloadJobs, router]
  );

  return {
    onDeleteJob,
    onEditJob,
    onChangeJobStatus,
  };
}

