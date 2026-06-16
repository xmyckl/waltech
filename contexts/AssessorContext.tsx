'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Assessor } from '@/types/assessor-track';
import type { IAssessorRepository } from '@/lib/assessor-track/repository.interface';
import { StubRepository } from '@/lib/assessor-track/stub-repository';
import { assessors, CURRENT_ASSESSOR_ID } from '@/lib/assessor-track/data';

interface AssessorContextValue {
  currentAssessor: Assessor;
  repository: IAssessorRepository;
}

const AssessorContext = createContext<AssessorContextValue | null>(null);

/**
 * Module-level singleton — one repository instance shared across all
 * renders and client-side navigations. Mutations (addComms, addOtj, etc.)
 * persist for the session without re-fetching.
 *
 * To switch to a live MAYTAS implementation, replace StubRepository here.
 * No page or hook code changes.
 */
const repository: IAssessorRepository = new StubRepository();

export function AssessorProvider({ children }: { children: ReactNode }) {
  const currentAssessor = useMemo<Assessor>(
    () => {
      const found = assessors.find(a => a.id === CURRENT_ASSESSOR_ID);
      if (!found) throw new Error(`Assessor "${CURRENT_ASSESSOR_ID}" not found in data`);
      return found;
    },
    [],
  );

  const value = useMemo<AssessorContextValue>(
    () => ({ currentAssessor, repository }),
    [currentAssessor],
  );

  return (
    <AssessorContext.Provider value={value}>
      {children}
    </AssessorContext.Provider>
  );
}

/**
 * Consume the AssessorContext.
 * Throws if called outside an AssessorProvider — this is intentional,
 * as it surfaces misconfiguration at development time rather than
 * producing a silent null-reference bug.
 */
export function useAssessorContext(): AssessorContextValue {
  const ctx = useContext(AssessorContext);
  if (!ctx) {
    throw new Error('useAssessorContext must be called within <AssessorProvider>');
  }
  return ctx;
}
