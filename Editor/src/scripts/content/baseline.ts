import type { ContentDiagnostic } from './types';

export interface AcceptedBaseline {
  code: string;
  file: string;
  section?: string;
  entity?: string;
  message: string;
  owner: string;
  reason: string;
}

export const ACCEPTED_BASELINE: AcceptedBaseline[] = [
  {
    code: 'SHARED_VALIDATION',
    file: 'creatures.json',
    section: 'creatures',
    entity: 'SKELETON',
    message: 'Walk speed must be greater than or equal to 1',
    owner: 'gameplay-content',
    reason: 'Existing production balance/content issue; not changed automatically by agent-readiness migration.'
  },
  {
    code: 'SHARED_VALIDATION',
    file: 'creatures.json',
    section: 'creatures',
    entity: 'ZOMBIE',
    message: 'No sprites',
    owner: 'art',
    reason: 'Required runtime creature art is missing and must be supplied manually.'
  },
  {
    code: 'SHARED_VALIDATION',
    file: 'creatures.json',
    section: 'creatures',
    entity: 'ZOMBIE',
    message: 'Walk speed must be greater than or equal to 1',
    owner: 'gameplay-content',
    reason: 'Existing production balance/content issue; not changed automatically by agent-readiness migration.'
  }
];

export function applyAcceptedBaseline(diagnostic: ContentDiagnostic): ContentDiagnostic {
  const accepted = ACCEPTED_BASELINE.find(
    (entry) =>
      entry.code === diagnostic.code &&
      entry.file === diagnostic.file &&
      entry.section === diagnostic.section &&
      entry.entity === diagnostic.entity &&
      entry.message === diagnostic.message
  );
  if (!accepted) {
    return diagnostic;
  }
  return {
    ...diagnostic,
    severity: 'warning',
    code: 'ACCEPTED_BASELINE',
    message: `${diagnostic.message} [owner: ${accepted.owner}; ${accepted.reason}]`
  };
}
