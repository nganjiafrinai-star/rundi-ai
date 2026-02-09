interface RowPageProps {
    children: React.ReactNode
}

export default function RowPage({ children }: RowPageProps) {
    return (
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
            {children}
        </div>
    )
}