interface SpacerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap: Record<NonNullable<SpacerProps['size']>, string> = {
	sm: 'h-8',
	md: 'h-16',
	lg: 'h-24',
	xl: 'h-32',
};

export function Spacer({ size = 'lg' }: SpacerProps) {
	return <div className={sizeMap[size]} aria-hidden="true" />;
}
