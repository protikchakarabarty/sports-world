import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { subscribeToPoll, castVote } from '@/services/fanPollService';

interface OptionData {
  option: string;
  count: number;
  percentage: number;
}

export function useFanPrediction(pollId: string, options: readonly string[], closed: boolean) {
  const [totalVotes, setTotalVotes] = useState(0);
  const [optionCounts, setOptionCounts] = useState<Record<string, number>>({});
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasVoted = userVote !== null;

  useEffect(() => {
    if (!pollId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    const unsub = subscribeToPoll(
      pollId,
      (data) => {
        setTotalVotes(data.totalVotes);
        setOptionCounts(data.optionCounts);
        setUserVote(data.userVote);
        setIsLoading(false);
        setIsError(false);
        setError(null);
      },
      (err) => {
        setIsError(true);
        setError(err.message);
        setIsLoading(false);
      },
    );

    return () => {
      unsub?.();
    };
  }, [pollId]);

  const voteMutation = useMutation({
    mutationFn: (option: string) => castVote(pollId, option),
  });

  const handleVote = useCallback(
    (option: string) => {
      if (hasVoted || closed) return;
      voteMutation.mutate(option);
    },
    [voteMutation, hasVoted, closed],
  );

  const optionPercentages: OptionData[] = options.map((opt) => {
    const count = optionCounts[opt] ?? 0;
    return {
      option: opt,
      count,
      percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
    };
  });

  const emptyVote = !hasVoted && totalVotes === 0 && !isLoading;
  const voteError = voteMutation.error instanceof Error ? voteMutation.error.message : null;

  return {
    optionPercentages,
    totalVotes,
    userVote,
    hasVoted,
    emptyVote,
    closed,
    isLoading,
    isError,
    error,
    vote: handleVote,
    isVoting: voteMutation.isPending,
    voteError,
  };
}
