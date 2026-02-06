interface RowPageProps {
children: React.ReactNode
}

export default function RowPage({ children }: RowPageProps) {
return (
<div className="flex-1 overflow-auto">
{children}
</div>
)
}