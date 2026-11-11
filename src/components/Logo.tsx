interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-24 w-24 sm:h-32 sm:w-32',
};

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <img
      src="/photo_2026-11-10_22-24-04%20copy.jpg"
      alt="StudySpace AI logo"
      className={`${SIZES[size]} rounded-full object-cover shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/60`}
    />
  );
}
