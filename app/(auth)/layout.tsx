export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-indigo-600">QuizD</h1>
            <p className="mt-2 text-gray-600">Test your knowledge!</p>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-lg">
            {children}
          </div>
        </div>
      </div>
    )
  }