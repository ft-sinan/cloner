export const APPS = [
  { id: 'whatsapp', name: 'WhatsApp', category: 'Messaging', size: '1.8 GB', audience: '2.4B users', tagline: 'Chats, calls and channels — twice over.' },
  { id: 'instagram', name: 'Instagram', category: 'Social', size: '1.2 GB', audience: '1.4B users', tagline: 'Keep your personal feed and your brand feed apart.' },
  { id: 'facebook', name: 'Facebook', category: 'Social', size: '820 MB', audience: '3.0B users', tagline: 'Two timelines, one phone, zero logging out.' },
  { id: 'telegram', name: 'Telegram', category: 'Messaging', size: '640 MB', audience: '900M users', tagline: 'Separate chats for work, friends and communities.' },
  { id: 'messenger', name: 'Messenger', category: 'Messaging', size: '510 MB', audience: '1.3B users', tagline: 'Never mix customer DMs with your own inbox.' },
  { id: 'youtube', name: 'YouTube', category: 'Entertainment', size: '1.1 GB', audience: '2.5B users', tagline: 'A second watch history that is all yours.' },
  { id: 'tiktok', name: 'TikTok', category: 'Entertainment', size: '1.4 GB', audience: '1.2B users', tagline: 'One feed for you, one for the algorithm tests.' },
  { id: 'x', name: 'X', category: 'Social', size: '460 MB', audience: '550M users', tagline: 'Personal opinions and pro account, side by side.' },
  { id: 'snapchat', name: 'Snapchat', category: 'Social', size: '780 MB', audience: '800M users', tagline: 'Another streak without losing the first one.' },
  { id: 'discord', name: 'Discord', category: 'Messaging', size: '390 MB', audience: '200M users', tagline: 'Server-hop with a second identity.' },
  { id: 'spotify', name: 'Spotify', category: 'Entertainment', size: '690 MB', audience: '640M users', tagline: 'Your guilty-pleasure playlist gets its own space.' },
  { id: 'gmail', name: 'Gmail', category: 'Productivity', size: '320 MB', audience: '1.8B users', tagline: 'Inbox zero for one account at a time.' },
  { id: 'linkedin', name: 'LinkedIn', category: 'Productivity', size: '280 MB', audience: '1.0B users', tagline: 'Personal profile and recruiting profile, separate.' },
  { id: 'wechat', name: 'WeChat', category: 'Messaging', size: '910 MB', audience: '1.3B users', tagline: 'Keep every circle in its own conversation.' },
];

export const CATEGORIES = ['All apps', 'Messaging', 'Social', 'Entertainment', 'Productivity'];

export const INITIAL_CLONES = [
  {
    id: 'clone-1',
    appId: 'whatsapp',
    name: 'WhatsApp Personal',
    status: 'running',
    size: '1.8 GB',
    lastActive: 'Active now',
    notifications: 12,
    created: '12 Mar 2026',
  },
  {
    id: 'clone-2',
    appId: 'whatsapp',
    name: 'WhatsApp Work',
    status: 'running',
    size: '1.1 GB',
    lastActive: '4 min ago',
    notifications: 3,
    created: '12 Mar 2026',
  },
  {
    id: 'clone-3',
    appId: 'instagram',
    name: 'Insta Studio',
    status: 'running',
    size: '940 MB',
    lastActive: '1 hour ago',
    notifications: 8,
    created: '28 Mar 2026',
  },
  {
    id: 'clone-4',
    appId: 'telegram',
    name: 'Telegram Side',
    status: 'paused',
    size: '380 MB',
    lastActive: 'Yesterday',
    notifications: 0,
    created: '02 Apr 2026',
  },
];

export const ACTIVITY = [
  { icon: 'plus', title: 'Insta Studio was cloned', detail: 'Instagram · 28 Mar, 9:24 AM' },
  { icon: 'sync', title: 'WhatsApp Work synced', detail: '1.1 GB backed up to the cloud' },
  { icon: 'shield', title: 'Biometric lock enabled', detail: 'FT Cloner · 18 Mar, 6:10 PM' },
  { icon: 'plus', title: 'WhatsApp Work was cloned', detail: 'WhatsApp · 12 Mar, 2:41 PM' },
];

export const APP_COLORS = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  facebook: '#1877F2',
  telegram: '#29A9E1',
  messenger: '#0A7CFF',
  youtube: '#FF0033',
  tiktok: '#111111',
  x: '#111111',
  snapchat: '#FFFC00',
  discord: '#5865F2',
  spotify: '#1DB954',
  gmail: '#EA4335',
  linkedin: '#0A66C2',
  wechat: '#07C160',
};

export const getApp = (id) => APPS.find((app) => app.id === id);
