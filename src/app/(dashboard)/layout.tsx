import Link from 'next/link';

// This layout applies to all pages in the (dashboard) route group
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold text-gray-900">WishLuu</span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-8">
              <Link href="/wishes" className="text-gray-600 hover:text-purple-600 transition-colors">
                My Wishes
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-purple-600 transition-colors">
                Create New
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-purple-600 transition-colors">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 