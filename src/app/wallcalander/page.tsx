// Backend integration point: replace localStorage calls with API endpoints
// for user-specific note/range persistence if auth is added later.

import WallCalendarClient from './components/WallCalendarClient';

export default function WallCalendarPage() {
  return <WallCalendarClient />;
}