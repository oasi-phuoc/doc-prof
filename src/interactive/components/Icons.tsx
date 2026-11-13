import type { ButtonHTMLAttributes } from 'react'

export type IconName =
  | 'users'
  | 'user'
  | 'mascot'
  | 'contrast'
  | 'expand'
  | 'folder'
  | 'skip'
  | 'pause'
  | 'play'
  | 'exit'
  | 'think'
  | 'card'
  | 'touch'
  | 'discuss'
  | 'check'
  | 'wrong'
  | 'timer'
  | 'reset'
  | 'plus'
  | 'minus'
  | 'close'
  | 'lock'
  | 'unlock'
  | 'finish'
  | 'tally'
  | 'trophy'
  | 'transcript'
const paths: Record<IconName, React.ReactNode> = {
  transcript: <><path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15M5 8h4m-4 4h4m6-4h4m-4 4h4" /></>,
  trophy: <><path d="M8 3h8v6a4 4 0 0 1-8 0Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v6m-4 2h8m-6-2h4" /></>,
  users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-3-5" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  mascot: <><path d="M6 10C2 5 4 2 8 5m10 5c4-5 2-8-2-5M4 14a8 7 0 0 1 16 0c0 5-4 7-8 7s-8-2-8-7Z" /><path d="M8 12v1m8-1v1m-6 3q2 2 4 0" /></>,
  contrast: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" />
    </>
  ),
  expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  folder: <path d="M3 7V5h6l2 2h10v13H3Z" />,
  skip: (
    <>
      <path d="m5 5 10 7-10 7Z" />
      <path d="M19 5v14" />
    </>
  ),
  pause: (
    <>
      <path d="M8 5v14M16 5v14" strokeWidth="4" />
    </>
  ),
  play: <path d="m8 4 12 8-12 8Z" />,
  exit: (
    <>
      <path d="M10 4H4v16h6m5-13 5 5-5 5M8 12h12" />
    </>
  ),
  think: (
    <>
      <path d="M9 20v-4H6l-1-5a7 7 0 1 1 13 3v6M10 7l1 2-2 2m6-4-1 2 2 2M11 13h3" />
    </>
  ),
  card: (
    <>
      <rect x="8" y="2" width="11" height="13" rx="2" />
      <path d="M11 11v8c0 3-5 3-5 0l-2-6m8-7h3m-1 3v2" />
    </>
  ),
  touch: (
    <>
      <path d="M10 12V5a2 2 0 0 1 4 0v6l5 2v5l-3 4H9l-5-7a2 2 0 0 1 3-2l3 2M3 5l2 1M7 1l1 2m10-1-1 2m4 4-2 1" />
    </>
  ),
  discuss: (
    <>
      <path d="M3 3h15v11H9l-5 4v-4H3Z" />
      <path d="M18 8h3v12h-3l-3 2v-4h-4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m6 12 4 4 8-8" />
    </>
  ),
  wrong: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 8 8 8m0-8-8 8" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="14" r="8" />
      <path d="M9 2h6m-3 4v-4m0 8v5l3 2M18 5l2-2" />
    </>
  ),
  reset: (
    <>
      <path d="M3 11a9 9 0 1 1 1 6M3 4v7h7" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  minus: <path d="M4 12h16" />,
  close: <path d="m5 5 14 14m0-14L5 19" />,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 4v3" /></>,
  unlock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0m-4 8v3" /></>,
  finish: <><path d="M5 22V3m0 1c5-4 9 4 15 0v11c-6 4-10-4-15 0" /></>,
  tally: <path d="M5 5v14M10 5v14M15 5v14M20 5v14M2 17 22 7" />,
}
export function Icon({
  name,
  className = '',
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg
      className={`ci-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
export function IconButton({
  icon,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  label: string
}) {
  return (
    <button
      {...props}
      type="button"
      className={`ci-icon-button ${props.className ?? ''}`}
      aria-label={label}
      title={label}
    >
      <Icon name={icon} />
    </button>
  )
}
