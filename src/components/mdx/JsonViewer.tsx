import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

interface JsonViewerProps {
	data: JsonValue
	/** Root nodes expanded on first render; deeper levels start collapsed. */
	defaultExpandDepth?: number
	caption?: string
}

function isExpandable(value: JsonValue): value is JsonValue[] | { [key: string]: JsonValue } {
	return typeof value === 'object' && value !== null
}

function typeSummary(value: JsonValue): string {
	if (Array.isArray(value)) return `Array(${value.length})`
	if (value === null) return 'null'
	if (typeof value === 'object') return `Object(${Object.keys(value).length})`
	return typeof value
}

function ValuePreview({ value }: { value: JsonValue }) {
	if (value === null) return <span className="text-muted-foreground">null</span>
	if (typeof value === 'string') return <span className="text-chart-3">&quot;{value}&quot;</span>
	if (typeof value === 'boolean') return <span className="text-primary">{String(value)}</span>
	if (typeof value === 'number') return <span className="text-secondary">{value}</span>
	return <span className="text-muted-foreground">{typeSummary(value)}</span>
}

interface NodeProps {
	label: string
	value: JsonValue
	depth: number
	defaultExpandDepth: number
	isLast: boolean
	hideLabel?: boolean
}

function JsonNode({ label, value, depth, defaultExpandDepth, isLast, hideLabel }: NodeProps) {
	const expandable = isExpandable(value)
	const [expanded, setExpanded] = useState(depth < defaultExpandDepth)

	if (!expandable) {
		return (
			<div className="hover:bg-muted/40 flex items-start gap-1 px-2 py-0.5" style={{ paddingLeft: depth * 16 + 8 }}>
				{!hideLabel ? <span className="text-foreground shrink-0">{label}:</span> : null}
				<span>
					<ValuePreview value={value} />
					{!isLast ? <span className="text-muted-foreground">,</span> : null}
				</span>
			</div>
		)
	}

	const entries = Array.isArray(value)
		? value.map((v, i) => [String(i), v] as const)
		: Object.entries(value)
	const bracket = Array.isArray(value) ? ['[', ']'] : ['{', '}']

	return (
		<div>
			<button
				type="button"
				onClick={() => setExpanded((prev) => !prev)}
				className="hover:bg-primary/10 group flex w-full cursor-pointer items-start gap-1 px-2 py-0.5 text-left"
				style={{ paddingLeft: depth * 16 + 8 }}
				aria-expanded={expanded}
			>
				<ChevronRight
					className={`text-primary group-hover:text-primary mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
					strokeWidth={2.5}
				/>
				{!hideLabel ? <span className="text-foreground">{label}:</span> : null}
				{expanded ? (
					<span className="text-muted-foreground">{bracket[0]}</span>
				) : (
					<span className="text-muted-foreground">
						{bracket[0]} {typeSummary(value)} {bracket[1]}
						{!isLast ? ',' : ''}
					</span>
				)}
			</button>
			{expanded ? (
				<div>
					{entries.map(([key, child], i) => (
						<JsonNode
							key={key}
							label={Array.isArray(value) ? key : `"${key}"`}
							value={child}
							depth={depth + 1}
							defaultExpandDepth={defaultExpandDepth}
							isLast={i === entries.length - 1}
						/>
					))}
					<div
						className="text-muted-foreground px-2 py-0.5"
						style={{ paddingLeft: depth * 16 + 8 }}
					>
						{bracket[1]}
						{!isLast ? ',' : ''}
					</div>
				</div>
			) : null}
		</div>
	)
}

export function JsonViewer({ data, defaultExpandDepth = 1, caption }: JsonViewerProps) {
	return (
		<figure className="my-8">
			<div className="border-border bg-card overflow-x-auto rounded-xl border font-mono text-sm leading-6">
				<JsonNode
					label=""
					value={data}
					depth={0}
					defaultExpandDepth={defaultExpandDepth}
					isLast
					hideLabel
				/>
			</div>
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	)
}
