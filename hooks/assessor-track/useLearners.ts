'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAssessorContext } from '@/contexts/AssessorContext';
import { CURRENT_ASSESSOR_ID } from '@/lib/assessor-track/data';
import type { Learner, Assessor } from '@/types/assessor-track';

export interface LearnersState {
  // Raw data
  allLearners: Learner[];
  assessors: Assessor[];
  // Derived
  filtered: Learner[];
  // Filters
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  assessorFilter: string;
  setAssessorFilter: (v: string) => void;
  resetFilters: () => void;
  isFiltered: boolean;
}

export function useLearners(): LearnersState | null {
  const { repository } = useAssessorContext();
  const [allLearners, setAllLearners] = useState<Learner[]>([]);
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assessorFilter, setAssessorFilter] = useState(CURRENT_ASSESSOR_ID);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([repository.getLearners(), repository.getAssessors()]).then(
      ([learners, asrs]) => {
        if (!active) return;
        setAllLearners(learners);
        setAssessors(asrs);
        setReady(true);
      },
    );
    return () => { active = false; };
  }, [repository]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allLearners.filter(l =>
      (assessorFilter === 'all' || l.assessorId === assessorFilter) &&
      (statusFilter === 'all' || l.status === statusFilter) &&
      (q === '' ||
        l.name.toLowerCase().includes(q) ||
        l.employer.toLowerCase().includes(q)),
    );
  }, [allLearners, search, statusFilter, assessorFilter]);

  const isFiltered =
    search !== '' || statusFilter !== 'all' || assessorFilter !== CURRENT_ASSESSOR_ID;

  function resetFilters() {
    setSearch('');
    setStatusFilter('all');
    setAssessorFilter(CURRENT_ASSESSOR_ID);
  }

  if (!ready) return null;

  return {
    allLearners, assessors, filtered,
    search, setSearch,
    statusFilter, setStatusFilter,
    assessorFilter, setAssessorFilter,
    resetFilters, isFiltered,
  };
}
