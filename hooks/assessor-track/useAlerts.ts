'use client';
import { useState, useEffect } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import type { Alert, Learner } from '@/types/assessor-track';

export interface AlertWithLearner extends Alert {
  learner: Learner | null;
}

export interface AlertsState {
  critical: AlertWithLearner[];
  warnings: AlertWithLearner[];
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}

export function useAlerts(): AlertsState | null {
  const { currentAssessor, repository } = useAssessorContext();
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [myAlerts, setMyAlerts] = useState<Alert[]>([]);
  const [learnerMap, setLearnerMap] = useState<Map<string, Learner>>(new Map());
  const [showAll, setShowAll] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [all, mine, learners] = await Promise.all([
        repository.getAllAlerts(),
        repository.getAlertsByAssessor(currentAssessor.id),
        repository.getLearners(),
      ]);
      if (!active) return;
      setAllAlerts(all);
      setMyAlerts(mine);
      setLearnerMap(new Map(learners.map(l => [l.id, l])));
      setReady(true);
    }
    load();
    return () => { active = false; };
  }, [currentAssessor.id, repository]);

  if (!ready) return null;

  const pool = (showAll ? allAlerts : myAlerts).map(a => ({
    ...a,
    learner: a.learnerId ? (learnerMap.get(a.learnerId) ?? null) : null,
  }));

  return {
    critical: pool.filter(a => a.severity === 'critical'),
    warnings: pool.filter(a => a.severity === 'warning'),
    showAll, setShowAll,
  };
}
