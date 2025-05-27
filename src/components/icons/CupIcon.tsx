interface IconProps {
  className?: string;
  size?: number;
}

export function CupIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 20 20" 
      fill="none" 
      className={className}
    >
      <path 
        d="M1.66666 2.5V4.16667H2.49999V15.8333C2.49999 16.2754 2.67559 16.6993 2.98815 17.0118C3.30071 17.3244 3.72463 17.5 4.16666 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V4.16667H18.3333V2.5H1.66666ZM4.16666 4.16667H15.8333V15.8333H4.16666V4.16667ZM6.66666 6.66667V14.1667H8.33332V6.66667H6.66666ZM11.6667 6.66667V14.1667H13.3333V6.66667H11.6667Z" 
        fill="currentColor"
      />
    </svg>
  );
} 