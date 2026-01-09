"use client";

import { useState, useRef } from "react";
import { toast } from "../../ui/use-toast";
import { Resume } from "@/models/profile.model";
import { AiModel, ResumeReviewResponse } from "@/models/ai.model";

export function useResumeReviewStream() {
  const [aIContent, setAIContent] = useState<ResumeReviewResponse | any>("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const isReaderReleasedRef = useRef<boolean>(false);

  const getResumeReview = async (resume: Resume, selectedModel: AiModel) => {
    try {
      if (!resume || resume.ResumeSections?.length === 0) {
        throw new Error("Resume content is required");
      }
      setLoading(true);
      setAIContent("");
      isReaderReleasedRef.current = false;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const response = await fetch("/api/ai/resume/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModel, resume }),
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
      setIsStreaming(true);
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
      setIsStreaming(false);
    } catch (error) {
      const message = "Error fetching resume review";
      const description = error instanceof Error ? error.message : message;
      setLoading(false);
      setIsStreaming(false);
      
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

  const abortStream = async () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
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

  return {
    aIContent,
    loading,
    isStreaming,
    getResumeReview,
    abortStream,
  };
}


