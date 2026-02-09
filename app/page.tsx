import Link from 'next/link'

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="gradient-hero text-white">
                <div className="container mx-auto px-4 py-24 md:py-32">
                    <div className="text-center animate-fade-in max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-heading mb-6 leading-tight">
                            Learn Math with Your
                            <span className="block opacity-95">Favorite K-pop Stars</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 font-body">
                            Master algebra through interactive lessons featuring NewJeans and more!
                            Earn XP, unlock badges, and make math fun.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block bg-white text-kpop-purple px-8 py-4 rounded-xl font-bold text-lg
                                       hover:shadow-kpop hover:scale-105 transition-all duration-200 active:scale-95"
                        >
                            Start Learning Free 🚀
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-bg-light">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading text-gradient mb-3">Why K-POP Math?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            A fresh way to learn algebra — powered by music you love.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Feature 1 */}
                        <div className="card-glass text-center animate-slide-up stagger-1 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <span className="text-3xl">🎵</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-kpop-purple">
                                Learn Through Music
                            </h3>
                            <p className="text-gray-600 font-body">
                                Connect algebra concepts with your favorite K-pop groups.
                                Make learning memorable and fun!
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card-glass text-center animate-slide-up stagger-2 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-kpop-blue to-kpop-purple rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <span className="text-3xl">🎮</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-kpop-purple">
                                Interactive Tiers
                            </h3>
                            <p className="text-gray-600 font-body">
                                Progress through 5 engaging tiers: Hook, Concept, Practice, Deep, and Wrap-up.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card-glass text-center animate-slide-up stagger-3 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-kpop-pink to-kpop-red rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <span className="text-3xl">🏆</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-kpop-purple">
                                Earn Badges
                            </h3>
                            <p className="text-gray-600 font-body">
                                Track your progress with XP points, streaks, and achievement badges.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-bg-light pb-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="gradient-hero rounded-3xl p-12 md:p-16 max-w-4xl mx-auto text-white shadow-neon animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-heading mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-lg md:text-xl mb-10 opacity-90">
                            Join thousands of students learning algebra the fun way!
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/signup"
                                className="bg-white text-kpop-purple px-8 py-4 rounded-xl font-bold text-lg
                                           hover:shadow-kpop hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                Sign Up Free
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg
                                           hover:bg-white hover:text-kpop-purple transition-all duration-200"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-bg-light border-t border-gray-200">
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="w-16 h-0.5 gradient-primary mx-auto mb-4 rounded-full" />
                    <p className="text-gray-500 text-sm">&copy; 2026 K-POP Math MVP. Learn algebra with style! 🎵</p>
                </div>
            </footer>
        </div>
    )
}
