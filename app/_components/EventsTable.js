"use client";

import { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { formatTimeRange, formatCurrency, formatDate } from "@/app/_utils/helper-functions";
import { Input, Chip, Tooltip, IconButton } from "../MaterialProvider"; 

function CrownIcon({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}

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
    
    // Determine winner status from scores
  const isWinner = booking.booking_scores && booking.booking_scores.some(score => score.is_winner);

  // Status Badge Colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'green';
      case 'waitlisted': return 'amber';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
    };
      const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-600';
      case 'waitlisted': return 'bg-orange-600';
        case 'cancelled': return 'bg-red-600';
        case 'pending': return 'bg-yellow-600'
      default: return 'bg-gray-600';
    }
  };

  // Set status classes for visual distinction
    const groupStatusClass = booking.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400';
    const statusClass = getStatusClass(booking.status);


  return (
    <tr className={`border-b border-lime-900/40 text-sm hover:bg-lime-900/20 transition-colors ${isWinner ? 'bg-yellow-600/50' : 'bg-lime-200/30'}`}>
      <td className="px-4 py-3 text-yellow-50 font-medium flex items-center gap-2">
        {booking.group_name}
        {isWinner && (
          <Tooltip content="Winner!">
            <span className="cursor-help">
              <CrownIcon className="h-5 w-5 text-yellow-400 animate-pulse" />
            </span>
          </Tooltip>
        )}
      </td>
      <td className="px-4 py-3 text-yellow-100/80">
        <div className="flex items-center gap-1">
          <UserGroupIcon className="h-4 w-4" />
          {booking.group_size}
        </div>
      </td>
      <td className="px-4 py-3 text-yellow-100/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-lime-800 flex items-center justify-center text-sm font-bold text-yellow-200">
            {booking.contacts?.full_name?.charAt(0) || '?'}
          </div>
          {booking.contacts?.full_name || 'N/A'}
        </div>
      </td>
      <td className="px-4 py-3">
        <Chip 
          size="sm" 
          variant="ghost" 
          value={booking.status} 
          color={getStatusColor(booking.status)}
          className={`capitalize font-medium rounded-full px-0 text-yellow-50 text-center ${statusClass}`}
        />
      </td>
      <td className="px-4 py-3 text-yellow-100/80 text-sm">
        {tableInfo}
      </td>
      <td className="px-4 py-3 text-right">
        <button className="text-sm font-medium text-lime-400 hover:text-lime-300 underline decoration-lime-400/30 underline-offset-2 transition-colors">
          Manage
        </button>
      </td>
    </tr>
  );
}

