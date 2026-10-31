/**
 * Authentic Earth Geographic Data & Projection Engine
 * Accurately mapped continents, major rivers, archipelagos, and navigation graticules.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoFeature {
  name: string;
  type: 'continent' | 'island' | 'river';
  coordinates: [number, number][]; // [lat, lng] array
}

// Projection: -180 to 180 Longitude, -75 to 82 Latitude (nautical chart coverage)
export const MIN_LAT = -70;
export const MAX_LAT = 82;
export const MIN_LNG = -180;
export const MAX_LNG = 180;

export function projectLatLng(lat: number, lng: number, width: number, height: number): { x: number; y: number } {
  // Clamp latitude to chart boundaries
  const clampedLat = Math.max(MIN_LAT, Math.min(MAX_LAT, lat));
  // Standard Mercator-influenced projection for authentic nautical world chart feel
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * width;
  
  // High quality projection smoothing out polar stretching while preserving accurate shapes
  const latRad = (clampedLat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const maxLatRad = (MAX_LAT * Math.PI) / 180;
  const maxMerc = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));
  const minLatRad = (MIN_LAT * Math.PI) / 180;
  const minMerc = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));

  // Normalized 0 to 1 (0 at top/North, 1 at bottom/South)
  const normY = 1 - (mercN - minMerc) / (maxMerc - minMerc);
  const y = normY * height;

  return { x, y };
}

export function unprojectXY(x: number, y: number, width: number, height: number): { lat: number; lng: number } {
  const lng = MIN_LNG + (x / width) * (MAX_LNG - MIN_LNG);
  
  const normY = 1 - y / height;
  const maxLatRad = (MAX_LAT * Math.PI) / 180;
  const maxMerc = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));
  const minLatRad = (MIN_LAT * Math.PI) / 180;
  const minMerc = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));

  const mercN = normY * (maxMerc - minMerc) + minMerc;
  const latRad = 2 * Math.atan(Math.exp(mercN)) - Math.PI / 2;
  const lat = (latRad * 180) / Math.PI;

  return { lat, lng };
}

// Distance in nautical miles between two geographic coordinates
export function calculateDistanceNauticalMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Bearing angle in degrees
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * High-fidelity real Earth geographic coastlines & polygons
 */
export const WORLD_CONTINENTS: GeoFeature[] = [
  // EUROPE & SCANDINAVIA & BRITISH ISLES
  {
    name: 'Europe Mainland',
    type: 'continent',
    coordinates: [
      [36, -5.5], [37, -9], [42, -9.5], [43.5, -8.5], [43.5, -1.8], [47.5, -3],
      [49.5, -1.5], [51, 2], [53.5, 7], [55, 8.5], [57.5, 10.5], [56, 12.5],
      [54, 14], [54.5, 19], [58, 22], [60, 29], [65, 24], [70, 28], [71, 26],
      [68, 14], [62, 5], [58, 6], [54, 9], [53.5, 14], [50, 20], [45, 30],
      [46, 35], [41.5, 29], [40, 26], [38, 24], [36.5, 22], [39, 20], [42, 19],
      [45.5, 13], [44, 12], [41, 15], [38, 16], [38, 14], [40.5, 14], [44, 9],
      [43.5, 5], [42.5, 3], [39, -0.5], [36.5, -4], [36, -5.5]
    ]
  },
  {
    name: 'Great Britain',
    type: 'island',
    coordinates: [
      [50, -5], [50.5, -2], [51.5, 1.3], [53, 0.3], [54.5, -0.2], [58, -3],
      [58.5, -4.5], [56, -5.5], [54.5, -3], [53, -4.5], [51.5, -5], [50, -5]
    ]
  },
  {
    name: 'Ireland',
    type: 'island',
    coordinates: [
      [51.5, -9.8], [52, -6.3], [54, -5.5], [55.3, -7.3], [54.2, -10], [52.5, -10.2], [51.5, -9.8]
    ]
  },
  {
    name: 'Iberian Peninsula',
    type: 'continent',
    coordinates: [
      [36, -5.5], [36.5, -6.3], [37, -9], [38.5, -9.5], [41, -8.7], [43.5, -9.3],
      [43.5, -2], [42.5, 3.2], [41, 1], [38.5, -0.1], [36.8, -2.1], [36, -5.5]
    ]
  },

  // AFRICA
  {
    name: 'Africa',
    type: 'continent',
    coordinates: [
      [35.8, -5.8], [37, 10], [33, 11], [31, 20], [31.5, 32.5], [28, 34],
      [22, 37], [12, 44], [11.8, 51.2], [2, 45], [-4, 39], [-10, 40],
      [-15, 40.5], [-25, 33], [-34, 26], [-34.8, 20], [-34, 18.5], [-28, 16],
      [-18, 12], [-10, 13.5], [-5, 12], [4, 9], [6, 3], [5, -1], [4.5, -7.5],
      [7, -12], [14.5, -17.5], [21, -17], [28, -13], [32, -9.5], [35.8, -5.8]
    ]
  },
  {
    name: 'Madagascar',
    type: 'island',
    coordinates: [
      [-12, 49.3], [-16, 44], [-25, 47], [-25.5, 45], [-17, 49], [-12, 49.3]
    ]
  },

  // NORTH AMERICA
  {
    name: 'North America',
    type: 'continent',
    coordinates: [
      [8.5, -77.5], [9, -83], [16, -88], [21.5, -87], [18.5, -92], [22, -97.5],
      [26, -97], [29, -94], [29.5, -89], [30, -84], [25, -80.5], [30.5, -81.5],
      [35, -75.5], [40, -74], [44, -66], [45, -61], [47, -65], [49, -64],
      [52, -56], [58, -62], [62, -65], [60, -78], [52, -81], [58, -94],
      [64, -87], [70, -95], [71, -128], [71, -156], [65, -168], [60, -165],
      [55, -160], [59, -140], [54, -130], [48.5, -124.5], [42, -124.3],
      [34, -120], [32, -117], [24, -110], [28, -112], [20, -105], [16, -98],
      [14, -92], [8.5, -77.5]
    ]
  },
  {
    name: 'Greenland',
    type: 'island',
    coordinates: [
      [60, -44], [65, -38], [77, -18], [82, -30], [80, -60], [70, -52], [60, -44]
    ]
  },
  {
    name: 'Cuba & Hispaniola',
    type: 'island',
    coordinates: [
      [22, -84.5], [23, -80], [20, -74], [20, -77], [22, -84.5]
    ]
  },

  // SOUTH AMERICA
  {
    name: 'South America',
    type: 'continent',
    coordinates: [
      [8.5, -77.5], [11, -73], [11, -63], [7, -58], [4, -51], [-1, -48],
      [-5, -35.5], [-12, -38], [-23, -43], [-32, -52], [-35, -57], [-40, -62],
      [-50, -68], [-55, -67], [-54, -71], [-45, -75], [-35, -72], [-20, -70],
      [-10, -78], [-4, -81], [2, -79], [7, -78], [8.5, -77.5]
    ]
  },

  // ASIA & MIDDLE EAST & INDIA
  {
    name: 'Asia',
    type: 'continent',
    coordinates: [
      [41.5, 29], [37, 36], [32, 35], [28, 34], [15, 42], [12.5, 45],
      [14.5, 53], [24, 57], [27, 51], [30, 48], [25, 57], [25, 67],
      [20, 72], [10, 76], [8, 77.5], [13, 80], [21, 87], [22, 91],
      [16, 96], [10, 99], [3, 101], [1.3, 103.8], [6, 102], [10, 105],
      [13, 109], [21, 108], [23, 116], [31, 122], [37, 122], [39, 125],
      [40, 129], [48, 140], [58, 163], [66, 170], [67, -170], [72, -180],
      [73, 140], [76, 100], [73, 72], [68, 48], [60, 29], [50, 20], [41.5, 29]
    ]
  },
  {
    name: 'Japan',
    type: 'island',
    coordinates: [
      [31, 130.5], [34, 134], [36, 137], [40, 140], [43, 144], [41, 141],
      [35, 140], [33, 132], [31, 130.5]
    ]
  },
  {
    name: 'East Indies (Sumatra, Java, Borneo, Maluku)',
    type: 'island',
    coordinates: [
      [5.5, 95.5], [3, 98], [-4, 105], [-6, 106], [-8, 114], [-8, 116],
      [-5, 114], [4, 118], [7, 117], [1, 109], [5.5, 95.5]
    ]
  },
  {
    name: 'Philippines',
    type: 'island',
    coordinates: [
      [18, 121], [14, 124], [7, 126], [6, 122], [10, 122], [18, 121]
    ]
  },

  // AUSTRALIA
  {
    name: 'Australia',
    type: 'continent',
    coordinates: [
      [-11, 142], [-15, 145], [-23, 151], [-32, 153], [-38, 148], [-38, 140],
      [-35, 136], [-32, 130], [-35, 116], [-28, 114], [-21, 115], [-15, 124],
      [-12, 131], [-12, 136], [-11, 142]
    ]
  }
];

