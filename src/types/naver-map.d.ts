// Minimal Naver Maps JS v3 typings used in this project.
declare global {
  interface Window {
    naver?: {
      maps: NaverMaps;
    };
    __wwOnNaverMapReady?: () => void;
  }
}

export interface NaverMaps {
  Map: new (el: HTMLElement, opts: NaverMapOptions) => NaverMap;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  LatLngBounds: new (sw: NaverLatLng, ne: NaverLatLng) => NaverLatLngBounds;
  Marker: new (opts: NaverMarkerOptions) => NaverMarker;
  Event: {
    addListener: (
      target: unknown,
      name: string,
      handler: (...args: unknown[]) => void,
    ) => unknown;
    removeListener: (listener: unknown) => void;
  };
  Position: { TOP_RIGHT: number; BOTTOM_LEFT: number; BOTTOM_RIGHT: number };
}

export interface NaverMapOptions {
  center: NaverLatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  scaleControl?: boolean;
  logoControl?: boolean;
  mapDataControl?: boolean;
  zoomControl?: boolean;
  zoomControlOptions?: { position: number };
}

export interface NaverLatLng {
  lat: () => number;
  lng: () => number;
}

export interface NaverLatLngBounds {
  getSW: () => NaverLatLng;
  getNE: () => NaverLatLng;
}

export interface NaverMap {
  setCenter: (latlng: NaverLatLng) => void;
  getCenter: () => NaverLatLng;
  getBounds: () => NaverLatLngBounds;
  getZoom: () => number;
  setZoom: (z: number) => void;
  panTo: (latlng: NaverLatLng) => void;
  fitBounds: (bounds: NaverLatLngBounds) => void;
  destroy?: () => void;
}

export interface NaverMarkerOptions {
  position: NaverLatLng;
  map?: NaverMap;
  title?: string;
  icon?: { content: string; anchor?: unknown };
  zIndex?: number;
}

export interface NaverMarker {
  setMap: (map: NaverMap | null) => void;
  setPosition: (latlng: NaverLatLng) => void;
  setIcon: (icon: { content: string }) => void;
  setZIndex: (z: number) => void;
}

export {};
