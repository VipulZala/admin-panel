import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-slideUp">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Manage your e-commerce products, inventory, and team with ease
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Products Card */}
          <Link href="/products" className="group">
            <div className="card-glass p-8 hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Products</h3>
              <p className="text-white/70 mb-4">View and manage your product catalog</p>
              <div className="flex items-center text-white font-semibold">
                <span>Go to Products</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Add Product Card */}
          <Link href="/products/new" className="group">
            <div className="card-glass p-8 hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Add Product</h3>
              <p className="text-white/70 mb-4">Create a new product listing</p>
              <div className="flex items-center text-white font-semibold">
                <span>Create Product</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Add Admin Card */}
          <Link href="/admin/onboard" className="group">
            <div className="card-glass p-8 hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Add Admin</h3>
              <p className="text-white/70 mb-4">Onboard new admin users</p>
              <div className="flex items-center text-white font-semibold">
                <span>Manage Admins</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-glass p-6 text-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-white/70">Total Products</div>
            </div>
            <div className="card-glass p-6 text-center animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl font-bold text-white mb-2">⚡</div>
              <div className="text-white/70">Quick Access</div>
            </div>
            <div className="card-glass p-6 text-center animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold text-white mb-2">🔒</div>
              <div className="text-white/70">Secure Dashboard</div>
            </div>
          </div>
        </div>
      </div>

   
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}

