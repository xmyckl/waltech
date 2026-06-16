'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import { otjPct } from '@/lib/assessor-track/utils';
import type { Learner, OTJEntry } from '@/types/assessor-track';

export interface OtjRow extends Learner {
  pct: number;
  lastEntryDate: string;
}

export interface OtjState {
  rows: OtjRow[];
  critical: OtjRow[];   // pct < 40
  atRisk: OtjRow[];     // 40 <= pct < 70
  onTrack: OtjRow[];    // pct >= 70
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}

export function useOtj(): OtjState | null {
  const { currentAssessor, repository } = useAssessorContext();
  const [allLearners, setAllLearners] = useState<Learner[]>([]);
  const [allOtj, setAllOtj] = useState<OTJEntry[]>([]);
  const [myLearnerIds, setMyLearnerIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [learners, myLearners] = await Promise.all([
        repository.getLearners(),
        repository.getLearnersByAssessor(currentAssessor.id),
      ]);
      // Fetch OTJ for all learners to get last-entry dates.
      const otjArrays = await Promise.all(learners.map(l => repository.getOtjForLearner(l.id)));
      if (!active) return;
      setAllLearners(learners);
      setAllOtj(otjArrays.flat());
      setMyLearnerIds(new Set(myLearners.map(l => l.id)));
      setReady(true);
    }
    load();
    return () => { active = false; };
  }, [currentAssessor.id, repository]);

  const rows = useMemo<OtjRow[]>(() => {
    const pool = showAll
      ? allLearners
      : allLearners.filter(l => myLearnerIds.has(l.id));

    return pool
      .map(l => {
        const entries = allOtj
          .filter(o => o.learnerId === l.id)
          .sort((a, b) => b.date.localeCompare(a.date));
        return {
          ...l,
          pct: otjPct(l.otjLogged, l.otjTarget),
          lastEntryDate: entries[0]?.date ?? '—',
        };
      })
      .sort((a, b) => a.pct - b.pct);
  }, [allLearners, allOtj, myLearnerIds, showAll]);

  if (!ready) return null;

  return {
    rows,
    critical: rows.filter(r => r.pct < 40),
    atRisk:   rows.filter(r => r.pct >= 40 && r.pct < 70),
    onTrack:  rows.filter(r => r.pct >= 70),
    showAll, setShowAll,
  };
}
