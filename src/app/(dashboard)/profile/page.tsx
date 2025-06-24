export default function ProfilePage() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Profile</h1>

        <div className='space-y-6'>
          {/* Profile Info */}
          <div className='flex items-center space-x-4'>
            <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-2xl font-bold'>JD</span>
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>John Doe</h2>
              <p className='text-gray-600'>john@example.com</p>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-purple-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>12</div>
              <div className='text-sm text-gray-600'>Wishes Created</div>
            </div>
            <div className='bg-pink-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-pink-600'>45</div>
              <div className='text-sm text-gray-600'>Total Views</div>
            </div>
            <div className='bg-blue-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>8</div>
              <div className='text-sm text-gray-600'>Likes Received</div>
            </div>
          </div>

          {/* Settings */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Settings
            </h3>
            <div className='space-y-3'>
              <button className='w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors'>
                Edit Profile
              </button>
              <button className='w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors'>
                Change Password
              </button>
              <button className='w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors'>
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
