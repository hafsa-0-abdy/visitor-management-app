
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotifications } from '../contexts/NotificationContext.jsx';
import { formatTimeAgo, formatDate } from '../lib/utils.js';
import { Bell, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Separator } from '../components/ui/separator.jsx';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  
  // Mark all as read when component mounts
  useEffect(() => {
    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, []);
  
  const getDashboardLink = () => {
    if (!user) return '/';
    
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
  
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <PageContainer>
      <div className="container px-4 mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Button asChild variant="ghost" className="h-8 w-8 p-0">
            <Link to={getDashboardLink()}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Your Notifications</CardTitle>
                <CardDescription>Stay updated on important events</CardDescription>
              </div>
              {notifications.length > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <Check className="h-3.5 w-3.5" />
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {sortedNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700">No notifications yet</h3>
                <p className="text-slate-500 mt-1">
                  You'll be notified when there are important updates
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedNotifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    <div 
                      className={`
                        p-4 rounded-lg transition-colors
                        ${notification.read ? 'bg-white' : 'bg-blue-50'}
                      `}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`
                            h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${notification.read ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}
                          `}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-800 font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-slate-500">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
            <Link 
              to={getDashboardLink()}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Dashboard
            </Link>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
