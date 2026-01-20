import styles from './Button.module.css';

export interface ButtonProps {
  label: string;
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function Button({
  label,
  primary = false,
  size = 'medium',
  onClick,
}: ButtonProps) {
  const mode = primary ? styles.primaryButton : styles.secondaryButton;
  return (
    <button
      type="button"
      className={`${styles.button} ${mode} ${styles[size]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
