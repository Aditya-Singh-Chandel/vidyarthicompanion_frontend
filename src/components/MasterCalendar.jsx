'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import DailyTimeline from './DailyTimeline';

// Mock Data indexed by date string (YYYY-MM-DD)
const MOCK_EVENTS = {
  '2026-06-14': [
    { id: '1', title: 'Data Structures & Algorithms', time: '10:00 AM - 11:30 AM', location: 'Lecture Hall 4', type: 'academic' },
    { id: '2', title: 'Lunch at Main Mess', time: '12:30 PM - 1:15 PM', location: 'Campus Mess Block B', type: 'wellness', isFlagged: true },
    { id: '3', title: 'Hackathon Sync', time: '3:00 PM - 4:00 PM', location: 'Library Group Room 2', type: 'community' },
  ],
  '2026-06-15': [
    { id: '4', title: 'OS Class Reschedule', time: '3:00 PM - 4:30 PM', location: 'TBD', type: 'academic' },
    { id: '5', title: 'Evening Walk (Burnout Alert)', time: '6:00 PM - 6:30 PM', location: 'Campus Track', type: 'wellness' },
  ],
  '2026-06-18': [
    { id: '6', title: 'DBMS Midterm', time: '9:00 AM - 12:00 PM', location: 'Exam Hall A', type: 'academic' },
  ]
};

export default function MasterCalendar() {
  // Defaulting to June 2026 for the Hackathon context
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 14)); 
  const [selectedDate, setSelectedDate] = useState('2026-06-14');

  // Helper to get days in a month for the grid
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startingDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Generate grid cells
  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null); // Empty slots before the 1st
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateClick = (day) => {
    if (!day) return;
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  const selectedEvents = MOCK_EVENTS[selectedDate] || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Left Pane: The Monthly Grid */}
      <div className="w-full md:w-1/2 lg:w-2/5 border-b md:border-b-0 md:border-r border-gray-100 p-6 bg-gray-50/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const formattedDate = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const hasEvents = formattedDate && MOCK_EVENTS[formattedDate];
            const isSelected = formattedDate === selectedDate;

            return (
              <div key={index} className="aspect-square p-0.5">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all relative ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 bg-white border border-gray-100 shadow-sm'
                    }`}
                  >
                    {day}
                    {/* Event Dots Indicator */}
                    {hasEvents && (
                      <div className="absolute bottom-1.5 flex gap-0.5">
                        <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`}></span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: The Daily Timeline */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Schedule for
          </h3>
          <p className="text-2xl font-black tracking-tight text-gray-900 mt-1">
            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {selectedEvents.length > 0 ? (
          <DailyTimeline schedule={selectedEvents} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No scheduled events</p>
            <p className="text-xs text-gray-500 mt-1">Enjoy your free time or add a new task.</p>
          </div>
        )}
      </div>
    </div>
  );
}