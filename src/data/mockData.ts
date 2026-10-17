import { Guest, VenueZone, WeddingConfig, ActivityLogItem } from '../types/wedding';

export const INITIAL_WEDDING_CONFIG: WeddingConfig = {
  coupleNames: 'Blessing Matiza & Ruvarashe Chakawora',
  partner1: 'Blessing Matiza',
  partner1Title: 'First born of Mr & Mrs Matiza',
  partner2: 'Ruvarashe Chakawora',
  partner2Title: 'Third born of Mr & Mrs Chakawora',
  hostingWording: 'Joyfully invite you to celebrate our union in marriage on 22 December 2026',
  weddingDate: '2026-12-22T00:00:00Z',
  rsvpDeadline: '2026-12-07T23:59:59Z', // First week of December
  venueName: 'Swan Creek Gardens',
  venueAddress: '899 Gletwyn Road, Shawasha Hills, Harare',
  venueCapacity: 300,
  gatePin: '4389',
  adminPin: '9172',
  attire: 'Black and Champagne',
  specialInstructions: 'Adults only, strictly no kids',
  contactEmail: 'rsvp@blessingandruvarashe.com',
  contactPhone: '+263 77 245 8891',
  backgroundImageUrl: '/assets/images/couple_portrait.jpg',
  backgroundOpacity: 0.22,
};

// Initial guests list starts completely fresh and empty
export const INITIAL_GUESTS: Guest[] = [];

export const INITIAL_VENUE_ZONES: VenueZone[] = [
  {
    id: 'zone-1',
    name: 'The Willow Creek Lawn',
    type: 'ceremony',
    time: '13:30 — 15:00',
    description: 'Picturesque manicured ceremony lawns framed by weeping willows and serene waters. Unplugged holy matrimony.',
    capacity: 300,
    dressCodeTip: 'Black and Champagne. Block heels recommended for lawn garden paths.',
    xCoord: 55,
    yCoord: 62,
  },
  {
    id: 'zone-2',
    name: 'Swan Creek Terraces & Cocktail Lawn',
    type: 'cocktails',
    time: '15:00 — 16:30',
    description: 'Celebratory champagne toasts, artisanal hors d’oeuvres, live saxophone, and bridal party photographs across the stone bridge.',
    capacity: 300,
    dressCodeTip: 'Outdoor garden cocktail reception',
    xCoord: 35,
    yCoord: 66,
  },
  {
    id: 'zone-3',
    name: 'The Grand Marquee Pavilion',
    type: 'reception',
    time: '16:30 — 22:30',
    description: 'Lavish white marquee banquet with crystal chandeliers, multi-course dinner feast, heartfelt speeches, cake cutting, and evening dancing.',
    capacity: 300,
    dressCodeTip: 'Formal ballroom reception',
    xCoord: 76,
    yCoord: 44,
  },
  {
    id: 'zone-4',
    name: 'Gletwyn Road Security Gate & Valet',
    type: 'parking',
    time: 'Arrival from 12:45',
    description: 'Dedicated security entrance, complimentary valet parking, and single-use QR ticket check-in station.',
    capacity: 120,
    dressCodeTip: 'Security Gate Check-in Point',
    xCoord: 90,
    yCoord: 54,
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [];
