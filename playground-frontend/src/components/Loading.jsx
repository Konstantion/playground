import React from "react"
import {Loader2} from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Loading…</h2>
        </div>
    )
}
