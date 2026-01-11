import { gbpListAccounts } from '@/app/api/admin/actions'

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
    } catch (e: any) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">GBP Error</h1>
                <pre className="text-xs bg-red-50 p-4 rounded-lg overflow-auto">
                    {String(e?.message ?? e)}
                </pre>
            </div>
        )
    }
}
