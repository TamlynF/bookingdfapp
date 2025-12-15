"use client";

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatTimeRange, formatCurrency, formatDate } from "@/app/_utils/helper-functions";
import { Input, Typography } from "../MaterialProvider"; 

// --- Helper Component for Booking Rows ---
function BookingRow({ booking }) {

    let tableInfo = '';
    let tableStatusClass = '';
    if (Array.isArray(booking.booking_table_mappings) && booking.booking_table_mappings.length === 0) {
        tableInfo = 'Unassigned';
         tableStatusClass = 'text-red-400';
    } else {
        const tableData = booking.booking_table_mappings[0].tables;
      
      if (tableData) {
          tableInfo = `${tableData.name} (Max ${tableData.max_capacity})`;
          tableStatusClass = 'text-green-400';
      } else {
          tableInfo = 'Table Data Missing';
           tableStatusClass = 'text-red-400';
      }
    }
    
  
  // Set status classes for visual distinction
  const groupStatusClass = booking.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400';


  return (
    <tr className="bg-lime-900/40 text-xs hover:bg-lime-900/60 transition-colors">
      <td className="px-3 py-2 text-yellow-50">{booking.group_name}</td>
      <td className="px-3 py-2 text-yellow-50">{booking.group_size}</td>
      <td className="px-3 py-2 text-yellow-50">{booking.contacts?.full_name || 'N/A'}</td>
      <td className={`px-3 py-2 font-semibold ${groupStatusClass} capitalize`}>{booking.status}</td>
      <td className={`px-3 py-2 ${tableStatusClass}`}>{tableInfo}</td>
      <td className="px-3 py-2 text-right">
        <button className="text-yellow-400 hover:text-yellow-300 transition-colors mr-2">Edit</button>
      </td>
    </tr>
  );
}

// --- Event Row Component ---
function EventRow({ event, isExpanded, onToggleExpand }) {
  const Icon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
  
  const totalGuests = event.bookings ? event.bookings.reduce((sum, booking) => sum + booking.group_size, 0) : 0;
  
  const SeatingIndicator = () => (
    <div className={`inline-flex items-center justify-center w-5 h-5 rounded border ${event.seating_required ? "bg-green-500 border-green-900" : "border-red-500 bg-transparent"}`}>
      {event.seating_required && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-yellow-950">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );

  return (
    <>
      {/* Main Event Row */}
      <tr className="bg-lime-950/70 hover:bg-lime-900/50 transition-colors cursor-pointer" onClick={() => onToggleExpand(event.id)}>
        <td className="px-3 py-3 whitespace-nowrap text-yellow-50 font-semibold">{formatDate(event.date)}</td>
        <td className="px-3 py-3 whitespace-nowrap text-yellow-50 capitalize">{event.event_types?.sub_type}</td>
        <td className="px-3 py-3 max-w-40 truncate text-yellow-50" title={event.title}>{event.title}</td>
        <td className="px-3 py-3 max-w-80 truncate text-yellow-50" title={event.description}>{event.description}</td>
        <td className="px-3 py-3 whitespace-nowrap text-yellow-50">{formatTimeRange(event.date, event.start_time, event.end_time)}</td>
        <td className="px-3 py-3 whitespace-nowrap text-yellow-50 text-right">{formatCurrency(event.payment_amount)}</td>
        <td className="px-3 py-3 whitespace-nowrap text-center">
           <div className={`inline-flex items-center justify-center w-5 h-5 rounded border ${event.seating_required ? "bg-green-500 border-green-900" : "border-red-500 bg-transparent"}`}>
      {event.seating_required && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-yellow-950">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
        </td>
        <td className="px-3 py-3 whitespace-nowrap text-yellow-50">{event.employees?.full_name || 'N/A'}</td>
        <td className="px-3 py-3 whitespace-nowrap text-yellow-50 text-center font-bold">{totalGuests}</td>
        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-yellow-400 hover:text-yellow-300 transition-colors mr-4">Edit</button>
          <button className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
          <button onClick={(e) => { e.stopPropagation(); onToggleExpand(event.id); }} className="ml-4 p-1 rounded-full hover:bg-lime-800 transition-colors">
            <Icon className="h-4 w-4" />
          </button>
        </td>
      </tr>
      
      {/* Expanded Bookings Row */}
      {isExpanded && event.bookings && (
        <tr>
          <td colSpan="10" className="p-0 border-t border-yellow-900">
            <div className="bg-lime-900/50 p-4">
              <h4 className="text-lg font-bold text-yellow-100 mb-3">
                Bookings for {event.title} ({formatDate(event.date)})
              </h4>
              {event.bookings.length === 0 ? (
                <p className="text-yellow-300">No bookings yet for this event.</p>
              ) : (
                <div className="border border-lime-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-lime-900 text-yellow-100 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-3 py-2">Group Name</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Contact Name</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Table Assigned</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lime-800">
                    {event.bookings.map(booking => (
                      <BookingRow key={booking.id} booking={booking} />
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// --- Main Component ---
export default function EventsTable({ eventsData }) {
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const onToggleExpand = (id) => {
    setExpandedEventId(prevId => prevId === id ? null : id);
  };

  const filteredEvents = eventsData.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_types?.sub_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.employees?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const TABLE_HEAD = ["Date", "Category", "Title", "Description", "Times", "Payment", "Seating", "Host", "Total Guests", "Actions"];

  return (
    <div className="space-y-6">
      {/* Search Bar and Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl text-lime-950 dark:text-accent-400">Events</h1>
        <div className="flex items-center gap-4">
            <div className="w-80">
                <Input
                    label="Search Events"
                    icon={<MagnifyingGlassIcon className="h-5 w-5 text-yellow-500" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-yellow-100"
                    color="green"
                />
            </div>
            <button className="bg-amber-900 text-yellow-100 px-4 py-2 rounded shadow-sm hover:bg-amber-600 transition-colors font-medium">
                Add Event
            </button>
        </div>
      </div>

      <div className="text-lg text-yellow-600 dark:text-yellow-200">
        {filteredEvents.length} events matching your criteria.
      </div>

      {/* Events Table */}
      <div className="border border-yellow-950 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left text-sm">
            <thead className="bg-lime-950 text-yellow-100 uppercase tracking-wider font-semibold">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="px-3 py-2">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lime-900 bg-lime-950/35 text-yellow-50">
              {filteredEvents.map((event) => (
                <EventRow 
                    key={event.id} 
                    event={event} 
                    isExpanded={expandedEventId === event.id}
                    onToggleExpand={onToggleExpand}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}