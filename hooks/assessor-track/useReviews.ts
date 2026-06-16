'use client';
import { useState, useEffect } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import { TODAY, currentMonthStart, currentMonthEnd } from '@/lib/assessor-track/utils';
import type { Learner, ReviewEntry } from '@/types/assessor-track';

export interface ReviewWithLearner extends ReviewEntry {
  learner: Learner;
}

export interface ReviewsState {
  overdue: ReviewWithLearner[];
  thisMonth: ReviewWithLearner[];
  upcoming: ReviewWithLearner[];
  completed: ReviewWithLearner[];
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}

export function useReviews(): ReviewsState | null {
  const { currentAssessor, repository } = useAssessorContext();
  const [showAll, setShowAll] = useState(false);
  const [allReviews, setAllReviews] = useState<ReviewEntry[]>([]);
  const [learnerMap, setLearnerMap] = useState<Map<string, Learner>>(new Map());
  const [myLearnerIds, setMyLearnerIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [reviews, learners, myLearners] = await Promise.all([
        repository.getAllReviews(),
        repository.getLearners(),
        repository.getLearnersByAssessor(currentAssessor.id),
      ]);
      if (!active) return;
      setAllReviews(reviews);
      setLearnerMap(new Map(learners.map(l => [l.id, l])));
      setMyLearnerIds(new Set(myLearners.map(l => l.id)));
      setReady(true);
    }
    load();
    return () => { active = false; };
  }, [currentAssessor.id, repository]);

  if (!ready) return null;

  const monthStart = currentMonthStart();
  const monthEnd   = currentMonthEnd();

  const pool = allReviews
    .filter(r => showAll || myLearnerIds.has(r.learnerId))
    .map(r => ({ ...r, learner: learnerMap.get(r.learnerId)! }))
    .filter(r => r.learner);

  const pending = pool.filter(r => !r.completed);

  return {
    overdue:    pending.filter(r => r.scheduledDate < TODAY),
    thisMonth:  pending.filter(r => r.scheduledDate >= TODAY && r.scheduledDate >= monthStart && r.scheduledDate <= monthEnd),
    upcoming:   pending.filter(r => r.scheduledDate > monthEnd),
    completed:  pool.filter(r => r.completed),
    showAll, setShowAll,
  };
}
