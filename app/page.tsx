import Link from 'next/link'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center animate-fade-in">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6">
                        Learn Math with Your
                        <span className="block text-gradient">Favorite K-pop Stars</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                        Master algebra through interactive lessons featuring NewJeans and more!
                        Earn XP, unlock badges, and make math fun.
                    </p>
                    <Link href="/signup" className="btn-primary inline-block text-lg">
                        Start Learning Free 🚀
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Feature 1 */}
                    <div className="card text-center animate-slide-up">
                        <div className="text-5xl mb-4">🎵</div>
                        <h3 className="text-2xl font-bold mb-3 text-kpop-purple">
                            Learn Through Music
                        </h3>
                        <p className="text-gray-600">
                            Connect algebra concepts with your favorite K-pop groups.
                            Make learning memorable and fun!
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="text-5xl mb-4">🎮</div>
                        <h3 className="text-2xl font-bold mb-3 text-kpop-purple">
                            Interactive Tiers
                        </h3>
                        <p className="text-gray-600">
                            Progress through 5 engaging tiers: Hook, Concept, Practice, Deep, and Wrap-up.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="text-5xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold mb-3 text-kpop-purple">
                            Earn Badges
                        </h3>
                        <p className="text-gray-600">
                            Track your progress with XP points, streaks, and achievement badges.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="bg-gradient-to-r from-kpop-purple to-kpop-red rounded-2xl p-12 max-w-4xl mx-auto text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of students learning algebra the fun way!
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link href="/signup" className="bg-white text-kpop-purple px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform">
                            Sign Up Free
                        </Link>
                        <Link href="/login" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-kpop-purple transition-all">
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
                <p>&copy; 2026 K-POP Math MVP. Learn algebra with style! 🎵</p>
            </footer>
        </div>
    )
}
