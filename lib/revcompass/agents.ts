import type { AgentDefinition } from './types'

export const ORCHESTRATOR_COPY =
  'ADK supervisor · Agent Engine runtime · Memory Bank (persistent fingerprint + outcomes) · enforces the human-approval gate'

export const AGENTS: AgentDefinition[] = [
  {
    n: '1',
    name: 'Ingestion & Doc Understanding',
    gemini: 'Extract terms from contracts/policies (multimodal)',
    tool: '837/835 parsers · de-id · CARC dict',
  },
  {
    n: '2',
    name: 'Payer Behavior',
    gemini: 'Narrate what changed & why',
    tool: 'Fingerprint stats · drift detector',
  },
  {
    n: '3',
    name: 'Clustering',
    gemini: 'Semantic merge/refine cohorts · root-cause hypothesis',
    tool: 'Signature grouper · embeddings',
  },
  {
    n: '4',
    name: 'Evidence & Grounding',
    gemini: 'Verify hypothesis vs. contract/policy text',
    tool: 'Vertex AI Search retrieval',
  },
  {
    n: '5',
    name: 'Disposition',
    gemini: 'Explain the recommendation',
    tool: 'EV / recovery-prob engine · filing check',
  },
  {
    n: '6',
    name: 'Action / Packaging',
    gemini: 'Draft the consolidated appeal',
    tool: 'Format tool · function-calling emitter',
  },
  {
    n: '7',
    name: 'Outcome & Learning',
    gemini: 'Confirm/kill the hypothesis',
    tool: 'Overturn-rate & fingerprint updaters',
  },
]

export const DEFAULT_GATE_LABEL =
  'Human approval gate — an analyst reviews evidence + confidence before anything is submitted.'
