import type { NotebookPhoto } from "../components/PhotoNotebook";

export interface TravelStop {
  id: string;
  label: string;
  detail: string;
  longitude: number;
  latitude: number;
  photos: NotebookPhoto[];
}

export const travelStops: TravelStop[] = [
  {
    id: "boston", label: "Boston", detail: "Massachusetts, United States", longitude: -71.0589, latitude: 42.3601,
    photos: [
      { src: "notebook/burise.webp", label: "BU RISE", alt: "Michael with other students at Boston University" },
      { src: "notebook/buriseboston.webp", label: "Summer in Boston", alt: "Michael and friends together in Boston" },
      { src: "notebook/bostonbufriends.webp", label: "BU friends", alt: "Michael and friends at Boston University" },
      { src: "notebook/bostonfireworks.webp", label: "Boston fireworks", alt: "Michael and friends watching fireworks in Boston" },
    ],
  },
  {
    id: "new-york", label: "New York City", detail: "New York, United States", longitude: -74.0060, latitude: 40.7128,
    photos: [
      { src: "notebook/newyork.webp", label: "New York", alt: "Michael outside a building in New York City" },
      { src: "notebook/newyork2.webp", label: "Another day in New York", alt: "Michael on a New York City street" },
    ],
  },
  {
    id: "arizona", label: "Arizona", detail: "United States", longitude: -111.8561, latitude: 34.5667,
    photos: [
      { src: "notebook/arizonaisef.webp", label: "ISEF in Arizona", alt: "Michael and friends together at ISEF in Arizona" },
      { src: "notebook/canyonamericansouthwest.webp", label: "Arizona canyon", alt: "Michael and others inside a sandstone canyon in Arizona" },
    ],
  },
  {
    id: "shanghai", label: "Shanghai", detail: "China", longitude: 121.4833, latitude: 31.2333,
    photos: [
      { src: "notebook/shanghai-heic.webp", label: "Shanghai skyline", alt: "Shanghai skyline illuminated at night" },
      { src: "notebook/shanghai-jpg.webp", label: "By the waterfront", alt: "Michael by the waterfront in Shanghai at night" },
    ],
  },
  {
    id: "japan", label: "Japan", detail: "Around Japan", longitude: 138, latitude: 36,
    photos: [
      { src: "notebook/japan.webp", label: "A stop in Japan", alt: "Michael in a restaurant in Japan" },
      { src: "notebook/japanstreetfood.webp", label: "Street food", alt: "Michael on a busy street with food stalls in Japan" },
      { src: "notebook/japanuniversal.webp", label: "Universal Studios Japan", alt: "Michael at Universal Studios Japan at night" },
      { src: "notebook/japansister.webp", label: "With my sister", alt: "Michael with his sister in Japan" },
    ],
  },
  {
    id: "south-korea", label: "South Korea", detail: "South Korea", longitude: 127.8, latitude: 36.5,
    photos: [{ src: "notebook/korea.webp", label: "South Korea", alt: "Michael visiting a striking modern building in South Korea", rotateClockwise: true }],
  },
  {
    id: "macao", label: "Macao", detail: "Special administrative region of China", longitude: 113.5833, latitude: 22.2333,
    photos: [{ src: "notebook/macao.webp", label: "Macao", alt: "Michael standing in front of a Macao sign" }],
  },
];

export const usPlaces = [
  "California", "Washington", "Alaska", "Arizona", "New Mexico", "Nevada", "Utah", "Colorado",
  "New York", "Massachusetts", "Washington, DC", "Maryland", "Michigan", "Indiana", "Ohio",
  "Illinois", "Wisconsin", "Pennsylvania", "Rhode Island", "Florida", "Missouri", "Kansas",
  "Montana", "Wyoming", "Texas", "Georgia", "Hawaii",
];

export const outsidePlaces = [
  "Canada", "Mexico", "The Bahamas", "Puerto Rico", "Italy", "United Kingdom", "China", "Thailand",
  "Maldives", "Taiwan", "Singapore", "Japan", "South Korea", "Hong Kong", "Macao",
];

export const placeToStop: Record<string, string> = {
  Arizona: "arizona", "New York": "new-york", Massachusetts: "boston", China: "shanghai",
  Japan: "japan", "South Korea": "south-korea", Macao: "macao",
};

/** Natural Earth ADM0_A3 codes for visited places represented as countries. */
export const visitedCountryCodes = [
  "USA", "CAN", "MEX", "BHS", "PRI", "ITA", "GBR", "CHN", "THA", "MDV", "TWN", "SGP", "JPN", "KOR",
];
