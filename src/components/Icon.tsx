type IconName =
  | 'calendar'
  | 'location'
  | 'email'
  | 'clipboard'
  | 'check'
  | 'arrowRight'
  | 'arrowDown';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className = '' }: IconProps) {
  const common = {
    // Use style to ensure consistent CSS sizing in flex/inline contexts
    style: { width: `${size}px`, height: `${size}px` },
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    xmlns: 'http://www.w3.org/2000/svg',
    preserveAspectRatio: 'xMidYMid meet',
    // Block-level, non-shrinking to avoid width variance across contexts
    className: `block flex-none ${className}`,
  } as const;

  switch (name) {
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9Z"/>
        </svg>
      );
    case 'location':
      return (
        <svg {...common}>
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
      );
    case 'email':
      return (
        <svg {...common}>
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common}>
          <path d="M9 3h6a2 2 0 0 1 2 2h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1a2 2 0 0 1 2-2Zm0 2v1h6V5H9Z"/>
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m10 16.2-3.3-3.3-1.4 1.4L10 19l9-9-1.4-1.4L10 16.2Z" />
        </svg>
      );
    case 'arrowRight':
      return (
        <svg {...common}>
          <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2L11.6 6.4 13 5Z"/>
        </svg>
      );
    case 'arrowDown':
      return (
        <svg {...common}>
          <path d="M5 11l7 7 7-7-1.4-1.4L13 15.2V4h-2v11.2L6.4 9.6 5 11Z"/>
        </svg>
      );
    default:
      return null;
  }
}
