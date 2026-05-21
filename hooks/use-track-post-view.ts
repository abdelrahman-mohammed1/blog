"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getRandomCelebrationMessage } from "@/lib/celebration-messages";
import { POST_VIEW_DELAY_MS } from "@/lib/constants";
import { useIncrementPostViews } from "@/hooks/use-posts";

const trackedPostIds = new Set<string>();

function sessionKey(postId: string) {
  return `post-view-tracked:${postId}`;
}

function isAlreadyTracked(postId: string): boolean {
  if (trackedPostIds.has(postId)) return true;
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(sessionKey(postId)) === "1";
  }
  return false;
}

function markTracked(postId: string) {
  trackedPostIds.add(postId);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(sessionKey(postId), "1");
  }
}

function unmarkTracked(postId: string) {
  trackedPostIds.delete(postId);
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(sessionKey(postId));
  }
}

interface UseTrackPostViewOptions {
  postId: string;
  enabled?: boolean;
  delayMs?: number;
}

export function useTrackPostView({
  postId,
  enabled = true,
  delayMs = POST_VIEW_DELAY_MS,
}: UseTrackPostViewOptions) {
  const incrementViews = useIncrementPostViews(postId);
  const hasTriggeredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isCelebrating, setIsCelebrating] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);
  const [pulseViews, setPulseViews] = useState(false);

  const triggerCelebration = useCallback(() => {
    setIsCelebrating(true);
    setPulseViews(true);
    toast.success(getRandomCelebrationMessage(), {
      duration: 4500,
    });
    const t = setTimeout(() => {
      setIsCelebrating(false);
      setPulseViews(false);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const trackView = useCallback(() => {
    if (
      !postId ||
      !enabled ||
      hasTriggeredRef.current ||
      isAlreadyTracked(postId)
    ) {
      return;
    }

    hasTriggeredRef.current = true;
    markTracked(postId);
    setHasTracked(true);

    incrementViews.mutate(undefined, {
      onSuccess: () => {
        triggerCelebration();
      },
      onError: () => {
        hasTriggeredRef.current = false;
        unmarkTracked(postId);
        setHasTracked(false);
      },
    });
  }, [postId, enabled, incrementViews, triggerCelebration]);

  const trackViewRef = useRef(trackView);
  trackViewRef.current = trackView;

  // Reset tracking state when navigating to another post
  useEffect(() => {
    hasTriggeredRef.current = isAlreadyTracked(postId);
    setHasTracked(isAlreadyTracked(postId));
  }, [postId]);

  useEffect(() => {
    if (!postId || !enabled) return;

    if (hasTriggeredRef.current || isAlreadyTracked(postId)) {
      return;
    }

    timerRef.current = setTimeout(() => {
      trackViewRef.current();
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [postId, enabled, delayMs]);

  return {
    isCelebrating,
    hasTracked,
    pulseViews,
    isPending: incrementViews.isPending,
  };
}
