import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Youtube, BookOpen } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Youtube className="h-8 w-8 text-red-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SumNot
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button 
                  variant={location.pathname === '/' ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Youtube className="h-4 w-4" />
                  <span>Summarize</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
