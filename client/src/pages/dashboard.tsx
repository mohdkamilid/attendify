import { Layout } from "@/components/layout";
import { useMockData, Status } from "@/lib/mock-data";
import { format, isSameDay } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import heroAbstract from "@/assets/hero-abstract.png";

export default function Dashboard() {
  const { employees, records, currentDate, setDate, getStatsForDate, markAttendance } = useMockData();
  const stats = getStatsForDate(currentDate);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'present': return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
      case 'absent': return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
      case 'late': return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      case 'leave': return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground shadow-2xl">
        <div className="absolute inset-0 opacity-20">
           <img src={heroAbstract} alt="" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        <div className="relative p-8 md:p-12 z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Good Morning, Admin
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Here's the attendance overview for {format(currentDate, 'MMMM do, yyyy')}.
            You have {stats.present} team members present today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Active team members</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground mt-1">Checked in today</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrival</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-yellow-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground mt-1">Arrived after 9:30 AM</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Absent / Leave</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-red-600">{stats.absent + stats.leave}</div>
            <p className="text-xs text-muted-foreground mt-1">Not in office</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Attendance List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-semibold">Attendance Log</h3>
            <div className="flex gap-2">
               <Button variant="outline" size="sm">Download Report</Button>
            </div>
          </div>

          <Card className="overflow-hidden border-none shadow-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => {
                  const record = records.find(r => r.employeeId === employee.id && isSameDay(r.date, currentDate));
                  const status = record?.status || 'absent'; // Default to absent if no record for simple logic

                  return (
                    <TableRow key={employee.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{employee.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{employee.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{employee.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{employee.role}</TableCell>
                      <TableCell className="font-mono text-sm">{record?.checkIn || '--:--'}</TableCell>
                      <TableCell className="font-mono text-sm">{record?.checkOut || '--:--'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select 
                          value={status} 
                          onValueChange={(val) => markAttendance(employee.id, val as Status)}
                        >
                          <SelectTrigger className="w-[110px] h-8 text-xs ml-auto">
                            <SelectValue placeholder="Mark" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Sidebar Calendar */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>View attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(d) => d && setDate(d)}
                className="rounded-md border bg-background shadow-sm"
              />
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Status
              </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
                  <span className="opacity-80">Engineering</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
                  <span className="opacity-80">Design</span>
                  <span className="font-bold">100%</span>
                </div>
                <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
                  <span className="opacity-80">Product</span>
                  <span className="font-bold">85%</span>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
