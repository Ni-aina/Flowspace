import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const Home = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-background">
            <Navbar 
                isAuthenticated={!!session}
            />
            
            <main>
                <section className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Welcome to <span className="text-primary">Flowspace</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Streamline your workflow, boost productivity, and transform the way you work with our intuitive platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/auth/sign-up"
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            className="px-8 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
                            href="#"
                        >
                            Learn More
                        </Link>
                    </div>
                </section>

                <section id="features" className="container mx-auto px-4 py-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg border">
                            <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-primary-foreground font-bold">⚡</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                            <p className="text-muted-foreground">Optimized performance for seamless workflow management</p>
                        </div>
                        <div className="text-center p-6 rounded-lg border">
                            <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-primary-foreground font-bold">🔒</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure</h3>
                            <p className="text-muted-foreground">Enterprise-grade security to protect your data</p>
                        </div>
                        <div className="text-center p-6 rounded-lg border">
                            <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-primary-foreground font-bold">🚀</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Scalable</h3>
                            <p className="text-muted-foreground">Grow your business without limitations</p>
                        </div>
                    </div>
                </section>

                <section className="bg-primary text-primary-foreground py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-xl mb-8 opacity-90">Join thousands of users who trust Flowspace</p>
                        <Link
                            href="/auth/sign-up"
                            className="px-8 py-3 bg-background text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home;