const stop = (name, area, km, date, time, done = false) => ({ name, area, km, date, time, done });

export const PROFILE = {
  firstName: 'Rahul',
  lastName: 'Patil',
  address: 'Flat 12, Shivaji Nagar, Pune',
  pincode: '411005',
  vehicle: 'Tata Prima 4028.S',
};

export const LIVE_TRIP = {
  id: 'TR-1042',
  status: 'In transit',
  source: 'Pune Warehouse',
  destination: 'Mumbai Depot',
  startedAt: '19/11/2026 · 10:13 AM',
  progress: 0.62,
  distanceKm: 149,
  stops: [
    stop('Pune Warehouse', 'Hadapsar, Pune', 0, '19 Nov', '10:13 AM', true),
    stop('Lonavala Hub', 'Lonavala', 64, '19 Nov', '11:35 AM', true),
    stop('Panvel Store', 'Panvel, Navi Mumbai', 52, '19 Nov', '01:10 PM'),
    stop('Mumbai Depot', 'Andheri East, Mumbai', 33, '19 Nov', '02:30 PM'),
  ],
};

export const UPCOMING_TRIPS = [
  {
    id: 'TR-1043', status: 'Scheduled', from: 'Pune', to: 'Nashik',
    date: '20 Nov · 09:00 AM', distanceKm: 210,
    stops: [
      stop('Pune Warehouse', 'Hadapsar, Pune', 0, '20 Nov', '09:00 AM'),
      stop('Ahmednagar Hub', 'MIDC, Ahmednagar', 120, '20 Nov', '11:45 AM'),
      stop('Nashik Store', 'Nashik Road', 90, '20 Nov', '02:00 PM'),
    ],
  },
  {
    id: 'TR-1044', status: 'Scheduled', from: 'Pune', to: 'Nagpur',
    date: '21 Nov · 06:30 AM', distanceKm: 700,
    stops: [
      stop('Pune Warehouse', 'Hadapsar, Pune', 0, '21 Nov', '06:30 AM'),
      stop('Aurangabad Depot', 'Waluj, Aurangabad', 235, '21 Nov', '11:30 AM'),
      stop('Akola Hub', 'MIDC, Akola', 250, '21 Nov', '05:15 PM'),
      stop('Nagpur Yard', 'Hingna, Nagpur', 215, '21 Nov', '10:00 PM'),
    ],
  },
  {
    id: 'TR-1045', status: 'Scheduled', from: 'Satara', to: 'Mumbai',
    date: '22 Nov · 11:00 AM', distanceKm: 260,
    stops: [
      stop('Satara Store', 'Satara City', 0, '22 Nov', '11:00 AM'),
      stop('Pune Warehouse', 'Hadapsar, Pune', 110, '22 Nov', '02:00 PM'),
      stop('Mumbai Depot', 'Andheri East, Mumbai', 150, '22 Nov', '06:30 PM'),
    ],
  },
];

export const HISTORY_TRIPS = [
  {
    id: 'TR-1038', status: 'Completed', from: 'Pune', to: 'Mumbai',
    date: '18 Nov · 08:00 AM', distanceKm: 149, duration: '4h 20m',
    stops: [
      stop('Pune Warehouse', 'Hadapsar, Pune', 0, '18 Nov', '08:00 AM', true),
      stop('Mumbai Depot', 'Andheri East, Mumbai', 149, '18 Nov', '12:20 PM', true),
    ],
  },
  {
    id: 'TR-1031', status: 'Completed', from: 'Nashik', to: 'Pune',
    date: '16 Nov · 07:30 AM', distanceKm: 210, duration: '5h 10m',
    stops: [
      stop('Nashik Store', 'Nashik Road', 0, '16 Nov', '07:30 AM', true),
      stop('Ahmednagar Hub', 'MIDC, Ahmednagar', 90, '16 Nov', '10:00 AM', true),
      stop('Pune Warehouse', 'Hadapsar, Pune', 120, '16 Nov', '12:40 PM', true),
    ],
  },
  {
    id: 'TR-1027', status: 'Cancelled', from: 'Pune', to: 'Satara',
    date: '15 Nov · 09:00 AM', distanceKm: 110, duration: '—',
    stops: [
      stop('Pune Warehouse', 'Hadapsar, Pune', 0, '15 Nov', '09:00 AM'),
      stop('Satara Store', 'Satara City', 110, '15 Nov', '12:00 PM'),
    ],
  },
  {
    id: 'TR-1022', status: 'Completed', from: 'Mumbai', to: 'Pune',
    date: '13 Nov · 03:00 PM', distanceKm: 149, duration: '4h 05m',
    stops: [
      stop('Mumbai Depot', 'Andheri East, Mumbai', 0, '13 Nov', '03:00 PM', true),
      stop('Pune Warehouse', 'Hadapsar, Pune', 149, '13 Nov', '07:05 PM', true),
    ],
  },
  {
    id: 'TR-1015', status: 'Completed', from: 'Pune', to: 'Kolhapur',
    date: '11 Nov · 06:00 AM', distanceKm: 230, duration: '5h 40m',
    stops: [
      stop('Pune Warehouse', 'Hadapsar, Pune', 0, '11 Nov', '06:00 AM', true),
      stop('Satara Store', 'Satara City', 110, '11 Nov', '08:30 AM', true),
      stop('Kolhapur Hub', 'Shiroli MIDC, Kolhapur', 120, '11 Nov', '11:40 AM', true),
    ],
  },
];

export const NOTIFICATIONS = [
  { id: 1, type: 'trip', title: 'New trip assigned', body: 'Pune → Nashik on 20 Nov, 09:00 AM.', time: '10 min ago', read: false },
  { id: 2, type: 'alert', title: 'Route update', body: 'Heavy traffic near Lonavala. Expect a 25 min delay.', time: '1 hr ago', read: false },
  { id: 3, type: 'info', title: 'Document verified', body: 'Your driving license has been verified.', time: 'Yesterday', read: true },
  { id: 4, type: 'trip', title: 'Trip completed', body: 'TR-1038 Pune → Mumbai marked as completed.', time: '18 Nov', read: true },
  { id: 5, type: 'info', title: 'Vehicle service due', body: 'Next service due in 500 km.', time: '16 Nov', read: true },
];