/**
 * SoundWave Festival - Music Festival Management System
 * Mock Data for UI demonstration
 */

// Mock Artists Data
const artists = [
  {
    id: 1,
    name: "Electric Pulse",
    genre: "Electronic",
    image: "assets/images/artists/artist1.jpg",
    bio: "Electric Pulse is a groundbreaking electronic music duo known for their energetic performances and innovative sound design. With over a decade of experience, they've headlined major festivals worldwide.",
    socialMedia: {
      instagram: "electricpulse",
      twitter: "electricpulse",
      spotify: "electricpulse",
    },
    popular: true,
  },
  {
    id: 2,
    name: "Luna Shadows",
    genre: "Indie Pop",
    image: "assets/images/artists/artist2.jpg",
    bio: "Luna Shadows brings dreamy vocals and atmospheric soundscapes to create a unique indie pop experience. Her music has been featured in several films and TV shows.",
    socialMedia: {
      instagram: "lunashadows",
      twitter: "lunashadows",
      spotify: "lunashadows",
    },
    popular: true,
  },
  {
    id: 3,
    name: "Rhythm Collective",
    genre: "Jazz Fusion",
    image: "assets/images/artists/artist3.jpg",
    bio: "Rhythm Collective combines traditional jazz with modern fusion elements, creating an innovative sound that has earned them critical acclaim and a dedicated following.",
    socialMedia: {
      instagram: "rhythmcollective",
      twitter: "rhythmcollective",
      spotify: "rhythmcollective",
    },
    popular: true,
  },
  {
    id: 4,
    name: "Neon Nights",
    genre: "Synthwave",
    image: "assets/images/artists/artist4.jpg",
    bio: "Neon Nights takes listeners on a nostalgic journey through 80s-inspired synthwave with modern production techniques, creating an unforgettable retro futuristic experience.",
    socialMedia: {
      instagram: "neonnights",
      twitter: "neonnights",
      spotify: "neonnights",
    },
    popular: false,
  },
  {
    id: 5,
    name: "Echoing Mountains",
    genre: "Folk",
    image: "assets/images/artists/artist5.jpg",
    bio: "Echoing Mountains brings soulful folk music with harmonious vocals and acoustic instrumentation that tells stories of nature, life, and emotional journeys.",
    socialMedia: {
      instagram: "echomountains",
      twitter: "echomountains",
      spotify: "echomountains",
    },
    popular: false,
  },
  {
    id: 6,
    name: "Bass Droppers",
    genre: "Dubstep",
    image: "assets/images/artists/artist6.jpg",
    bio: "Bass Droppers are known for their earth-shaking bass lines and energetic dubstep tracks that have become staples in the electronic music scene.",
    socialMedia: {
      instagram: "bassdroppers",
      twitter: "bassdroppers",
      spotify: "bassdroppers",
    },
    popular: true,
  },
  {
    id: 7,
    name: "Skyward Melody",
    genre: "Ambient",
    image: "assets/images/artists/artist7.jpg",
    bio: "Skyward Melody creates atmospheric ambient soundscapes that transport listeners to ethereal realms, perfect for meditation and deep listening experiences.",
    socialMedia: {
      instagram: "skywardmelody",
      twitter: "skywardmelody",
      spotify: "skywardmelody",
    },
    popular: false,
  },
  {
    id: 8,
    name: "Urban Beat Makers",
    genre: "Hip Hop",
    image: "assets/images/artists/artist8.jpg",
    bio: "Urban Beat Makers combine classic hip hop elements with fresh production techniques to create a sound that honors the genre's roots while pushing its boundaries.",
    socialMedia: {
      instagram: "urbanbeats",
      twitter: "urbanbeats",
      spotify: "urbanbeats",
    },
    popular: true,
  },
];

