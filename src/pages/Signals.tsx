import { useState } from 'react'

/*
 * SIGNALS PAGE — Interactive decision flow
 *
 * Layout:
 *   - Static reference: two-column (F4 of 1270px = 330px sidebar + 940px content)
 *   - Interactive walkthrough: full-width card, step progress
 *
 * Interaction:
 *   - 3 pre-built scenarios
 *   - User clicks through Signal 1→2→3→4→5
 *   - Each answer leads to next signal or result
 *   - Result shows: mode, explanation, FIBO next steps
 */

type Result = 'inside-out' | 'outside-in'
type NextStep = 2 | 3 | 4 | 5 | Result

interface SignalOption {
  label: string
  hint: string
  next: NextStep
}

interface Signal {
  n: number
  question: string
  context: string
  options: [SignalOption, SignalOption]
}

interface Scenario {
  id: string
  title: string
  context: string
  signals: Signal[]
}

const scenarios: Scenario[] = [
  {
    id: 'nav-height',
    title: 'Nav bar height',
    context: 'You\'re building a nav component. It needs a consistent height across all pages.',
    signals: [
      {
        n: 1,
        question: 'Has this value already been established in your design system?',
        context: 'Signal 1 — if the value exists, use it. No mode decision needed.',
        options: [
          { label: 'Yes, it\'s already defined', hint: 'Use the existing value.', next: 'inside-out' },
          { label: 'No, this is new', hint: 'Continue to Signal 2.', next: 2 },
        ],
      },
      {
        n: 2,
        question: 'Does a hard constraint exist?',
        context: 'Signal 2 — legibility floor, minimum tap target, fixed physical size?',
        options: [
          { label: 'Yes — minimum tap target (44px) applies', hint: 'Content constraint → Inside-Out. Derive height from text + padding.', next: 'inside-out' },
          { label: 'No hard constraint', hint: 'Continue to Signal 3.', next: 3 },
        ],
      },
      {
        n: 3,
        question: 'Is the nav content dynamic or static?',
        context: 'Signal 3 — does nav height change based on content?',
        options: [
          { label: 'Dynamic — height could vary', hint: 'Inside-Out. Content determines the container.', next: 'inside-out' },
          { label: 'Static — fixed text, fixed structure', hint: 'Continue to Signal 4.', next: 4 },
        ],
      },
      {
        n: 4,
        question: 'Is there a known, stable parent?',
        context: 'Signal 4 — is there a fixed container this nav lives inside?',
        options: [
          { label: 'No — nav spans full viewport width', hint: 'No bounded parent for height. Inside-Out from content.', next: 'inside-out' },
          { label: 'Yes — inside a fixed frame', hint: 'Outside-In. Derive height from the frame.', next: 'outside-in' },
        ],
      },
      {
        n: 5,
        question: 'Is nav height adaptive or consistent?',
        context: 'Signal 5 — does nav height change per context, or stay the same everywhere?',
        options: [
          { label: 'Consistent — same height everywhere', hint: 'Inside-Out. Consistent property derives from content.', next: 'inside-out' },
          { label: 'Adaptive — height changes per breakpoint', hint: 'Outside-In. Derived from its container context.', next: 'outside-in' },
        ],
      },
    ],
  },
  {
    id: 'hero-image',
    title: 'Hero section height',
    context: 'You\'re sizing the height of a hero section that contains a fixed headline and image.',
    signals: [
      {
        n: 1,
        question: 'Is hero height already established in your system?',
        context: 'Signal 1 — check existing design tokens first.',
        options: [
          { label: 'Yes, defined already', hint: 'Use the existing value.', next: 'outside-in' },
          { label: 'No, building from scratch', hint: 'Continue.', next: 2 },
        ],
      },
      {
        n: 2,
        question: 'Does a hard constraint exist?',
        context: 'Signal 2 — is there a fixed viewport height you must respect?',
        options: [
          { label: 'Yes — must fit within viewport height', hint: 'Container constraint → Outside-In.', next: 'outside-in' },
          { label: 'No — can extend below fold', hint: 'Continue.', next: 3 },
        ],
      },
      {
        n: 3,
        question: 'Is the hero content static or dynamic?',
        context: 'Signal 3 — does the headline or image change dynamically?',
        options: [
          { label: 'Dynamic — headline varies', hint: 'Inside-Out. Content sets the height.', next: 'inside-out' },
          { label: 'Static — fixed design asset', hint: 'Outside-In viable. Continue.', next: 4 },
        ],
      },
      {
        n: 4,
        question: 'Is there a known, stable parent?',
        context: 'Signal 4 — does the hero have a defined container?',
        options: [
          { label: 'Yes — viewport or section container', hint: 'Known parent → Outside-In.', next: 'outside-in' },
          { label: 'No stable parent', hint: 'Inside-Out from content.', next: 'inside-out' },
        ],
      },
      {
        n: 5,
        question: 'Is hero height adaptive or consistent?',
        context: 'Signal 5 — does the hero scale with its container?',
        options: [
          { label: 'Adaptive — scales with viewport', hint: 'Outside-In. FIBO % of viewport height.', next: 'outside-in' },
          { label: 'Consistent — same across breakpoints', hint: 'Inside-Out from content.', next: 'inside-out' },
        ],
      },
    ],
  },
  {
    id: 'button-padding',
    title: 'Button padding',
    context: 'You\'re defining padding for a button component that will exist in multiple size variants.',
    signals: [
      {
        n: 1,
        question: 'Is button padding already established?',
        context: 'Signal 1 — are padding values already in your system?',
        options: [
          { label: 'Yes — padding is already defined', hint: 'Use it. No mode needed.', next: 'inside-out' },
          { label: 'No — defining now', hint: 'Continue.', next: 2 },
        ],
      },
      {
        n: 2,
        question: 'Does a hard constraint apply to padding?',
        context: 'Signal 2 — minimum touch target? Fixed physical size?',
        options: [
          { label: 'Yes — minimum tap target forces minimum padding', hint: 'Content constraint → Inside-Out.', next: 'inside-out' },
          { label: 'No hard constraint', hint: 'Continue.', next: 3 },
        ],
      },
      {
        n: 3,
        question: 'Is button content dynamic or static?',
        context: 'Signal 3 — does the button label change, or is it always the same text?',
        options: [
          { label: 'Dynamic — label varies by context', hint: 'Inside-Out. Padding is set; width grows with label.', next: 4 },
          { label: 'Static — icon-only, fixed label', hint: 'Outside-In viable. Continue.', next: 4 },
        ],
      },
      {
        n: 4,
        question: 'Is there a known, stable parent for button sizing?',
        context: 'Signal 4 — does the button fill a known container?',
        options: [
          { label: 'No — button is designed in isolation', hint: 'No parent → Inside-Out from text size.', next: 5 },
          { label: 'Yes — button fills a column or container', hint: 'Parent exists → Outside-In.', next: 'outside-in' },
        ],
      },
      {
        n: 5,
        question: 'Is button padding adaptive or consistent?',
        context: 'Signal 5 — does padding change per button size, or stay the same?',
        options: [
          { label: 'Consistent — same padding across all button sizes', hint: 'Inside-Out. Consistent property. Establish once, reuse everywhere.', next: 'inside-out' },
          { label: 'Adaptive — padding scales with button size', hint: 'Outside-In. FIBO % of button width.', next: 'outside-in' },
        ],
      },
    ],
  },
]

