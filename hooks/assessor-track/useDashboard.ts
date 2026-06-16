'use client';
import { useState, useEffect } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import { TODAY, diffDays } from '@/lib/assessor-track/utils';
import type { Learner, Alert, ReviewEntry } from '@/types/assessor-track';

export interface ReviewWithLearner extends ReviewEntry {
  learner: Learner;
}

export interface DashboardState {
  myLearners: Learner[];
  counts: {
    total: number;
    onTrack: number;
    atRisk: number;
    behind: number;
    critical: number;
  };
  criticalAlerts: Alert[];
  allMyAlerts: Alert[];
  overdueReviews: ReviewWithLearner[];
  upcomingReviews: ReviewWithLearner[];
  flaggedLearners: Learner[];
}

export function useDashboard(): DashboardState | null {
  const { currentAssessor, repository } = useAssessorContext();
  const [state, setState] = useState<DashboardState | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const [myLearners, myAlerts, myReviews, allLearners] = await Promise.all([
        repository.getLearnersByAssessor(currentAssessor.id),
        repository.getAlertsByAssessor(currentAssessor.id),
        repository.getReviewsByAssessor(currentAssessor.id),
        repository.getLearners(),
      ]);

      if (!active) return;

      const learnerMap = new Map(allLearners.map(l => [l.id, l]));
      const pendingReviews = myReviews.filter(r => !r.completed);

      const overdueReviews: ReviewWithLearner[] = pendingReviews
        .filter(r => r.scheduledDate < TODAY)
        .map(r => ({ ...r, learner: learnerMap.get(r.learnerId)! }))
        .filter(r => r.learner);

      const upcomingReviews: ReviewWithLearner[] = pendingReviews
        .filter(r => r.scheduledDate >= TODAY)
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
        .slice(0, 5)
        .map(r => ({ ...r, learner: learnerMap.get(r.learnerId)! }))
        .filter(r => r.learner);

      setState({
        myLearners,
        counts: {
          total:    myLearners.length,
          onTrack:  myLearners.filter(l => l.status === 'on-track').length,
          atRisk:   myLearners.filter(l => l.status === 'at-risk').length,
          behind:   myLearners.filter(l => l.status === 'behind').length,
          critical: myAlerts.filter(a => a.severity === 'critical').length,
        },
        criticalAlerts:  myAlerts.filter(a => a.severity === 'critical'),
        allMyAlerts:     myAlerts,
        overdueReviews,
        upcomingReviews,
        flaggedLearners: myLearners.filter(l => l.needsAttention),
      });
    }

    load();
    return () => { active = false; };
  }, [currentAssessor.id, repository]);

  return state;
}
