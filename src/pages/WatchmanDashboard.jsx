
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useVisitors } from '../contexts/VisitorContext.jsx';
import { useActivityLog } from '../contexts/ActivityLogContext.jsx';
import { formatDate } from '../lib/utils.js';
import { 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  ArrowRight,
  Search,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { toast } from '../components/ui/toast.jsx';


const WatchmanDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { visitors, visitorCounts, updateVisitorStatus, getTodayVisitors, getVisitorById } = useVisitors();
  const { logs } = useActivityLog();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Redirect if not a watchman
  useEffect(() => {
    if (user && user.role !== 'watchman') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Get today's visitors
  const todayVisitors = getTodayVisitors();
  
  // Filter visitors based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVisitors(visitors);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = visitors.filter(visitor => 
        visitor.name.toLowerCase().includes(lowercaseQuery) ||
        visitor.apartmentNumber.toLowerCase().includes(lowercaseQuery) ||
        visitor.purpose.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredVisitors(filtered);
    }
  }, [searchQuery, visitors]);
  
  // Handle visitor status updates
  const handleStatusUpdate = (visitorId, newStatus) => {
    const success = updateVisitorStatus(visitorId, newStatus);
    
    if (success) {
      const visitor = getVisitorById(visitorId);
      const statusText = newStatus === 'arrived' ? 'arrived' : 
                          newStatus === 'left' ? 'marked as left' : 
                          newStatus === 'denied' ? 'denied entry' : 'updated';

      toast({
        title: `Visitor ${statusText}`,
        description: `${visitor.name} has been ${statusText} successfully.`,
      });
      
      // Close the details dialog
      setIsDetailsOpen(false);
    }
  };
  
  // Handle visitor details click
  const handleVisitorClick = (visitor) => {
    setSelectedVisitor(visitor);
    setIsDetailsOpen(true);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'expected':
        return <Badge className="bg-blue-100 text-blue-800">Expected</Badge>;
      case 'arrived':
        return <Badge className="bg-green-100 text-green-800">Arrived</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      case 'left':
        return <Badge className="bg-slate-100 text-slate-800">Left</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter visitors by status
  const expectedVisitors = filteredVisitors.filter(visitor => visitor.status === 'expected');
  const currentVisitors = filteredVisitors.filter(visitor => visitor.status === 'arrived');
  const recentActivityLogs = logs.slice(0, 5); // Get the 5 most recent logs

  return (
    <PageContainer>
      <div className="container px-4 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Security Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Monitor visitor activity and manage security operations
          </p>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Expected Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayVisitors.filter(v => v.status === 'expected').length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Currently on Premises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{visitorCounts.arrived}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-slate-500" />
                Total Visitors Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayVisitors.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search visitors by name, apartment, or purpose..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visitors Tabs (2 columns) */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="expected" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="expected">Expected</TabsTrigger>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="all">All Visitors</TabsTrigger>
              </TabsList>
              
              {/* Expected Visitors Tab */}
              <TabsContent value="expected">
                <Card>
                  <CardHeader>
                    <CardTitle>Expected Visitors</CardTitle>
                    <CardDescription>Visitors who are scheduled to arrive today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {expectedVisitors.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-slate-500">No expected visitors at the moment.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Apartment</TableHead>
                              <TableHead>Expected At</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {expectedVisitors.map((visitor) => (
                              <TableRow key={visitor.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleVisitorClick(visitor)}>
                                <TableCell className="font-medium">{visitor.name}</TableCell>
                                <TableCell>{visitor.apartmentNumber}</TableCell>
                                <TableCell>{formatDate(visitor.expectedArrival)}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 gap-1 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusUpdate(visitor.id, 'arrived');
                                    }}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Mark Arrived
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Current Visitors Tab */}
              <TabsContent value="current">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Visitors</CardTitle>
                    <CardDescription>Visitors who are currently on premises</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentVisitors.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-slate-500">No visitors currently on premises.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Apartment</TableHead>
                              <TableHead>Arrived At</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentVisitors.map((visitor) => (
                              <TableRow key={visitor.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleVisitorClick(visitor)}>
                                <TableCell className="font-medium">{visitor.name}</TableCell>
                                <TableCell>{visitor.apartmentNumber}</TableCell>
                                <TableCell>{formatDate(visitor.arrivedAt)}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 gap-1 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusUpdate(visitor.id, 'left');
                                    }}
                                  >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                    Mark Left
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* All Visitors Tab */}
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>All Visitors</CardTitle>
                    <CardDescription>Complete list of visitors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredVisitors.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-slate-500">No visitors found.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Apartment</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Expected At</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredVisitors.map((visitor) => (
                              <TableRow key={visitor.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleVisitorClick(visitor)}>
                                <TableCell className="font-medium">{visitor.name}</TableCell>
                                <TableCell>{visitor.apartmentNumber}</TableCell>
                                <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                                <TableCell>{formatDate(visitor.expectedArrival)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Log (1 column) */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest security and visitor activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        {log.action.includes('Login') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        ) : log.action.includes('Registered') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        ) : log.action.includes('Update') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(log.createdAt).toLocaleString()} by {log.performedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visitor Details Dialog */}
        {selectedVisitor && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Visitor Details</DialogTitle>
                <DialogDescription>
                  Complete information about the visitor
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{selectedVisitor.name}</h3>
                    <p className="text-sm text-slate-500">
                      Visiting apartment {selectedVisitor.apartmentNumber} ({selectedVisitor.residentName})
                    </p>
                  </div>
                  {getStatusBadge(selectedVisitor.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Purpose</p>
                    <p className="font-medium">{selectedVisitor.purpose}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Expected Arrival</p>
                    <p className="font-medium">{formatDate(selectedVisitor.expectedArrival)}</p>
                  </div>
                  
                  {selectedVisitor.arrivedAt && (
                    <div>
                      <p className="text-xs text-slate-500">Arrived At</p>
                      <p className="font-medium">{formatDate(selectedVisitor.arrivedAt)}</p>
                    </div>
                  )}
                  
                  {selectedVisitor.leftAt && (
                    <div>
                      <p className="text-xs text-slate-500">Left At</p>
                      <p className="font-medium">{formatDate(selectedVisitor.leftAt)}</p>
                    </div>
                  )}
                </div>
                
                {selectedVisitor.notes && (
                  <div>
                    <p className="text-xs text-slate-500">Additional Notes</p>
                    <p className="text-sm mt-1 bg-slate-50 p-3 rounded-md">{selectedVisitor.notes}</p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <DialogTitle className="text-sm mb-2">Update Status</DialogTitle>
                  <div className="flex flex-wrap gap-2">
                    {/* Show relevant status update buttons based on current status */}
                    {selectedVisitor.status === 'expected' && (
                      <>
                        <Button 
                          onClick={() => handleStatusUpdate(selectedVisitor.id, 'arrived')}
                          className="gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Arrived
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleStatusUpdate(selectedVisitor.id, 'denied')}
                          className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Deny Entry
                        </Button>
                      </>
                    )}
                    
                    {selectedVisitor.status === 'arrived' && (
                      <Button 
                        onClick={() => handleStatusUpdate(selectedVisitor.id, 'left')}
                        className="gap-1"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Mark Left
                      </Button>
                    )}
                    
                    {(selectedVisitor.status === 'denied' || selectedVisitor.status === 'left') && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        This visitor has already {selectedVisitor.status === 'denied' ? 'been denied entry' : 'left the premises'}.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageContainer>
  );
};

export default WatchmanDashboard;
