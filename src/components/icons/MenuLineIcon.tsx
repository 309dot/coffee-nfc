interface IconProps {
  className?: string;
  size?: number;
}

export function MenuLineIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 20 20" 
      fill="none" 
      className={className}
    >
      <path 
        d="M2.5 5H17.5V6.66667H2.5V5ZM2.5 9.16667H17.5V10.8333H2.5V9.16667ZM2.5 13.3333H17.5V15H2.5V13.3333Z" 
        fill="currentColor"
      />
    </svg>
  );
} 