import { gbpListAccounts } from '@/app/api/admin/actions'

function getErrorMessage(e: unknown) {
    if (e instanceof Error) return e.message
    if (typeof e === 'string') return e
    try {
        return JSON.stringify(e)
    } catch {
        return String(e)
    }
}

export default async function GbpTestPage() {
    try {
        const data = await gbpListAccounts()
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">GBP Accounts</h1>
                <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        )
    } catch (e: unknown) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">GBP Error</h1>
                <pre className="text-xs bg-red-50 p-4 rounded-lg overflow-auto">
                    {getErrorMessage(e)}
                </pre>
            </div>
        )
    }
}
