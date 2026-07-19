export type Outcome = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  trace: number[];
};

export const outcomes: Outcome[] = [
  {
    value: 1.5,
    suffix: ' mo',
    decimals: 1,
    label: 'of blocked R&D unblocked in three hours',
    trace: [18, 20, 19, 18, 15, 11, 6, 2],
  },
  {
    value: 1,
    prefix: '< ',
    suffix: ' min',
    label: 'for four-level annotation planning',
    trace: [22, 20, 23, 18, 14, 9, 5, 3],
  },
  {
    value: 90,
    suffix: '%',
    label: 'less time spent syncing camera sessions',
    trace: [2, 5, 7, 9, 13, 17, 20, 22],
  },
  {
    value: 50,
    suffix: '+',
    label: 'operators served by one capture timebase',
    trace: [3, 4, 7, 8, 13, 14, 19, 22],
  },
];
