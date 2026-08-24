import { useCallback, useEffect, useState } from 'react';
import type { ReportGroup } from './types';

const API_BASE = '/api';

export async function fetchReport(signal?: AbortSignal): Promise<ReportGroup[]> {
  const response = await fetch(`${API_BASE}/report`, { signal });

  if (!response.ok) {
    throw new Error(
      `Report request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as ReportGroup[];
}

export type UseReportResult = {
  data: ReportGroup[] | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
};

export function useReport(): UseReportResult {
  const [data, setData] = useState<ReportGroup[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchReport(controller.signal)
      .then((report) => {
        setData(report);
        setIsLoading(false);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause : new Error(String(cause)));
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  return { data, error, isLoading, refetch };
}