// Mock Stages Data
const stages = [
  {
    id: 1,
    name: "Main Stage",
    location: "Central Park",
    capacity: 10000,
    image: "assets/images/stages/stage1.jpg",
    description:
      "Our flagship stage featuring the biggest headliners with state-of-the-art sound and lighting systems.",
    facilities: [
      "VIP viewing area",
      "Accessible viewing platform",
      "High-resolution LED screens",
    ],
  },
  {
    id: 2,
    name: "Electronic Dome",
    location: "North Field",
    capacity: 5000,
    image: "assets/images/stages/stage2.jpg",
    description:
      "A dedicated space for electronic music with immersive visual projections and surround sound.",
    facilities: [
      "360-degree projection mapping",
      "Fog machines",
      "Laser light show",
    ],
  },
  {
    id: 3,
    name: "Acoustic Grove",
    location: "Woodland Area",
    capacity: 2000,
    image: "assets/images/stages/stage3.jpg",
    description:
      "An intimate setting surrounded by nature, perfect for folk, acoustic, and indie performances.",
    facilities: [
      "Natural seating areas",
      "Fairy light canopy",
      "Eco-friendly power supply",
    ],
  },
  {
    id: 4,
    name: "Urban Corner",
    location: "East Side",
    capacity: 3000,
    image: "assets/images/stages/stage4.jpg",
    description:
      "A vibrant stage with urban aesthetics dedicated to hip hop, R&B, and soul music.",
    facilities: ["DJ booth", "Dance floor", "Graffiti art installation"],
  },
];

// Mock Schedule Data
const schedule = [
  // Day 1 - Friday
  {
    day: "Friday",
    date: "July 15, 2025",
    performances: [
      {
        id: 1,
        artistId: 1,
        stageId: 1,
        startTime: "20:00",
        endTime: "22:00",
        description: "Headlining performance",
      },
      {
        id: 2,
        artistId: 2,
        stageId: 1,
        startTime: "18:00",
        endTime: "19:30",
        description: "Main support",
      },
      {
        id: 3,
        artistId: 3,
        stageId: 2,
        startTime: "19:00",
        endTime: "20:30",
        description: "Electronic Dome headliner",
      },
      {
        id: 4,
        artistId: 5,
        stageId: 3,
        startTime: "17:00",
        endTime: "18:30",
        description: "Acoustic set",
      },
      {
        id: 5,
        artistId: 8,
        stageId: 4,
        startTime: "18:30",
        endTime: "20:00",
        description: "Urban Corner headliner",
      },
    ],
  },

  // Day 2 - Saturday
  {
    day: "Saturday",
    date: "July 16, 2025",
    performances: [
      {
        id: 6,
        artistId: 6,
        stageId: 1,
        startTime: "21:00",
        endTime: "23:00",
        description: "Headlining performance",
      },
      {
        id: 7,
        artistId: 4,
        stageId: 2,
        startTime: "19:30",
        endTime: "21:00",
        description: "Electronic Dome special",
      },
      {
        id: 8,
        artistId: 7,
        stageId: 3,
        startTime: "18:00",
        endTime: "19:30",
        description: "Sunset acoustic set",
      },
      {
        id: 9,
        artistId: 1,
        stageId: 2,
        startTime: "17:00",
        endTime: "18:30",
        description: "Electronic showcase",
      },
      {
        id: 10,
        artistId: 8,
        stageId: 4,
        startTime: "20:00",
        endTime: "21:30",
        description: "Urban beats session",
      },
    ],
  },

  // Day 3 - Sunday
  {
    day: "Sunday",
    date: "July 17, 2025",
    performances: [
      {
        id: 11,
        artistId: 3,
        stageId: 1,
        startTime: "20:00",
        endTime: "22:00",
        description: "Closing headliner",
      },
      {
        id: 12,
        artistId: 5,
        stageId: 3,
        startTime: "18:30",
        endTime: "20:00",
        description: "Farewell acoustic set",
      },
      {
        id: 13,
        artistId: 2,
        stageId: 1,
        startTime: "18:00",
        endTime: "19:30",
        description: "Main stage support",
      },
      {
        id: 14,
        artistId: 4,
        stageId: 2,
        startTime: "19:00",
        endTime: "20:30",
        description: "Electronic finale",
      },
      {
        id: 15,
        artistId: 7,
        stageId: 3,
        startTime: "17:00",
        endTime: "18:00",
        description: "Ambient meditation session",
      },
    ],
  },
];

