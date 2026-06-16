'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import { otjPct } from '@/lib/assessor-track/utils';
import type { Assessor, Learner, Alert } from '@/types/assessor-track';

export interface AssessorSummary {
  assessor: Assessor;
  total: number;
  onTrack: number;
  atRisk: number;
  behind: number;
  criticalAlerts: number;
  avgOtjPct: number;
}

export interface ManagerState {
  assessorSummaries: AssessorSummary[];
  filteredLearners: Learner[];
  assessors: Assessor[];
  programmes: string[];
  selectedAssessor: string;
  setSelectedAssessor: (v: string) => void;
  selectedProgramme: string;
  setSelectedProgramme: (v: string) => void;
}

export function useManager(): ManagerState | null {
  const { repository } = useAssessorContext();
  const [allLearners, setAllLearners] = useState<Learner[]>([]);
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAssessor, setSelectedAssessor] = useState('all');
  const [selectedProgramme, setSelectedProgramme] = useState('all');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [learners, asrs, als] = await Promise.all([
        repository.getLearners(),
        repository.getAssessors(),
        repository.getAllAlerts(),
      ]);
      if (!active) return;
      setAllLearners(learners);
      setAssessors(asrs);
      setAlerts(als);
      setReady(true);
    }
    load();
    return () => { active = false; };
  }, [repository]);

  const assessorSummaries = useMemo<AssessorSummary[]>(() =>
    assessors.map(a => {
      const caseload = allLearners.filter(l => l.assessorId === a.id);
      const caseloadIds = new Set(caseload.map(l => l.id));
      const avgOtjPct = caseload.length
        ? Math.round(caseload.reduce((s, l) => s + otjPct(l.otjLogged, l.otjTarget), 0) / caseload.length)
        : 0;
      return {
        assessor: a,
        total:         caseload.length,
        onTrack:       caseload.filter(l => l.status === 'on-track').length,
        atRisk:        caseload.filter(l => l.status === 'at-risk').length,
        behind:        caseload.filter(l => l.status === 'behind').length,
        criticalAlerts: alerts.filter(al => al.severity === 'critical' && al.learnerId != null && caseloadIds.has(al.learnerId)).length,
        avgOtjPct,
      };
    }),
    [assessors, allLearners, alerts],
  );

  const programmes = useMemo(
    () => [...new Set(allLearners.map(l => l.programme))],
    [allLearners],
  );

  const filteredLearners = useMemo(
    () => allLearners.filter(l =>
      (selectedAssessor === 'all' || l.assessorId === selectedAssessor) &&
      (selectedProgramme === 'all' || l.programme === selectedProgramme),
    ),
    [allLearners, selectedAssessor, selectedProgramme],
  );

  if (!ready) return null;

  return {
    assessorSummaries, filteredLearners, assessors, programmes,
    selectedAssessor, setSelectedAssessor,
    selectedProgramme, setSelectedProgramme,
  };
}
