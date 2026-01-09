"use strict";

import { useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { AiModel, JobMatchResponse } from "@/models/ai.model";

export function useJobMatchStream() {
  const [aIContent, setAIContent] = useState<JobMatchResponse | any>("");
  const [loading, setLoading] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const isReaderReleasedRef = useRef<boolean>(false);

  const abortStream = async () => {
    abortControllerRef.current?.abort();
    if (readerRef.current && !isReaderReleasedRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (error) {
        // Reader may already be released or canceled, ignore error
      } finally {
        readerRef.current = null;
        isReaderReleasedRef.current = true;
      }
    }
  };

  const getJobMatch = async (resumeId: string, jobId: string, selectedModel: AiModel) => {
    try {
      setLoading(true);
      setAIContent("");
      isReaderReleasedRef.current = false;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch("/api/ai/resume/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobId, selectedModel }),
        signal: abortController.signal,
      });

      if (!response.body) {
        setLoading(false);
        throw new Error("No response body");
      }

      if (!response.ok) {
        setLoading(false);
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let done = false;
      setLoading(false);

      while (!done && !abortController.signal.aborted) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        const parsedChunk = JSON.parse(JSON.stringify(chunk));
        setAIContent((prev: any) => prev + parsedChunk);
      }
      
      if (readerRef.current && !isReaderReleasedRef.current) {
        reader.releaseLock();
        readerRef.current = null;
        isReaderReleasedRef.current = true;
      }
    } catch (error) {
      const message = "Error fetching job matching response";
      const description = error instanceof Error ? error.message : message;
      setLoading(false);
      
      // Clean up reader if still active
      if (readerRef.current && !isReaderReleasedRef.current) {
        try {
          readerRef.current.releaseLock();
        } catch {
          // Reader may already be released, ignore
        }
        readerRef.current = null;
        isReaderReleasedRef.current = true;
      }
      
      // Only show toast if not aborted
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          variant: "destructive",
          title: "Error!",
          description,
        });
      }
    }
  };

  return {
    aIContent,
    loading,
    getJobMatch,
    abortStream,
  };
}

