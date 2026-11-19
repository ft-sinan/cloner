import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Grid2X2,
  HardDrive,
  LayoutDashboard,
  Lock,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import AppIcon from './AppIcon.jsx';
import { ACTIVITY, APPS, APP_COLORS, CATEGORIES, getApp, INITIAL_CLONES } from './data.js';

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'clones', label: 'My clones', icon: Copy },
  { id: 'library', label: 'App library', icon: Grid2X2 },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const PAGE_META = {
  dashboard: { title: 'Overview', subtitle: 'Everything your other accounts are up to.' },
  clones: { title: 'My clones', subtitle: 'Manage every app instance running on your device.' },
  library: { title: 'App library', subtitle: 'Pick an app and give it another life.' },
  storage: { title: 'Storage', subtitle: 'See exactly what each clone is keeping.' },
  settings: { title: 'Settings', subtitle: 'Make FT Cloner work the way you do.' },
};

const STORAGE_KEY = 'ft-cloner-clones-v1';
const DEVICE_GB = 128;

function sizeToGb(size) {
  const value = parseFloat(size) || 0;
  return size.includes('GB') ? value : value / 1024;
}

function loadClones() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall back to the demo data */
  }
  return INITIAL_CLONES;
}

function Logo({ compact = false }) {
  return (
    <div className="logo">
      <div className="logo-mark">FT</div>
      {!compact && (
        <div className="logo-text">
          <strong>FT Cloner</strong>
          <span>parallel app space</span>
        </div>
      )}
    </div>
  );
}