const signalDefs = [
  { n: 1, title: 'Already established?',      rule: 'If yes → use it. No mode decision needed.' },
  { n: 2, title: 'Hard constraint?',           rule: 'Content constraint (legibility, tap target) → Inside-Out. Container constraint (fixed physical size) → Outside-In.' },
  { n: 3, title: 'Dynamic or static?',         rule: 'Dynamic content → Inside-Out. Static (logo, icon, fixed headline) → Outside-In viable.' },
  { n: 4, title: 'Known, stable parent?',       rule: 'Parent exists → Outside-In. No parent (isolated component) → Inside-Out.' },
  { n: 5, title: 'Adaptive or consistent?',     rule: 'Adaptive property (scales with context) → Outside-In. Consistent property (same everywhere) → Inside-Out.' },
]

interface WalkthroughState {
  scenarioId: string | null
  signalIndex: number
  path: Array<{ signalN: number; choice: string; result?: NextStep }>
  result: Result | null
  resultHint: string
}

const initial: WalkthroughState = {
  scenarioId: null,
  signalIndex: 0,
  path: [],
  result: null,
  resultHint: '',
}

export default function Signals() {
  const [state, setState] = useState<WalkthroughState>(initial)

  const activeScenario = scenarios.find(s => s.id === state.scenarioId) ?? null
  const currentSignal = activeScenario
    ? activeScenario.signals[state.signalIndex]
    : null

  function pickScenario(id: string) {
    setState({ ...initial, scenarioId: id })
  }

  function chooseOption(option: SignalOption) {
    const newPath = [...state.path, { signalN: currentSignal!.n, choice: option.label, result: option.next }]

    if (option.next === 'inside-out' || option.next === 'outside-in') {
      setState({ ...state, path: newPath, result: option.next, resultHint: option.hint })
    } else {
      // Advance to next signal
      const nextSignalIndex = activeScenario!.signals.findIndex(s => s.n === option.next)
      setState({ ...state, signalIndex: nextSignalIndex, path: newPath })
    }
  }

  function reset() {
    setState({ ...initial, scenarioId: state.scenarioId })
  }

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <header style={styles.pageHeader}>
        <div className="content">
          <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
            Signals
          </span>
          <h1 style={styles.pageTitle}>Decision flow.</h1>
          <p style={styles.pageSubtitle}>
            Five signals. No guessing. Run them and get the mode.
          </p>
        </div>
      </header>

      {/* ── INTERACTIVE WALKTHROUGH ── */}
      <section style={styles.section}>
        <div className="content">
          <div style={styles.twoCol}>
            <div style={styles.colLabel}>
              <span className="label">Try it</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Choose a scenario.</h2>
              <p style={styles.body}>
                Pick a real design decision and walk through the five signals.
                The flow terminates when a signal gives a definitive answer.
              </p>

              {/* Scenario picker */}
              <div style={styles.scenarioPicker}>
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pickScenario(s.id)}
                    style={{
                      ...styles.scenarioBtn,
                      borderColor: state.scenarioId === s.id ? 'var(--c-accent)' : 'var(--c-border)',
                      background: state.scenarioId === s.id ? 'var(--c-accent-bg)' : 'transparent',
                      color: state.scenarioId === s.id ? 'var(--c-accent)' : 'var(--c-text)',
                    }}
                  >
                    <span style={styles.scenarioBtnTitle}>{s.title}</span>
                    <span style={styles.scenarioBtnContext}>{s.context}</span>
                  </button>
                ))}
              </div>

              {/* Walkthrough */}
              {activeScenario && !state.result && currentSignal && (
                <div style={styles.walkthrough}>
                  {/* Progress */}
                  <div style={styles.progress}>
                    {activeScenario.signals.map((sig) => {
                      const done = state.path.some(p => p.signalN === sig.n)
                      const active = sig.n === currentSignal.n
                      return (
                        <div
                          key={sig.n}
                          style={{
                            ...styles.progressDot,
                            background: done
                              ? 'var(--c-text)'
                              : active
                              ? 'var(--c-accent)'
                              : 'var(--c-border)',
                          }}
                        />
                      )
                    })}
                    <span style={styles.progressLabel}>Signal {currentSignal.n} of 5</span>
                  </div>

                  {/* Question */}
                  <div style={styles.questionCard}>
                    <div style={styles.signalTag}>Signal {currentSignal.n}</div>
                    <h3 style={styles.question}>{currentSignal.question}</h3>
                    <p style={styles.questionContext}>{currentSignal.context}</p>
                  </div>

                  {/* Options */}
                  <div style={styles.options}>
                    {currentSignal.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => chooseOption(opt)}
                        style={styles.optionBtn}
                      >
                        <span style={styles.optionLabel}>{opt.label}</span>
                        <span style={styles.optionHint}>{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {state.result && (
                <div style={{
                  ...styles.resultCard,
                  borderColor: state.result === 'inside-out' ? 'var(--c-accent)' : 'var(--c-text)',
                  background: state.result === 'inside-out' ? 'var(--c-accent-bg)' : 'var(--c-surface)',
                }}>
                  <div style={styles.resultMode}>
                    {state.result === 'inside-out' ? '↗ Inside-Out' : '↙ Outside-In'}
                  </div>
                  <p style={styles.resultHint}>{state.resultHint}</p>

                  <div style={styles.resultPath}>
                    <span className="label" style={{ display: 'block', marginBottom: 'var(--sp8)' }}>Decision path</span>
                    {state.path.map((step, i) => (
                      <div key={i} style={styles.pathRow}>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-muted)', width: '64px', flexShrink: 0 }}>
                          Signal {step.signalN}
                        </span>
                        <span style={{ fontSize: 'var(--t11)', lineHeight: 'var(--lh11)', color: 'var(--c-text)' }}>
                          {step.choice}
                        </span>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: typeof step.result === 'string' ? 'var(--c-accent)' : 'var(--c-muted)', marginLeft: 'auto' }}>
                          {typeof step.result === 'string' ? `→ ${step.result}` : `→ signal ${step.result}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button onClick={reset} style={styles.resetBtn}>
                    Run again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNAL REFERENCE ── */}
      <section style={{ ...styles.section, borderBottom: 'none' }}>
        <div className="content">
          <div style={styles.twoCol}>
            <div style={styles.colLabel}>
              <span className="label">Reference</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>All five signals.</h2>
              <p style={styles.body}>
                Run them in order. Stop when you have a definitive answer.
                The signals are not a checklist — they're a decision tree.
              </p>

              <div style={styles.signalList}>
                {signalDefs.map((sig, i) => (
                  <div
                    key={sig.n}
                    style={{
                      ...styles.signalRow,
                      borderBottom: i < signalDefs.length - 1 ? '1px solid var(--c-border)' : 'none',
                    }}
                  >
                    <div style={styles.signalNum}>
                      <span className="mono" style={{ fontSize: 'var(--t34)', lineHeight: 1, fontWeight: 700, color: 'var(--c-faint)' }}>
                        {sig.n}
                      </span>
                    </div>
                    <div>
                      <div style={styles.signalTitle}>{sig.title}</div>
                      <div style={styles.signalRule}>{sig.rule}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.preambleBox}>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp8)' }}>
                  Before entering signals
                </span>
                <p style={{ fontSize: 'var(--t13)', lineHeight: 'var(--lh13)', color: 'var(--c-muted)' }}>
                  Identify the canvas context. Each canvas size (desktop, tablet, mobile)
                  is its own design system context. Values don't carry across contexts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp96)' }} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  pageHeader: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  pageTitle: {
    fontSize: 'var(--t55)',
    lineHeight: 'var(--lh55)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: 'var(--sp16)',
  },
  pageSubtitle: {
    fontSize: 'var(--t21)',
    lineHeight: 'var(--lh21)',
    color: 'var(--c-muted)',
    maxWidth: 'var(--f4f5)',
  },
  section: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'var(--col-sidebar) 1fr',
    gap: 'var(--gutter)',
    alignItems: 'start',
  },
  colLabel: { paddingTop: 'var(--sp8)' },
  colContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp24)',
  },
  sectionTitle: {
    fontSize: 'var(--t34)',
    lineHeight: 'var(--lh34)',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  body: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-muted)',
    maxWidth: 'var(--f4f5)',
  },

  /* Scenario picker */
  scenarioPicker: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
  },
  scenarioBtn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp4)',
    padding: 'var(--sp16) var(--sp24)',
    border: '1px solid',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  scenarioBtnTitle: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    fontWeight: 600,
  },
  scenarioBtnContext: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
    fontWeight: 400,
  },

  /* Walkthrough */
  walkthrough: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp24)',
    border: '1px solid var(--c-border)',
    padding: 'var(--sp32)',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
  },
  progressDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  progressLabel: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
    marginLeft: 'var(--sp8)',
    fontWeight: 500,
  },
  questionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
  },
  signalTag: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '24px',
    padding: '0 var(--sp8)',
    fontSize: 'var(--t10)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'var(--c-accent)',
    color: 'var(--c-bg)',
    alignSelf: 'flex-start',
    fontFamily: 'inherit',
  },
  question: {
    fontSize: 'var(--t21)',
    lineHeight: 'var(--lh21)',
    fontWeight: 600,
  },
  questionContext: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
  },
  optionBtn: {
    padding: 'var(--sp16) var(--sp24)',
    border: '1px solid var(--c-border)',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp4)',
    transition: 'border-color 0.15s, background 0.15s',
  },
  optionLabel: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    fontWeight: 500,
    color: 'var(--c-text)',
  },
  optionHint: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
  },

  /* Result */
  resultCard: {
    border: '2px solid',
    padding: 'var(--sp32)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp24)',
  },
  resultMode: {
    fontSize: 'var(--t34)',
    lineHeight: 'var(--lh34)',
    fontWeight: 700,
  },
  resultHint: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-muted)',
  },
  resultPath: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
    padding: 'var(--sp16)',
    background: 'var(--c-bg)',
    border: '1px solid var(--c-border)',
  },
  pathRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--sp8)',
    padding: 'var(--sp4) 0',
    borderBottom: '1px solid var(--c-border)',
  },
  resetBtn: {
    alignSelf: 'flex-start',
    padding: '0 var(--sp24)',
    height: 'var(--nav-h)',           /* 48px — consistent with all buttons */
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 600,
    background: 'var(--c-text)',
    color: 'var(--c-bg)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  /* Signal reference */
  signalList: {
    border: '1px solid var(--c-border)',
  },
  signalRow: {
    display: 'grid',
    gridTemplateColumns: '64px 1fr',
    gap: 'var(--sp24)',
    padding: 'var(--sp24)',
    alignItems: 'start',
  },
  signalNum: {
    paddingTop: 'var(--sp4)',
  },
  signalTitle: {
    fontSize: 'var(--t18)',
    lineHeight: 'var(--lh18)',
    fontWeight: 600,
    marginBottom: 'var(--sp8)',
  },
  signalRule: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },
  preambleBox: {
    padding: 'var(--sp24)',
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border)',
    borderLeft: '3px solid var(--c-accent)',
  },
}