// Mock Tickets Data
const tickets = [
  {
    id: 1,
    name: "3-Day Festival Pass",
    description: "Access to all festival days and stages",
    price: 299.99,
    available: 3000,
    sold: 2250,
    maxPerPurchase: 4,
    features: [
      "Full festival access (Friday-Sunday)",
      "Access to all stages",
      "Access to food and merchandise vendors",
      "Festival app access",
    ],
  },
  {
    id: 2,
    name: "VIP Festival Pass",
    description: "Premium experience with exclusive benefits",
    price: 499.99,
    available: 1000,
    sold: 430,
    maxPerPurchase: 2,
    features: [
      "Full festival access (Friday-Sunday)",
      "VIP viewing areas at each stage",
      "Exclusive VIP lounge access",
      "Complimentary food and drinks",
      "VIP parking",
      "Exclusive merchandise pack",
      "Artist meet & greet opportunities",
    ],
  },
  {
    id: 3,
    name: "Friday Day Pass",
    description: "Single day access for Friday",
    price: 129.99,
    available: 2000,
    sold: 1100,
    maxPerPurchase: 4,
    features: [
      "Friday access only (10:00 - 23:00)",
      "Access to all stages",
      "Access to food and merchandise vendors",
    ],
  },
  {
    id: 4,
    name: "Saturday Day Pass",
    description: "Single day access for Saturday",
    price: 149.99,
    available: 2000,
    sold: 1780,
    maxPerPurchase: 4,
    features: [
      "Saturday access only (10:00 - 23:00)",
      "Access to all stages",
      "Access to food and merchandise vendors",
    ],
  },
  {
    id: 5,
    name: "Sunday Day Pass",
    description: "Single day access for Sunday",
    price: 129.99,
    available: 2000,
    sold: 1500,
    maxPerPurchase: 4,
    features: [
      "Sunday access only (10:00 - 22:00)",
      "Access to all stages",
      "Access to food and merchandise vendors",
    ],
  },
  {
    id: 6,
    name: "Group Package (5+ people)",
    description: "Discounted tickets for groups of 5 or more",
    price: 249.99,
    available: 500,
    sold: 320,
    maxPerPurchase: 10,
    features: [
      "Full festival access (Friday-Sunday)",
      "Group check-in fast lane",
      "Designated group camping area",
      "Group photo opportunity",
    ],
  },
];

// Mock User Profile Data
const userProfile = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "Festival Organizer",
  image: "assets/images/ui/profile.jpg",
  joinDate: "2023-05-10",
  purchasedTickets: [
    {
      id: 1,
      ticketId: 2,
      quantity: 2,
      purchaseDate: "2025-02-15",
      ticketCode: "VIP-2025-AJ-1254",
    },
  ],
  favoriteArtists: [1, 3, 6],
  notifications: {
    email: true,
    app: true,
    schedule: true,
    announcements: true,
  },
  preferences: {
    genres: ["Electronic", "Jazz Fusion", "Indie Pop"],
    dietary: "Vegetarian",
    accessibility: "None",
  },
};

// Helper function to get today's schedule (for demo purposes using Friday)
function getTodaySchedule() {
  // In a real app, this would determine the actual current date
  // For demo purposes, we'll use the first day (Friday)
  return schedule[0];
}

// Helper function to get artist by ID
function getArtistById(id) {
  return artists.find((artist) => artist.id === id);
}

// Helper function to get stage by ID
function getStageById(id) {
  return stages.find((stage) => stage.id === id);
}

// Helper function to search artists
function searchArtists(query) {
  query = query.toLowerCase();
  return artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(query) ||
      artist.genre.toLowerCase().includes(query)
  );
}

// Helper function to filter schedule by day
function getScheduleByDay(day) {
  return schedule.find((s) => s.day.toLowerCase() === day.toLowerCase());
}

// Helper function to filter schedule by stage
function getScheduleByStage(stageId) {
  const result = [];

  schedule.forEach((day) => {
    const performances = day.performances.filter((p) => p.stageId === stageId);
    if (performances.length) {
      result.push({
        day: day.day,
        date: day.date,
        performances: performances,
      });
    }
  });

  return result;
}
