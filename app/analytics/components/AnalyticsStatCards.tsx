'use client'

interface AnalyticsStatCardsProps {
    topicsStudied: number
    averageAccuracy: number
    totalStudyTime: string
    mostActiveDay: string
}

export default function AnalyticsStatCards({
    topicsStudied,
    averageAccuracy,
    totalStudyTime,
    mostActiveDay,
}: AnalyticsStatCardsProps) {
    const cards = [
        {
            label: 'Topics Studied',
            value: `${topicsStudied}`,
            color: 'text-kpop-purple',
            bgColor: 'bg-kpop-purple/10',
            icon: (
                <svg className="w-6 h-6 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            label: 'Average Accuracy',
            value: `${averageAccuracy}%`,
            color: 'text-music-green',
            bgColor: 'bg-music-green/10',
            icon: (
                <svg className="w-6 h-6 text-music-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            label: 'Total Study Time',
            value: totalStudyTime,
            color: 'text-kpop-purple',
            bgColor: 'bg-kpop-purple/10',
            icon: (
                <svg className="w-6 h-6 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Most Active Day',
            value: mostActiveDay,
            color: 'text-kpop-red',
            bgColor: 'bg-kpop-red/10',
            icon: (
                <svg className="w-6 h-6 text-kpop-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => (
                <div
                    key={card.label}
                    className="card animate-slide-up"
                    style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{card.label}</div>
                </div>
            ))}
        </div>
    )
}
