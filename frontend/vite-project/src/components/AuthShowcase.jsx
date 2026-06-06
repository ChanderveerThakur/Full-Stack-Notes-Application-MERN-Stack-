const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Write anything, your way",
    description: "Jot down ideas, to-dos, or reminders in seconds.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Find it easily",
    description: "Quick search helps you find any note in a flash.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Keep everything organized",
    description: "All your notes, lists, and thoughts stay in one place.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Your notes, always safe",
    description: "We keep your notes private and secure.",
  },
];

const CONTENT = {
  login: {
    badge: "Your notes, simplified",
    heading: "Save what matters, find it when you need it.",
    description:
      "Notes is the simple place to write down your thoughts, ideas, and lists — and keep them all in one spot.",
    footer: "Make Notes your everyday space to think, plan, and stay organized.",
  },
  signup: {
    badge: "Get started free",
    heading: "Your ideas deserve a beautiful home.",
    description:
      "Create your account in seconds and start capturing thoughts instantly — no extra login step needed.",
    footer: "Join Notes and turn everyday ideas into something you can come back to.",
  },
};

function AuthShowcase({ variant = "login" }) {
  const content = CONTENT[variant];

  return (
    <aside className="auth-showcase">
      <div className="auth-showcase-content">
        <span className="auth-badge">{content.badge}</span>
        <h2>{content.heading}</h2>
        <p className="auth-showcase-desc">{content.description}</p>

        <ul className="auth-feature-list">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="auth-feature-item">
              <span className="auth-feature-icon">{feature.icon}</span>
              <div>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </div>
            </li>
          ))}
        </ul>

        <p className="auth-showcase-footer">
          {content.footer} <span aria-hidden="true">♡</span>
        </p>
      </div>
    </aside>
  );
}

export default AuthShowcase;
