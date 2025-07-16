import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Navigation */}
      <nav className='flex items-center justify-between p-6 max-w-[1400px] mx-auto'>
        <Link href='/' className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>W</span>
          </div>
          <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            WishLuu
          </span>
        </Link>
        <div className='flex items-center space-x-4'>
          <Link
            href='/'
            className='text-gray-600 hover:text-purple-600 transition-colors'
          >
            Home
          </Link>
          <Link
            href='/wishes'
            className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300'
          >
            Create Wish
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            About WishLuu
          </h1>
          <p className='text-xl text-gray-600'>
            Making every moment special with interactive wishes
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Our Story
          </h2>
          <p className='text-gray-600 leading-relaxed mb-6'>
            WishLuu was born from the simple idea that every special moment
            deserves to be celebrated in a unique and memorable way. We believe
            that traditional greetings, while heartfelt, can be enhanced with
            interactivity and personalization.
          </p>
          <p className='text-gray-600 leading-relaxed'>
            Our platform combines beautiful design, interactive animations, and
            heartfelt messages to create experiences that truly touch the hearts
            of your loved ones.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <div className='text-3xl mb-4'>🎯</div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Our Mission
            </h3>
            <p className='text-gray-600'>
              To help people create meaningful connections through personalized,
              interactive digital experiences.
            </p>
          </div>
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <div className='text-3xl mb-4'>💝</div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Our Vision
            </h3>
            <p className='text-gray-600'>
              A world where every celebration is enhanced by technology that
              brings people closer together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
