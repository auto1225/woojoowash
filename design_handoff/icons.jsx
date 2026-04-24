// Minimal monoline icon set for 우주워시
// All icons 24×24 viewBox, stroke-based, currentColor

const Icon = ({ children, size = 24, stroke = 1.6, fill = 'none', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

const IconHome = (p) => <Icon {...p}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/></Icon>;
const IconHomeFill = (p) => <Icon fill="currentColor" stroke="none" {...p}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/></Icon>;

const IconHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
const IconHeartFill = (p) => <Icon fill="currentColor" stroke="none" {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;

const IconCal = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Icon>;
const IconCalFill = (p) => <Icon fill="currentColor" stroke="none" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><rect x="3" y="5" width="18" height="5" fill="currentColor"/></Icon>;

const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></Icon>;
const IconUserFill = (p) => <Icon fill="currentColor" stroke="none" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6z"/></Icon>;

const IconBell = (p) => <Icon {...p}><path d="M18 16V11a6 6 0 10-12 0v5l-2 2h16zM10 20a2 2 0 004 0"/></Icon>;
const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></Icon>;
const IconBack = (p) => <Icon {...p}><path d="M15 18l-6-6 6-6"/></Icon>;
const IconChev = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
const IconDown = (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
const IconClose = (p) => <Icon {...p}><path d="M6 6l12 12M6 18L18 6"/></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M5 12l5 5L20 7"/></Icon>;

const IconPin = (p) => <Icon {...p}><path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></Icon>;
const IconMap = (p) => <Icon {...p}><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/></Icon>;
const IconCar = (p) => <Icon {...p}><path d="M4 14l2-6a2 2 0 012-1h8a2 2 0 012 1l2 6v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/></Icon>;
const IconCarWash = (p) => <Icon {...p}><path d="M3 3l2 4M8 3l2 4M13 3l2 4M3 20h18M5 20v-3a2 2 0 012-2h10a2 2 0 012 2v3M7 11h10l1 4H6l1-4z"/></Icon>;
const IconDroplet = (p) => <Icon {...p}><path d="M12 3s-6 7-6 11a6 6 0 1012 0c0-4-6-11-6-11z"/></Icon>;
const IconSparkle = (p) => <Icon {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></Icon>;
const IconSpray = (p) => <Icon {...p}><rect x="8" y="8" width="8" height="14" rx="1"/><path d="M8 11h8M10 8V5h4v3M10 5l-4-2M14 5l4-2M14 2l4-1M10 2L6 1"/></Icon>;
const IconBucket = (p) => <Icon {...p}><path d="M5 9h14l-1 12a1 1 0 01-1 1H7a1 1 0 01-1-1L5 9z"/><path d="M8 9V6a4 4 0 018 0v3"/></Icon>;
const IconTruck = (p) => <Icon {...p}><rect x="1" y="7" width="13" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7M4 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z"/></Icon>;
const IconGift = (p) => <Icon {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9a1 1 0 001 1h12a1 1 0 001-1v-9M12 8v14M8 8a3 3 0 010-6c2 0 4 3 4 6M16 8a3 3 0 000-6c-2 0-4 3-4 6"/></Icon>;
const IconTicket = (p) => <Icon {...p}><path d="M3 9a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4V9z"/><path d="M9 7v2M9 13v2M9 19v-2"/></Icon>;
const IconCard = (p) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></Icon>;
const IconCamera = (p) => <Icon {...p}><path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/><circle cx="12" cy="13" r="4"/></Icon>;
const IconStar = (p) => <Icon {...p}><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z"/></Icon>;
const IconStarFill = (p) => <Icon fill="currentColor" stroke="none" {...p}><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z"/></Icon>;
const IconFilter = (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></Icon>;
const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></Icon>;
const IconMsg = (p) => <Icon {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></Icon>;
const IconHelp = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 016 .5c0 1.5-2 2-3 3v1M12 17h.01"/></Icon>;
const IconInfo = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></Icon>;
const IconDots = (p) => <Icon {...p}><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></Icon>;
const IconArrow = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
const IconShield = (p) => <Icon {...p}><path d="M12 2l8 3v7c0 5-4 8-8 10-4-2-8-5-8-10V5l8-3z"/></Icon>;
const IconMenu = (p) => <Icon {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconWon = (p) => <Icon {...p}><path d="M3 6l3 12 2.5-9L11 18l2-9 2.5 9L18 6M3 10h18M3 14h18"/></Icon>;

Object.assign(window, {
  Icon,
  IconHome, IconHomeFill, IconHeart, IconHeartFill, IconCal, IconCalFill,
  IconUser, IconUserFill, IconBell, IconSearch, IconBack, IconChev, IconDown,
  IconClose, IconPlus, IconCheck, IconPin, IconMap, IconCar, IconCarWash,
  IconDroplet, IconSparkle, IconSpray, IconBucket, IconTruck, IconGift,
  IconTicket, IconCard, IconCamera, IconStar, IconStarFill, IconFilter,
  IconSettings, IconMsg, IconHelp, IconInfo, IconDots, IconArrow, IconShield,
  IconMenu, IconClock, IconWon,
});
