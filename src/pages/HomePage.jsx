
import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Shield, Home, Bell, Users } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'resident':
        return '/resident';
      case 'watchman':
        return '/watchman';
      default:
        return '/';
    }
  };

  return (
    <PageContainer>
      <div className="container px-4 mx-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Secure Estate Management Solution
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Streamlined visitor management, security monitoring, and resident communications
              for modern residential estates.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link to={getDashboardLink()}>
                  {user ? 'Go to Dashboard' : 'Get Started'}
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Access Control</h3>
              <p className="text-slate-600">
                Manage visitor access with digital pre-authorization and real-time status updates.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resident Portal</h3>
              <p className="text-slate-600">
                Easily register visitors, receive notifications, and manage access requests.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Alerts</h3>
              <p className="text-slate-600">
                Get instant notifications when visitors arrive, depart, or request access.
              </p>
            </div>

            <div className="feature-card">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Security Personnel Tools</h3>
              <p className="text-slate-600">
                Equip your security team with digital tools for visitor verification and access management.
              </p>
            </div>

            <div className="feature-card">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Activity Logging</h3>
              <p className="text-slate-600">
                Comprehensive record of all visitor and security activities for future reference and analysis.
              </p>
            </div>

            <div className="feature-card">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Appointment Scheduling</h3>
              <p className="text-slate-600">
                Pre-register visitors with scheduled arrival times for streamlined entry processing.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-blue-50 rounded-xl my-12">
          <div className="text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Ready to enhance your estate security?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join Royal Park Estate Security System and experience the next generation of residential security management.
            </p>
            <Button asChild size="lg" className="text-base px-8">
              <Link to={getDashboardLink()}>
                {user ? 'Access Dashboard' : 'Get Started Now'}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default HomePage;
