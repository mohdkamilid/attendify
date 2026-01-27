import { useState } from 'react';
import { addDays, format, subDays, isSameDay } from 'date-fns';

export type Status = 'present' | 'absent' | 'late' | 'leave';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  status: Status;
  checkIn?: string;
  checkOut?: string;
}

const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alex Morgan', role: 'Frontend Dev', department: 'Engineering', avatar: 'AM' },
  { id: '2', name: 'Sarah Chen', role: 'Product Designer', department: 'Design', avatar: 'SC' },
  { id: '3', name: 'James Wilson', role: 'Product Manager', department: 'Product', avatar: 'JW' },
  { id: '4', name: 'Maria Garcia', role: 'Backend Dev', department: 'Engineering', avatar: 'MG' },
  { id: '5', name: 'David Kim', role: 'QA Engineer', department: 'Engineering', avatar: 'DK' },
];

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, i);
    
    // Skip weekends roughly (just for mock)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    EMPLOYEES.forEach(emp => {
      const rand = Math.random();
      let status: Status = 'present';
      let checkIn: string | undefined = '09:00';
      let checkOut: string | undefined = '17:00';

      if (rand > 0.9) {
        status = 'absent';
        checkIn = undefined;
        checkOut = undefined;
      } else if (rand > 0.8) {
        status = 'leave';
        checkIn = undefined;
        checkOut = undefined;
      } else if (rand > 0.7) {
        status = 'late';
        checkIn = '09:45';
      }

      records.push({
        id: `${emp.id}-${format(date, 'yyyy-MM-dd')}`,
        employeeId: emp.id,
        date,
        status,
        checkIn,
        checkOut
      });
    });
  }
  return records;
};

// Simple in-memory store
let MOCK_RECORDS = generateMockAttendance();

export const useMockData = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_RECORDS);
  const [date, setDate] = useState<Date>(new Date());

  const getStatsForDate = (targetDate: Date) => {
    const dailyRecords = records.filter(r => isSameDay(r.date, targetDate));
    return {
      total: EMPLOYEES.length,
      present: dailyRecords.filter(r => r.status === 'present').length,
      absent: dailyRecords.filter(r => r.status === 'absent').length,
      late: dailyRecords.filter(r => r.status === 'late').length,
      leave: dailyRecords.filter(r => r.status === 'leave').length,
    };
  };

  const markAttendance = (employeeId: string, status: Status) => {
    const newRecord: AttendanceRecord = {
      id: `${employeeId}-${format(date, 'yyyy-MM-dd')}-${Math.random()}`,
      employeeId,
      date: date,
      status,
      checkIn: status === 'present' || status === 'late' ? format(new Date(), 'HH:mm') : undefined
    };

    setRecords(prev => {
      // Remove existing record for this day if exists
      const filtered = prev.filter(r => !(r.employeeId === employeeId && isSameDay(r.date, date)));
      const updated = [...filtered, newRecord];
      MOCK_RECORDS = updated; // Update static for persistence across re-renders
      return updated;
    });
  };

  return {
    employees: EMPLOYEES,
    records,
    currentDate: date,
    setDate,
    getStatsForDate,
    markAttendance
  };
};