// --- Event Row Component ---
function EventRow({ event, isExpanded, onToggleExpand }) {
  const Icon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
  
  const totalGuests = event.bookings ? event.bookings.reduce((sum, booking) => sum + booking.group_size, 0) : 0;
  
  const SeatingIndicator = () => (
    <Tooltip content={event.seating_required ? "Seating Required" : "No Seating Required"}>
      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full border ${event.seating_required ? "bg-green-500/20 border-green-500/50 text-green-400" : "bg-red-500/20 border-red-500/50 text-red-400"}`}>
        {event.seating_required ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </div>
    </Tooltip>
  );

  return (
    <>
      {/* Main Event Row */}
      <tr 
        className={`border-b border-lime-900/30 transition-all cursor-pointer group ${isExpanded ? 'bg-lime-900/60' : 'bg-lime-900/30 hover:bg-orange-900/20'}`} 
        onClick={() => onToggleExpand(event.id)}
      >
        <td className="px-4 py-4 whitespace-nowrap text-yellow-50 font-semibold border-l-4 border-transparent group-hover:border-lime-500 transition-all pl-3">
          <div className="flex flex-col">
            <span className="text-sm">{formatDate(event.date)}</span>
            <span className="text-xs text-yellow-100/70 font-normal flex items-center gap-1 mt-0.5">
              <ClockIcon className="w-3 h-3" />
              {formatTimeRange(event.date, event.start_time, event.end_time)}
            </span>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-lime-500/50 text-lime-100 border border-lime-400/20 capitalize">
            {event.event_types?.sub_type}
          </span>
        </td>
        <td className="px-4 py-4 max-w-xs">
          <div className="text-sm font-medium text-yellow-50 truncate" title={event.title}>{event.title}</div>
          <div className="text-xs text-yellow-100/70 truncate mt-0.5" title={event.description}>{event.description}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-yellow-50 text-right font-mono text-sm">
          {event.payment_amount > 0 ? (
            <span className="text-yellow-400">{formatCurrency(event.payment_amount)}</span>
          ) : (
            <span className="text-yellow-200">Free</span>
          )}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-center">
           <Tooltip content={event.seating_required ? "Seating Required" : "No Seating Required"}>
      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full border ${event.seating_required ? "bg-green-500/20 border-green-500/50 text-green-100" : "bg-red-500/20 border-red-500/50 text-red-100"}`}>
        {event.seating_required ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </div>
    </Tooltip>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2 text-sm text-yellow-100">
            <UserIcon className="w-4 h-4 text-lime-100" />
            {event.employees?.full_name || <span className="text-yellow-100/30 italic">Unassigned</span>}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-700/30 text-yellow-200 text-sm font-bold">
            <UserGroupIcon className="w-3.5 h-3.5" />
            {totalGuests}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); }} 
              className="text-sm font-medium bg-yellow-400/20 text-yellow-100/90 hover:text-yellow-400 hover:bg-yellow-400/10 px-3 py-1.5 rounded transition-colors"
            >
              Edit
            </button>
            <IconButton 
              variant="text" 
              color="white" 
              size="sm"
              className="rounded-full hover:bg-lime-800/50 text-green-900"
            >
              <Icon className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </IconButton>
          </div>
        </td>
      </tr>
      
      {/* Expanded Bookings Row */}
      {isExpanded && (
        <tr>
          <td colSpan="8" className="p-0 border-b border-lime-900/30 bg-black/10 shadow-inner">
            <div className="p-3 pl-5 animate-in slide-in-from-top-2 duration-200">
              {/* <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-lime-100 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-500"></span>
                  Bookings for {event.title}
                </h4>
                <div className="text-sm text-yellow-100/90">
                  {event.bookings?.length || 0} Total Bookings
                </div>
              </div> */}
              
              {!event.bookings || event.bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-yellow-100/30 border-2 border-dashed border-lime-900/30 rounded-xl">
                  <UserGroupIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">No bookings found for this event.</p>
                </div>
              ) : (
                <div className="border border-lime-900/50 rounded-xl overflow-hidden shadow-lg bg-lime-950/30 backdrop-blur-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-lime-900/80 text-yellow-100/70 uppercase text-xs tracking-wider font-semibold border-b border-lime-800">
                      <tr>
                        <th className="px-4 py-3">Group Name</th>
                        <th className="px-4 py-3">Size</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Table</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lime-900/60">
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
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.employees?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const TABLE_HEAD = ["Date / Time", "Category", "Event Details", "Payment", "Seating", "Host", "Guests", ""];

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      {/* Header Section with Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-lime-950/40 p-5 rounded-2xl border border-lime-900/30 backdrop-blur-sm">
        <div>
          <h1 className="font-bold text-2xl text-yellow-50">Events Overview</h1>
          <p className="text-yellow-100/50 text-sm mt-1">Manage events, track bookings, and assign tables.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto border border-red-500">
            <div className="w-full md:w-72 border border-blue-500">
                <Input
                    label="Search Events"
                    icon={<MagnifyingGlassIcon className="h-5 w-5 text-black" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-yellow-50 border-lime-900! focus:border-lime-500! placeholder:text-yellow-100/30"
                    labelProps={{
                      className: "text-yellow-100/50 peer-placeholder-shown:text-yellow-100/50 peer-focus:text-lime-400"
                    }}
                    color="lime"
                />
            </div>
            <button className="bg-linear-to-r from-lime-600 to-lime-500 text-lime-950 px-5 py-2.5 rounded-lg shadow-lg shadow-lime-900/20 hover:shadow-lime-500/20 hover:from-lime-500 hover:to-lime-400 transition-all font-bold text-sm whitespace-nowrap active:scale-95">
                + New Event
            </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm font-medium text-yellow-900/60">
          Showing <span className="text-black font-bold">{filteredEvents.length}</span> events
        </div>
        
        {/* Optional: Add Filter Chips here later */}
      </div>

      {/* Events Table Container */}
      <div className="border border-lime-900/50 rounded-2xl overflow-hidden shadow-2xl bg-lime-950/30 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left text-sm">
            <thead className="bg-lime-950 text-yellow-100/80 uppercase text-xs tracking-wider font-bold border-b border-lime-900">
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th key={index} className={`px-4 py-4 ${index === TABLE_HEAD.length - 1 ? 'text-right' : ''} ${index === 4 || index === 6 ? 'text-center' : ''} ${index === 3 ? 'text-right' : ''}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lime-900/20">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventRow 
                      key={event.id} 
                      event={event} 
                      isExpanded={expandedEventId === event.id}
                      onToggleExpand={onToggleExpand}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-yellow-100/40 italic">
                    No events found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}