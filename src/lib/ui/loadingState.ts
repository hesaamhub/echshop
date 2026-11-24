export type LoadingPhase = "initial-skeleton" | "refresh-overlay" | "ready"

/**
 * Determines whether a data view should show full structural skeletons (first fetch),
 * a frosted transition overlay over existing content (background refresh / filter transition),
 * or its settled ready state.
 */
export function resolveLoadingPhase(params: {
  isLoading: boolean
  hasData: boolean
  isTransitioning?: boolean
}): LoadingPhase {
  if (params.isLoading && !params.hasData) {
    return "initial-skeleton"
  }
  if (params.isLoading || params.isTransitioning) {
    return "refresh-overlay"
  }
  return "ready"
}

export function clampSkeletonCount(count: number | undefined, fallback = 6, max = 12): number {
  if (typeof count !== "number" || !Number.isFinite(count)) return fallback
  return Math.max(1, Math.min(max, Math.round(count)))
}
