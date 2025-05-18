
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useVisitors } from '../contexts/VisitorContext.jsx';
import { useActivityLog } from '../contexts/ActivityLogContext.jsx';
import { 
  Users, 
  Home,
  ShieldCheck,
  BarChart3,
  CalendarRange,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { visitors, visitorCounts } = useVisitors();
  const { logs } = useActivityLog();
  
  // Redirect if not an admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Calculate statistics
  const todayVisitors = visitors.filter(visitor => {
    const visitDate = new Date(visitor.expectedArrival).toDateString();
    const today = new Date().toDateString();
    return visitDate === today;
  });
  
  const visitorsByStatus = {
    expected: visitors.filter(v => v.status === 'expected').length,
    arrived: visitors.filter(v => v.status === 'arrived').length,
    left: visitors.filter(v => v.status === 'left').length,
    denied: visitors.filter(v => v.status === 'denied').length,
  };
  
  // Group logs by type
  const logsByType = {
    login: logs.filter(log => log.action.includes('Login')).length,
    visitorRegistered: logs.filter(log => log.action.includes('Visitor Registered')).length,
    statusUpdate: logs.filter(log => log.action.includes('Status Update')).length,
    other: logs.filter(log => !log.action.includes('Login') && !log.action.includes('Visitor Registered') && !log.action.includes('Status Update')).length,
  };

  return (
    <PageContainer>
      <div className="container px-4 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Monitor and manage the Royal Park Estate security system
          </p>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <CardDescription>All time</CardDescription>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{visitors.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {todayVisitors.length} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Current Visitors</CardTitle>
                <CardDescription>On premises now</CardDescription>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{visitorCounts.arrived}</div>
              <p className="text-xs text-slate-500 mt-1">
                {visitorsByStatus.expected} expected later
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                <CardDescription>System activities</CardDescription>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{logs.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                Security and access activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayVisitors.length + logs.filter(log => {
                  const logDate = new Date(log.createdAt).toDateString();
                  const today = new Date().toDateString();
                  return logDate === today;
                }).length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Combined visits and system events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visitor Stats */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Activity</CardTitle>
                <CardDescription>Overview of visitor statistics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{visitorsByStatus.expected}</div>
                    <div className="text-xs text-slate-500">Expected</div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{visitorsByStatus.arrived}</div>
                    <div className="text-xs text-slate-500">Arrived</div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{visitorsByStatus.left}</div>
                    <div className="text-xs text-slate-500">Left</div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{visitorsByStatus.denied}</div>
                    <div className="text-xs text-slate-500">Denied</div>
                  </div>
                </div>
                
                {/* Visitor chart - simplified as bar representation */}
                <div className="mt-8 mb-4">
                  <h4 className="text-sm font-medium mb-4">Visitor Trend (Last 7 Days)</h4>
                  <div className="relative h-36">
                    <div className="flex h-full items-end justify-between">
                      {/* Mock data for chart bars */}
                      {[20, 45, 28, 15, 35, 50, 30].map((value, i) => (
                        <div key={i} className="w-8 flex-grow mx-1">
                          <div 
                            className="bg-blue-500 rounded-t" 
                            style={{ height: `${value}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={i} className="text-center flex-grow">{day}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Logs</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <div className="space-y-5">
                  {logs.slice(0, 8).map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="h-9 w-9 rounded-full flex items-center justify-center bg-slate-100 text-slate-600">
                        {log.action.includes('Login') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        ) : log.action.includes('Registered') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`w-2 h-2 rounded-full ${
                            log.performedByRole === 'admin' ? 'bg-purple-400' : 
                            log.performedByRole === 'resident' ? 'bg-blue-400' : 
                            'bg-green-400'
                          }`}></span>
                          <p className="text-xs text-slate-400">
                            {new Date(log.createdAt).toLocaleString()} by{' '}
                            <span className="font-medium">{log.performedBy}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="mt-6">
          <Tabs defaultValue="visitors" className="space-y-4">
            <TabsList>
              <TabsTrigger value="visitors">All Visitors</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            {/* Visitors Tab */}
            <TabsContent value="visitors">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Records</CardTitle>
                  <CardDescription>Complete database of visitor entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Visitor Name</TableHead>
                          <TableHead>Apartment</TableHead>
                          <TableHead>Resident</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitors.slice(0, 10).map((visitor) => (
                          <TableRow key={visitor.id}>
                            <TableCell className="font-medium">{visitor.name}</TableCell>
                            <TableCell>{visitor.apartmentNumber}</TableCell>
                            <TableCell>{visitor.residentName}</TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                visitor.status === 'expected' ? 'bg-blue-100 text-blue-800' :
                                visitor.status === 'arrived' ? 'bg-green-100 text-green-800' :
                                visitor.status === 'denied' ? 'bg-red-100 text-red-800' :
                                'bg-slate-100 text-slate-800'
                              }`}>
                                {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(visitor.expectedArrival).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Logs Tab */}
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Comprehensive activity audit trail</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Date & Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.slice(0, 10).map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                            <TableCell>{log.performedBy}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                log.performedByRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                                log.performedByRole === 'resident' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {log.performedByRole}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                  <CardDescription>Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Activity Distribution */}
                    <div>
                      <h3 className="text-sm font-medium mb-4">Activity Distribution</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>User Logins ({logsByType.login})</span>
                            <span>{Math.round((logsByType.login / logs.length) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(logsByType.login / logs.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Visitor Registrations ({logsByType.visitorRegistered})</span>
                            <span>{Math.round((logsByType.visitorRegistered / logs.length) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(logsByType.visitorRegistered / logs.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Status Updates ({logsByType.statusUpdate})</span>
                            <span>{Math.round((logsByType.statusUpdate / logs.length) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                            <div 
                              className="bg-amber-500 h-2 rounded-full" 
                              style={{ width: `${(logsByType.statusUpdate / logs.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Other Activities ({logsByType.other})</span>
                            <span>{Math.round((logsByType.other / logs.length) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${(logsByType.other / logs.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visitor Status Distribution */}
                    <div>
                      <h3 className="text-sm font-medium mb-4">Visitor Status Distribution</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {Math.round((visitorsByStatus.expected / visitors.length) * 100)}%
                          </div>
                          <div className="text-xs text-blue-600 mt-1">Expected</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {Math.round((visitorsByStatus.arrived / visitors.length) * 100)}%
                          </div>
                          <div className="text-xs text-green-600 mt-1">Arrived</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-slate-600">
                            {Math.round((visitorsByStatus.left / visitors.length) * 100)}%
                          </div>
                          <div className="text-xs text-slate-600 mt-1">Left</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-red-600">
                            {Math.round((visitorsByStatus.denied / visitors.length) * 100)}%
                          </div>
                          <div className="text-xs text-red-600 mt-1">Denied</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