// Famous navigable inland river paths for Lewis & Clark exploration
export const FAMOUS_RIVERS: GeoFeature[] = [
  {
    name: 'Mississippi & Missouri Rivers',
    type: 'river',
    coordinates: [
      [29.2, -89.2], [30.5, -91.2], [35.1, -90.0], [37.0, -89.1], [38.6, -90.2],
      [39.1, -94.6], [41.2, -95.9], [44.3, -100.3], [48.0, -104.0], [47.5, -110.5], [45.5, -112.5]
    ]
  },
  {
    name: 'Columbia River (Pacific Northwest Passage)',
    type: 'river',
    coordinates: [
      [46.2, -124.0], [45.6, -121.2], [46.2, -119.0], [46.4, -117.0], [45.5, -115.5]
    ]
  },
  {
    name: 'Amazon River',
    type: 'river',
    coordinates: [
      [-0.1, -49.5], [-1.8, -54.5], [-2.5, -57.0], [-3.1, -60.0], [-3.8, -69.5], [-4.5, -73.5]
    ]
  },
  {
    name: 'St. Lawrence River & Great Lakes',
    type: 'river',
    coordinates: [
      [49.5, -67.0], [47.0, -70.5], [45.5, -73.6], [44.2, -76.5], [42.3, -83.0], [45.8, -84.7]
    ]
  },
  {
    name: 'Congo River',
    type: 'river',
    coordinates: [
      [-6.0, 12.3], [-4.3, 15.3], [-0.5, 18.0], [1.5, 20.0], [0.5, 25.0]
    ]
  },
  {
    name: 'Nile River',
    type: 'river',
    coordinates: [
      [31.5, 31.8], [30.0, 31.2], [24.0, 32.9], [19.0, 30.5], [15.6, 32.5], [10.0, 32.0]
    ]
  }
];

// Historical compass roses and rhumb line hubs
export const COMPASS_HUBS: [number, number][] = [
  [38.7, -9.1],   // Lisbon
  [28.0, -15.4],  // Canary Islands
  [15.0, -23.5],  // Cape Verde
  [24.0, -75.0],  // Bahamas / Caribbean
  [-34.0, 18.5],  // Cape of Good Hope
  [3.0, 102.0],   // Straits of Malacca
  [13.0, 144.0],  // Marianas / Pacific crossing
  [-53.0, -68.0]  // Tierra del Fuego
];