function Sidebar({ page, onNavigate, open, onClose, usedGb }) {
  const percent = Math.min(100, Math.round((usedGb / DEVICE_GB) * 100));

  return (
    <>
      {open && <button className="sidebar-scrim" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu"><X size={19} /></button>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{item.label}</span>
                {page === item.id && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="storage-card">
            <div className="storage-card-head">
              <HardDrive size={16} />
              <span>Device storage</span>
            </div>
            <div className="storage-value">
              <strong>{usedGb.toFixed(1)} GB</strong><span> / {DEVICE_GB} GB</span>
            </div>
            <div className="progress"><div style={{ width: `${Math.max(percent, 4)}%` }} /></div>
            <p>{(DEVICE_GB - usedGb).toFixed(1)} GB free</p>
          </div>

          <button className="pro-card" onClick={() => onNavigate('storage')}>
            <Sparkles size={18} />
            <div>
              <strong>Unlimited clones</strong>
              <span>Upgrade to FT Cloner Pro</span>
            </div>
            <ArrowUpRight size={17} />
          </button>

          <div className="profile">
            <div className="avatar">AS</div>
            <div className="profile-text">
              <strong>Aarav Sharma</strong>
              <span>Free plan</span>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ page, query, onQuery, onMenu, onNotify, notifyOpen, activity }) {
  const meta = PAGE_META[page];
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={21} /></button>
        <div>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="searchbox">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search apps or clones..."
            aria-label="Search apps or clones"
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="bell-wrap">
          <button className="icon-btn bell-btn" onClick={onNotify} aria-label="Notifications">
            <Bell size={19} />
            <span className="bell-dot" />
          </button>
          {notifyOpen && (
            <div className="notify-pop">
              <div className="notify-head"><strong>Activity</strong><span>Today</span></div>
              {activity.slice(0, 3).map((item, i) => (
                <div className="notify-item" key={i}>
                  <span className={`activity-icon ${item.icon}`}>
                    {item.icon === 'plus' ? <Plus size={14} /> : item.icon === 'sync' ? <Activity size={14} /> : <ShieldCheck size={14} />}
                  </span>
                  <div><strong>{item.title}</strong><span>{item.detail}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="top-avatar" aria-label="Account">AS</button>
      </div>
    </header>
  );
}

function StatCard({ icon: Icon, label, value, foot, tone = 'red' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} strokeWidth={1.9} /></div>
      <div className="stat-body">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{foot}</small>
      </div>
    </div>
  );
}

function Hero({ onClone }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="hero-eyebrow"><span className="pulse-dot" /> FT CLONER FOR ANDROID</span>
        <h2>One phone.<br />Every account.</h2>
        <p>Clone WhatsApp, Instagram and your other favourite apps. Run two accounts side by side with separate data, notifications and identities.</p>
        <div className="hero-actions">
          <button className="btn btn-light" onClick={onClone}><Plus size={17} /> Clone an app</button>
          <a className="hero-link" href="#how-it-works">See how it works <ArrowRight size={16} /></a>
        </div>
        <div className="hero-social">
          <div className="avatar-stack">
            <span>RK</span><span>ND</span><span>MP</span><span>+</span>
          </div>
          <p><strong>120k+</strong> people run dual accounts with FT Cloner</p>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-halo halo-one" />
        <div className="hero-halo halo-two" />
        <div className="phone">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="phone-heading">
              <div className="phone-logo">FT</div>
              <div><strong>My Clones</strong><span>3 apps running</span></div>
            </div>
            {['whatsapp', 'instagram', 'telegram'].map((id, i) => (
              <div className="phone-app" key={id}>
                <AppIcon id={id} size={34} />
                <div><strong>{['WhatsApp Personal', 'Insta Studio', 'Telegram Side'][i]}</strong><span>{['Active now', '2 min ago', 'Separate space'][i]}</span></div>
                <span className={`phone-status ${i === 2 ? 'off' : ''}`} />
              </div>
            ))}
            <div className="phone-add"><Plus size={17} /> Add another clone</div>
          </div>
        </div>
        <div className="floating-chip chip-one"><Check size={14} /> Clone ready</div>
        <div className="floating-chip chip-two"><ShieldCheck size={14} /> Isolated data</div>
      </div>
    </section>
  );
}

function CloneRow({ clone, onOpen, onToggle, onDelete, compact = false }) {
  const app = getApp(clone.appId);
  return (
    <div className={`clone-row ${compact ? 'compact' : ''}`}>
      <div className="clone-icon-wrap">
        <AppIcon id={clone.appId} size={compact ? 42 : 48} />
        <span className={`status-pip ${clone.status}`} />
      </div>
      <div className="clone-info">
        <strong>{clone.name}</strong>
        <span>{app?.name || 'App'} <i>·</i> {clone.size} <i>·</i> {clone.lastActive}</span>
      </div>
      <div className="clone-state">
        <span className={`state-badge ${clone.status}`}>
          {clone.status === 'running' ? <><span className="mini-dot" /> Running</> : <><Pause size={11} /> Paused</>}
        </span>
      </div>
      <div className="clone-actions">
        <button className="icon-btn soft" title={clone.status === 'running' ? 'Pause clone' : 'Resume clone'} onClick={() => onToggle(clone.id)}>
          {clone.status === 'running' ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => onOpen(clone)}>Open</button>
        {!compact && (
          <button className="icon-btn soft danger" title="Delete clone" onClick={() => onDelete(clone.id)}><Trash2 size={16} /></button>
        )}
      </div>
    </div>
  );
}

function AppTile({ app, clonedCount, onClone }) {
  return (
    <button className="app-tile" onClick={() => onClone(app)}>
      <span className="tile-plus"><Plus size={15} /></span>
      <AppIcon id={app.id} size={48} />
      <strong>{app.name}</strong>
      <span className="tile-cat">{app.category}</span>
      <span className="tile-foot">
        {clonedCount > 0 ? <><Check size={12} /> {clonedCount} cloned</> : <><Plus size={12} /> Clone app</>}
      </span>
    </button>
  );
}

function EmptyState({ onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Copy size={26} /></div>
      <h3>No clones yet</h3>
      <p>Your cloned apps will show up here. Start with WhatsApp and keep both accounts online.</p>
      <button className="btn btn-primary" onClick={onAction}><Plus size={16} /> Clone your first app</button>
    </div>
  );
}

function Toggle({ checked, onChange, label, description, icon: Icon }) {
  return (
    <div className="setting-row">
      <div className="setting-icon"><Icon size={18} /></div>
      <div className="setting-text"><strong>{label}</strong><span>{description}</span></div>
      <button
        className={`switch ${checked ? 'on' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
      ><span /></button>
    </div>
  );
}

function CloneModal({ app, onClose, onCreate, existingCount }) {
  const [name, setName] = useState(`${app.name} ${existingCount > 0 ? existingCount + 1 : 'Clone'}`);
  const [options, setOptions] = useState({ storage: true, notifications: true, autostart: true });
  const [accent, setAccent] = useState('#E63946');
  const accents = ['#E63946', '#25D366', '#1877F2', '#8B5CF6', '#F59E0B'];

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    onCreate({ name: name.trim() || `${app.name} Clone`, options, accent });
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">NEW CLONE</span>
            <h3 id="modal-title">Set up {app.name}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-app">
            <AppIcon id={app.id} size={50} />
            <div>
              <strong>{app.name}</strong>
              <span>{app.tagline}</span>
            </div>
            <span className="modal-size">{app.size}</span>
          </div>

          <label className="field-label" htmlFor="clone-name">Clone name</label>
          <input
            id="clone-name"
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoFocus
          />

          <p className="field-label">Clone options</p>
          <div className="modal-options">
            {[
              ['storage', 'Separate storage', 'Keep this account’s chats and files isolated', HardDrive],
              ['notifications', 'Show notifications', 'Get alerts from this clone independently', Bell],
              ['autostart', 'Start on boot', 'Keep the clone running in the background', Zap],
            ].map(([key, title, desc, Icon]) => (
              <button
                type="button"
                className="modal-option"
                key={key}
                onClick={() => setOptions((o) => ({ ...o, [key]: !o[key] }))}
              >
                <Icon size={17} />
                <span><strong>{title}</strong><small>{desc}</small></span>
                <span className={`checkbox ${options[key] ? 'checked' : ''}`}>{options[key] && <Check size={13} />}</span>
              </button>
            ))}
          </div>

          <p className="field-label">Clone colour</p>
          <div className="swatches">
            {accents.map((color) => (
              <button
                type="button"
                key={color}
                className={`swatch ${accent === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setAccent(color)}
                aria-label={`Choose ${color}`}
              >{accent === color && <Check size={14} />}</button>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Plus size={17} /> Create clone</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [clones, setClones] = useState(loadClones);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All apps');
  const [cloneTarget, setCloneTarget] = useState(null);
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [settings, setSettings] = useState({ autostart: true, notifications: true, biometric: false, background: true, updates: true });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clones));
  }, [clones]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.querySelector('.searchbox input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const usedGb = useMemo(
    () => 6.4 + clones.reduce((sum, clone) => sum + sizeToGb(clone.size), 0),
    [clones],
  );
  const runningCount = clones.filter((c) => c.status === 'running').length;

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APPS.filter((app) =>
      (category === 'All apps' || app.category === category) &&
      (!q || app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const filteredClones = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clones.filter((clone) =>
      !q || clone.name.toLowerCase().includes(q) || clone.appId.includes(q),
    );
  }, [clones, query]);

  const navigate = (next) => {
    setPage(next);
    setSidebarOpen(false);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleClone = (id) => {
    setClones((prev) => prev.map((clone) =>
      clone.id === id
        ? { ...clone, status: clone.status === 'running' ? 'paused' : 'running', lastActive: clone.status === 'running' ? 'Paused just now' : 'Active now' }
        : clone,
    ));
    const clone = clones.find((c) => c.id === id);
    setToast(`${clone?.name || 'Clone'} ${clone?.status === 'running' ? 'paused' : 'resumed'}`);
  };

  const deleteClone = (id) => {
    const clone = clones.find((c) => c.id === id);
    setClones((prev) => prev.filter((c) => c.id !== id));
    setToast(`${clone?.name || 'Clone'} removed from your device`);
  };

  const createClone = ({ name, options, accent }) => {
    const app = cloneTarget;
    const newClone = {
      id: `clone-${Date.now()}`,
      appId: app.id,
      name,
      status: options.autostart ? 'running' : 'paused',
      size: app.size,
      lastActive: 'Just now',
      notifications: 0,
      created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      accent,
    };
    setClones((prev) => [newClone, ...prev]);
    setCloneTarget(null);
    setQuery('');
    setPage('clones');
    setToast(`${name} is ready to use`);
  };

  const openClone = (clone) => setToast(`Launching ${clone.name}…`);
  const openFirstClone = () => setCloneTarget(APPS[0]);

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} usedGb={usedGb} />

      <main className="main">
        <Topbar
          page={page}
          query={query}
          onQuery={setQuery}
          onMenu={() => setSidebarOpen(true)}
          onNotify={() => setNotifyOpen((v) => !v)}
          notifyOpen={notifyOpen}
          activity={ACTIVITY}
        />

        <div className="content">
          {page === 'dashboard' && (
            <>
              <Hero onClone={openFirstClone} />

              <div className="stats-grid">
                <StatCard icon={Copy} label="Total clones" value={clones.length} foot={`across ${new Set(clones.map((c) => c.appId)).size} apps`} />
                <StatCard icon={Activity} label="Running now" value={runningCount} foot="in the background" tone="green" />
                <StatCard icon={Grid2X2} label="Apps supported" value={APPS.length} foot="and counting" tone="blue" />
                <StatCard icon={HardDrive} label="Space used" value={`${usedGb.toFixed(1)} GB`} foot={`of ${DEVICE_GB} GB`} tone="amber" />
              </div>

              <div className="dashboard-grid">
                <section className="panel clones-panel">
                  <div className="panel-head">
                    <div><h3>Your clones</h3><p>Jump back into an account</p></div>
                    <button className="text-btn" onClick={() => navigate('clones')}>View all <ChevronRight size={15} /></button>
                  </div>
                  {clones.length === 0 ? (
                    <EmptyState onAction={openFirstClone} />
                  ) : (
                    <div className="clone-list">
                      {clones.slice(0, 3).map((clone) => (
                        <CloneRow key={clone.id} clone={clone} compact onOpen={openClone} onToggle={toggleClone} onDelete={deleteClone} />
                      ))}
                    </div>
                  )}
                  <button className="panel-foot-btn" onClick={() => setCloneTarget(APPS[0])}><Plus size={16} /> Add another clone</button>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-head">
                    <div><h3>Recent activity</h3><p>What changed lately</p></div>
                    <Clock size={17} className="muted-icon" />
                  </div>
                  <div className="activity-list">
                    {ACTIVITY.map((item, i) => (
                      <div className="activity-item" key={i}>
                        <span className={`activity-icon ${item.icon}`}>
                          {item.icon === 'plus' ? <Plus size={14} /> : item.icon === 'sync' ? <Activity size={14} /> : <ShieldCheck size={14} />}
                        </span>
                        <div><strong>{item.title}</strong><span>{item.detail}</span></div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="library-section">
                <div className="section-head">
                  <div><h3>Popular apps to clone</h3><p>Two accounts, one device, no switching.</p></div>
                  <button className="text-btn" onClick={() => navigate('library')}>Browse all {APPS.length} apps <ArrowRight size={15} /></button>
                </div>
                <div className="app-grid home-grid">
                  {APPS.slice(0, 7).map((app) => (
                    <AppTile key={app.id} app={app} clonedCount={clones.filter((c) => c.appId === app.id).length} onClone={setCloneTarget} />
                  ))}
                </div>
              </section>

              <section className="how-strip" id="how-it-works">
                <div className="how-intro"><span className="mini-eyebrow">HOW IT WORKS</span><h3>Clone in three taps</h3></div>
                {[
                  ['1', 'Pick an app', 'Choose from 14 supported apps.'],
                  ['2', 'Name your clone', 'Give it its own identity and storage.'],
                  ['3', 'Run both at once', 'Switch instantly, stay logged in.'],
                ].map(([n, title, desc]) => (
                  <div className="how-step" key={n}><span>{n}</span><div><strong>{title}</strong><p>{desc}</p></div></div>
                ))}
              </section>
            </>
          )}

          {page === 'clones' && (
            <section className="page-section">
              <div className="page-actions">
                <div className="result-count">{filteredClones.length} clone{filteredClones.length === 1 ? '' : 's'} <span>· {runningCount} running</span></div>
                <button className="btn btn-primary" onClick={openFirstClone}><Plus size={17} /> New clone</button>
              </div>
              {filteredClones.length === 0 ? (
                <EmptyState onAction={openFirstClone} />
              ) : (
                <div className="clone-page-list">
                  {filteredClones.map((clone) => (
                    <CloneRow key={clone.id} clone={clone} onOpen={openClone} onToggle={toggleClone} onDelete={deleteClone} />
                  ))}
                </div>
              )}
              <div className="info-banner">
                <ShieldCheck size={20} />
                <div><strong>Every clone is its own sandbox</strong><span>Data, logins and notifications stay separate from the original app.</span></div>
                <ChevronRight size={18} />
              </div>
            </section>
          )}

          {page === 'library' && (
            <section className="page-section">
              <div className="library-toolbar">
                <div className="category-tabs">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>{cat}</button>
                  ))}
                </div>
                <span className="result-count">{filteredApps.length} app{filteredApps.length === 1 ? '' : 's'}</span>
              </div>
              {filteredApps.length === 0 ? (
                <div className="empty-state small"><div className="empty-icon"><Search size={24} /></div><h3>No apps found</h3><p>Try a different name or category.</p></div>
              ) : (
                <div className="app-grid library-grid">
                  {filteredApps.map((app) => (
                    <AppTile key={app.id} app={app} clonedCount={clones.filter((c) => c.appId === app.id).length} onClone={setCloneTarget} />
                  ))}
                </div>
              )}
            </section>
          )}

          {page === 'storage' && (
            <section className="page-section storage-page">
              <div className="storage-overview">
                <div className="storage-ring" style={{ '--pct': `${Math.min(100, (usedGb / DEVICE_GB) * 100)}%` }}>
                  <div className="ring-inner"><strong>{usedGb.toFixed(1)}</strong><span>GB used</span></div>
                </div>
                <div className="storage-overview-text">
                  <span className="mini-eyebrow">DEVICE STORAGE</span>
                  <h3>Room for more accounts.</h3>
                  <p>FT Cloner keeps each clone’s data in its own folder, so you can delete one without touching the others.</p>
                  <div className="storage-legend">
                    <span><i className="legend-dot red" /> FT Cloner {usedGb.toFixed(1)} GB</span>
                    <span><i className="legend-dot cream" /> Free {(DEVICE_GB - usedGb).toFixed(1)} GB</span>
                  </div>
                  <button className="btn btn-outline" onClick={() => setToast('Storage optimised — 320 MB freed')}><Sparkles size={16} /> Optimise storage</button>
                </div>
              </div>
              <div className="panel breakdown-panel">
                <div className="panel-head"><div><h3>Storage breakdown</h3><p>Per app instance on this device</p></div><span className="result-count">{clones.length} clones</span></div>
                {clones.length === 0 && <p className="muted-text">No clones are using storage yet.</p>}
                {clones.map((clone) => {
                  const pct = Math.round((sizeToGb(clone.size) / Math.max(usedGb, 1)) * 100);
                  return (
                    <div className="breakdown-row" key={clone.id}>
                      <AppIcon id={clone.appId} size={36} />
                      <div className="breakdown-info">
                        <div><strong>{clone.name}</strong><span>{clone.size}</span></div>
                        <div className="progress"><div style={{ width: `${Math.max(pct, 3)}%`, background: APP_COLORS[clone.appId] || '#E63946' }} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {page === 'settings' && (
            <section className="page-section settings-page">
              <div className="settings-hero">
                <div className="avatar big">AS</div>
                <div><h3>Aarav Sharma</h3><p>aarav.sharma@email.com</p><span className="plan-chip"><Sparkles size={13} /> Free plan</span></div>
                <button className="btn btn-outline" onClick={() => setToast('Profile editing is not available in the demo')}>Edit profile</button>
              </div>
              <div className="panel settings-panel">
                <div className="panel-head"><div><h3>Clone preferences</h3><p>Applied to all new clones</p></div></div>
                <Toggle checked={settings.autostart} onChange={(v) => setSettings((s) => ({ ...s, autostart: v }))} label="Auto-start clones" description="Launch every running clone when your device boots" icon={Zap} />
                <Toggle checked={settings.notifications} onChange={(v) => setSettings((s) => ({ ...s, notifications: v }))} label="Clone notifications" description="Show alerts from cloned apps in your status bar" icon={Bell} />
                <Toggle checked={settings.background} onChange={(v) => setSettings((s) => ({ ...s, background: v }))} label="Keep clones in background" description="Maintain active sessions even when the app is closed" icon={Activity} />
                <Toggle checked={settings.biometric} onChange={(v) => setSettings((s) => ({ ...s, biometric: v }))} label="Biometric lock" description="Require fingerprint or face unlock to open clones" icon={Lock} />
                <Toggle checked={settings.updates} onChange={(v) => setSettings((s) => ({ ...s, updates: v }))} label="Auto-update cloned apps" description="Keep all your app instances on the latest version" icon={Download} />
              </div>
              <div className="about-line"><Logo /><span>Version 1.0.0 · Made for people with more than one life</span></div>
            </section>
          )}
        </div>
      </main>

      {cloneTarget && (
        <CloneModal
          app={cloneTarget}
          onClose={() => setCloneTarget(null)}
          onCreate={createClone}
          existingCount={clones.filter((c) => c.appId === cloneTarget.id).length}
        />
      )}

      {toast && (
        <div className="toast"><span><Check size={15} /></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={15} /></button></div>
      )}
    </div>
  );
}
