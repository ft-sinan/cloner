import React from 'react';

/**
 * Small, self-contained brand marks so the app has no external icon dependency.
 * Everything is drawn in a 64x64 viewBox.
 */
export default function AppIcon({ id, size = 44, className = '' }) {
  let art;

  switch (id) {
    case 'whatsapp':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#25D366" />
          <path d="M32 11.5c-11 0-20 8.7-20 19.4 0 3.4.9 6.7 2.6 9.6L12 53l12.7-3.3c2.8 1.5 5.9 2.3 9.3 2.3 11 0 20-8.7 20-19.4S43 11.5 32 11.5Z" fill="#fff" />
          <path d="M25.6 22.8c-.8-1-1.7-1-2.6-.4-.9.6-2.3 2.3-2.3 5.5s2.3 6.4 2.6 6.8c.4.5 4.4 6.8 11 9.3 5.3 2 6.4 1.6 7.5 1.5 1.1-.1 3.5-1.4 4-2.8.5-1.4.5-2.6.4-2.9-.1-.3-.9-.6-2.1-1.2-1.2-.6-2.9-1.5-3.7-1.8-.8-.3-1.4-.5-2 .5-.5 1-2.3 2.9-2.8 3.5-.5.6-1 .7-1.9.2-.9-.5-3.8-1.4-7.2-4.4-2.7-2.4-4.5-5.3-5-6.2-.5-.9-.1-1.4.4-1.9.4-.4.9-1 1.4-1.5.5-.5.6-.9.9-1.5.3-.6.1-1.1-.1-1.5-.1-.4-2.6-6.1-3.5-7.2Z" fill="#25D366" />
        </>
      );
      break;
    case 'instagram':
      art = (
        <>
          <defs>
            <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
              <stop stopColor="#F9CE34" />
              <stop offset=".45" stopColor="#EE2A7B" />
              <stop offset="1" stopColor="#6228D7" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="18" fill="url(#ig-grad)" />
          <rect x="15" y="15" width="34" height="34" rx="11" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="32" cy="32" r="8" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="43.5" cy="20.5" r="2.6" fill="#fff" />
        </>
      );
      break;
    case 'facebook':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#1877F2" />
          <text x="34" y="48" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="50" fontWeight="bold">f</text>
        </>
      );
      break;
    case 'telegram':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#29A9E1" />
          <path d="M14 31.5 49 17l-7.4 31.2-9.3-9.8-5.2 5.1-1.1-9.4 18.6-13.4-23.8 15.3Z" fill="#fff" />
          <path d="m26.2 39.5-.9 8.1 4.4-5.1" fill="#D9EFFC" />
        </>
      );
      break;
    case 'messenger':
      art = (
        <>
          <defs>
            <linearGradient id="msg-grad" x1="0" y1="1" x2="1" y2="0">
              <stop stopColor="#006AFF" />
              <stop offset="1" stopColor="#B31BFF" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="18" fill="url(#msg-grad)" />
          <path d="M32 13C20.4 13 11 21.6 11 32.4c0 5.9 2.9 11.1 7.5 14.6V53l7.5-4.1c1.9.5 3.9.8 6 .8 11.6 0 21-8.6 21-19.4C53 21.6 43.6 13 32 13Z" fill="#fff" />
          <path d="m19.5 36.5 8.7-9.2 5.5 5.5 9.8-5.5-8.7 9.6-5.5-5.4-9.8 5Z" fill="#0A7CFF" />
        </>
      );
      break;
    case 'youtube':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#FF0033" />
          <path d="M27 21.5 46 32l-19 10.5v-21Z" fill="#fff" />
        </>
      );
      break;
    case 'tiktok':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#111" />
          <path d="M37 11v27.5a10 10 0 1 1-9-9.9v-8a18 18 0 1 0 17 17.9V22.5c2.3 2.6 5.7 4.3 9.5 4.5v-8.3c-5.3-.3-9.5-3.6-9.5-8.7H37Z" fill="#fff" />
        </>
      );
      break;
    case 'x':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#111" />
          <path d="m19 18 26 28M45 18 19 46" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </>
      );
      break;
    case 'snapchat':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#FFFC00" />
          <path d="M32 13c-7.4 0-12 5.2-12 12.7v8.1l-3.4 2.5c-1.3 1-1.1 2.3-.2 3 .7.5 2.1.8 3.6.8h3.2l.9 5.4c.3 1.7 1.9 2.1 3.1.5l2.6-4h5.5l2.6 4c1.2 1.6 2.8 1.2 3.1-.5l.9-5.4h3.2c1.5 0 2.9-.3 3.6-.8.9-.7 1.1-2-.2-3l-3.4-2.5v-8.1C44 18.2 39.4 13 32 13Z" fill="#fff" />
        </>
      );
      break;
    case 'discord':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#5865F2" />
          <path d="M21 23c4.5-2.7 17.5-2.7 22 0 2.4 4.5 3.4 9.4 3.5 14.4-2.6 2-5.6 3.4-8.6 4.2l-2-3.1c-1.7.5-3.5.8-5.3.8s-3.6-.3-5.3-.8l-2 3.1c-3-.8-6-2.2-8.6-4.2C17.6 32.4 18.6 27.5 21 23Z" fill="#fff" />
          <ellipse cx="26.5" cy="32.5" rx="2.7" ry="3.4" fill="#5865F2" />
          <ellipse cx="37.5" cy="32.5" rx="2.7" ry="3.4" fill="#5865F2" />
        </>
      );
      break;
    case 'spotify':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#1DB954" />
          <circle cx="32" cy="32" r="20" fill="#fff" />
          <path d="M19 26c9-3 18-2 26 3M21 33c8-2.6 15-1.8 22 2.4M23 40c6-1.8 11-1.2 16 1.6" stroke="#1DB954" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </>
      );
      break;
    case 'gmail':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#fff" />
          <path d="M11 23v23h7V31l14 10.5L46 31v15h7V23L32 39 11 23Z" fill="#EA4335" />
          <path d="M11 23 32 39l14-10.4V23L32 33 11 23Z" fill="#C5221F" />
        </>
      );
      break;
    case 'linkedin':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#0A66C2" />
          <text x="32" y="46" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="32" fontWeight="bold">in</text>
        </>
      );
      break;
    case 'wechat':
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#07C160" />
          <path d="M29 16c-9 0-16 5.7-16 12.8 0 4 2.3 7.6 5.9 10l-1.3 5.6 6.3-3.1c1.6.5 3.3.7 5.1.7h1.5c-.5-1.6-.8-3.3-.8-5 0-7.1 6.6-12.8 14.7-12.8h1.2C43.7 20.2 37 16 29 16Z" fill="#fff" />
          <path d="M45.5 31c-7 0-12.6 4.7-12.6 10.5S38.5 52 45.5 52c1.6 0 3.1-.2 4.5-.6l4.8 2.4-1-4.2c2.4-1.9 3.9-4.6 3.9-7.6C57.7 35.7 52.1 31 45.5 31Z" fill="#fff" />
          <circle cx="23" cy="27" r="1.8" fill="#07C160" />
          <circle cx="34" cy="27" r="1.8" fill="#07C160" />
        </>
      );
      break;
    default:
      art = (
        <>
          <rect width="64" height="64" rx="18" fill="#E63946" />
          <text x="32" y="43" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="30" fontWeight="bold">{(id || '?').slice(0, 1).toUpperCase()}</text>
        </>
      );
  }

  return (
    <svg className={`app-icon ${className}`} width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${id} icon`}>
      {art}
    </svg>
  );
}
