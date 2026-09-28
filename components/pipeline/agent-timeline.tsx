import { AGENTS, DEFAULT_GATE_LABEL } from '@/lib/revcompass/agents'

type AgentTimelineProps = {
  annotations?: (string | null)[]
  gateLabel?: string
  compact?: boolean
}

export function AgentTimeline({ annotations, gateLabel, compact }: AgentTimelineProps) {
  return (
    <div className={`agent-timeline ${compact ? 'agent-timeline-compact' : ''}`}>
      {AGENTS.map((agent, index) => (
        <div key={agent.n}>
          <div className="tl-step">
            <div className="tl-dot">{agent.n}</div>
            <div className="tl-card">
              <h3>{agent.name}</h3>
              <div className="tl-split">
                <div>
                  <div className="col-label">Gemini does</div>
                  <div className="col-text">{agent.gemini}</div>
                </div>
                <div>
                  <div className="col-label">Tool does</div>
                  <div className="col-text">{agent.tool}</div>
                </div>
              </div>
              {annotations?.[index] ? (
                <div className="tl-case-note">
                  <div className="col-label col-label-accent">In this case</div>
                  <div className="col-text">{annotations[index]}</div>
                </div>
              ) : null}
            </div>
          </div>
          {index === 4 ? (
            <div className="tl-gate">
              <div className="gate-line">
                <div className="gate-badge">✓</div>
                <div className="gate-text">{gateLabel ?? DEFAULT_GATE_LABEL}</div>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function AgentMiniTrack() {
  return (
    <div className="wf-mini-track">
      {AGENTS.map((agent) => (
        <div className="wf-mini-step on" key={agent.n}>
          {agent.n}. {agent.name}
        </div>
      ))}
    </div>
  )
}
