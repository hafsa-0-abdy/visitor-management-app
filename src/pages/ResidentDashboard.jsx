
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useVisitors } from '../contexts/VisitorContext.jsx';
import { formatDate } from '../lib/utils.js';
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '../components/ui/dialog.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Textarea } from '../components/ui/textarea.jsx';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addVisitor, getVisitorsByResident } = useVisitors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    purpose: '',
    expectedArrival: '',
    notes: '',
    apartmentNumber: user?.apartmentNumber || '',
  });

  // Redirect if not a resident
  useEffect(() => {
    if (user && user.role !== 'resident') {
      navigate('/');
    }
    
    // Update apartmentNumber when user changes
    if (user?.apartmentNumber) {
      setNewVisitor(prev => ({
        ...prev,
        apartmentNumber: user.apartmentNumber || ''
      }));
    }
  }, [user, navigate]);

  // Load resident's visitors
  useEffect(() => {
    if (user) {
      const residentVisitors = getVisitorsByResident(user.id);
      setVisitors(residentVisitors);
    }
  }, [user, getVisitorsByResident]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisitor({
      ...newVisitor,
      [name]: value,
    });
  };

  const handleAddVisitor = (e) => {
    e.preventDefault();
    
    if (!newVisitor.name || !newVisitor.purpose || !newVisitor.expectedArrival) {
      alert('Please fill in all required fields');
      return;
    }
    
    addVisitor({
      ...newVisitor,
      apartmentNumber: user.apartmentNumber,
    });
    
    // Refresh visitors list
    setVisitors(getVisitorsByResident(user.id));
    
    // Reset form
    setNewVisitor({
      name: '',
      purpose: '',
      expectedArrival: '',
      notes: '',
      apartmentNumber: user.apartmentNumber || '',
    });
    setIsDialogOpen(false);
  };

  // Filter visitors by status
  const expectedVisitors = visitors.filter(visitor => visitor.status === 'expected');
  const currentVisitors = visitors.filter(visitor => visitor.status === 'arrived');
  const pastVisitors = visitors.filter(visitor => visitor.status === 'left' || visitor.status === 'denied');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'expected':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Expected</Badge>;
      case 'arrived':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Arrived</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Denied</Badge>;
      case 'left':
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Left</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageContainer>
      <div className="container px-4 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Resident Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Manage your visitors and view security information
          </p>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Expected Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{expectedVisitors.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Current Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{currentVisitors.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-slate-500" />
                Past Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pastVisitors.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Add New Visitor Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Your Visitors</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Visitor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register a New Visitor</DialogTitle>
                <DialogDescription>
                  Please provide details about your expected visitor.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddVisitor}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Visitor Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newVisitor.name}
                      onChange={handleInputChange}
                      placeholder="Enter visitor's name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Visit</Label>
                    <Input
                      id="purpose"
                      name="purpose"
                      value={newVisitor.purpose}
                      onChange={handleInputChange}
                      placeholder="e.g. Social Visit, Delivery, Maintenance"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedArrival">Expected Arrival Time</Label>
                    <Input
                      id="expectedArrival"
                      name="expectedArrival"
                      type="datetime-local"
                      value={newVisitor.expectedArrival}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newVisitor.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information for security"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Register Visitor</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Visitors Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Visitors</TabsTrigger>
            <TabsTrigger value="expected">Expected</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          {/* All Visitors Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Visitors</CardTitle>
                <CardDescription>Complete list of all your visitors</CardDescription>
              </CardHeader>
              <CardContent>
                {visitors.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">No visitors registered yet.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(true)}
                      className="mt-4"
                    >
                      Register Your First Visitor
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Expected Arrival</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitors.map((visitor) => (
                          <TableRow key={visitor.id}>
                            <TableCell className="font-medium">{visitor.name}</TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
                            <TableCell>{formatDate(visitor.expectedArrival)}</TableCell>
                            <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Expected Visitors Tab */}
          <TabsContent value="expected">
            <Card>
              <CardHeader>
                <CardTitle>Expected Visitors</CardTitle>
                <CardDescription>Visitors who are scheduled to arrive</CardDescription>
              </CardHeader>
              <CardContent>
                {expectedVisitors.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">No expected visitors at the moment.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Expected Arrival</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expectedVisitors.map((visitor) => (
                          <TableRow key={visitor.id}>
                            <TableCell className="font-medium">{visitor.name}</TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
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
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Arrived At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVisitors.map((visitor) => (
                          <TableRow key={visitor.id}>
                            <TableCell className="font-medium">{visitor.name}</TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
                            <TableCell>{formatDate(visitor.arrivedAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Past Visitors Tab */}
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Visitors</CardTitle>
                <CardDescription>Visitors who have left or were denied entry</CardDescription>
              </CardHeader>
              <CardContent>
                {pastVisitors.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">No past visitors to display.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Visit Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastVisitors.map((visitor) => (
                          <TableRow key={visitor.id}>
                            <TableCell className="font-medium">{visitor.name}</TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
                            <TableCell>{formatDate(visitor.expectedArrival)}</TableCell>
                            <TableCell>{getStatusBadge(visitor.status)}</TableCell>
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
    </PageContainer>
  );
};

export default ResidentDashboard;
