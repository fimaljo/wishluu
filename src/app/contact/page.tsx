// Simple page - no need for features folder
export default function ContactPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8'>
      <div className='max-w-4xl mx-auto px-6'>
        <h1 className='text-4xl font-bold text-center mb-8'>Contact Us</h1>

        <div className='bg-white rounded-2xl shadow-lg p-8'>
          <form className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Name
              </label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='Your name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='your@email.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Message
              </label>
              <textarea
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='Your message...'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300'
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
