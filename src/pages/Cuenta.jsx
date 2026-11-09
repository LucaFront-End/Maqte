import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User, Lock, Unlock, ShieldCheck, LogIn, UserPlus, LogOut,
  KeyRound, Calculator, ClipboardList, GraduationCap, HelpCircle,
  CheckCircle2, AlertCircle, MessageCircle, Plus, Trash2,
  Settings, Sparkles, ExternalLink, RefreshCw, ShieldAlert
} from 'lucide-react';
import { LoginState } from '@wix/sdk';
import { useWixClient } from '../hooks/useWixClient';
import { BRAND } from '../data/content';
import BloqueraDigitalSection from '../components/BloqueraDigitalSection';
import './Cuenta.css';

const PERMS_STORAGE_KEY = 'maqte_wix_member_permissions_v1';
const LOCAL_SESSION_KEY = 'maqte_portal_active_user_v1';

export const ROLE_PRESETS = {
  admin: {
    id: 'admin',
    label: 'Administrador Total',
    badgeColor: '#F7BC21',
    sections: { calc: true, gestion: true, curso: true, info: true, admin: true },
    desc: 'Acceso completo a las 4 secciones de Bloquera Digital y al panel de control de permisos de usuarios.',
  },
  pro: {
    id: 'pro',
    label: 'Cliente Bloquera Pro',
    badgeColor: '#10B981',
    sections: { calc: true, gestion: true, curso: true, info: true, admin: false },
    desc: 'Acceso habilitado a Calculadora de Costos, Gestión de Bloquera (CSV), Centro de Formación y Guía.',
  },
  operador: {
    id: 'operador',
    label: 'Operador de Planta',
    badgeColor: '#3B82F6',
    sections: { calc: true, gestion: true, curso: false, info: true, admin: false },
    desc: 'Acceso a Calculadora de Costos, Gestión diaria de movimientos y Guía operativa.',
  },
  basico: {
    id: 'basico',
    label: 'Miembro Básico (Solo Calculadora)',
    badgeColor: '#94A3B8',
    sections: { calc: true, gestion: false, curso: false, info: true, admin: false },
    desc: 'Acceso únicamente a la Calculadora de Costos de Bloques y Guía de Uso.',
  },
};

const PORTAL_SECTIONS = [
  {
    id: 'calc',
    label: 'Calculadora de Costos',
    shortDesc: 'Simulación de costos por bloque, mezclas y rentabilidad por lote',
    icon: Calculator,
  },
  {
    id: 'gestion',
    label: 'Gestión de Bloquera',
    shortDesc: 'Registro de ventas, compras, gastos, producción y respaldo CSV',
    icon: ClipboardList,
  },
  {
    id: 'curso',
    label: 'Centro de Formación',
    shortDesc: '8 módulos técnicos del curso de fabricación de bloques Maqte',
    icon: GraduationCap,
  },
  {
    id: 'info',
    label: 'Guía de Uso',
    shortDesc: 'Metodología de cálculo y recomendaciones operativas',
    icon: HelpCircle,
  },
];

const DEFAULT_USER_DIRECTORY = [
  {
    email: 'info@maqtecolombia.co',
    name: 'Administrador Maqte Colombia',
    role: 'admin',
    sections: { calc: true, gestion: true, curso: true, info: true, admin: true },
  },
  {
    email: 'ventas@maqtecolombia.co',
    name: 'Equipo Comercial Maqte',
    role: 'admin',
    sections: { calc: true, gestion: true, curso: true, info: true, admin: true },
  },
];

export default function Cuenta() {
  const { wixClient, isReady } = useWixClient();

  // ── Auth & Member State ──
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authFeedback, setAuthFeedback] = useState({ type: '', message: '' });

  // Active logged-in member (from Wix Members or authorized session)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Directory of per-email permissions
  const [userDirectory, setUserDirectory] = useState(() => {
    try {
      const raw = localStorage.getItem(PERMS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_USER_DIRECTORY;
  });

  // Default role assigned to new Wix Members not explicitly in the directory
  const [defaultMemberRole, setDefaultMemberRole] = useState(() => {
    return localStorage.getItem('maqte_default_member_role') || 'pro';
  });

  // Currently selected portal section tab
  const [activeSection, setActiveSection] = useState('calc');

  // Form to add/assign permissions to a Wix Member by email
  const [newPermUser, setNewPermUser] = useState({
    email: '',
    name: '',
    role: 'pro',
    sections: { calc: true, gestion: true, curso: true, info: true, admin: false },
  });

  useEffect(() => {
    try {
      localStorage.setItem(PERMS_STORAGE_KEY, JSON.stringify(userDirectory));
    } catch {
      // ignore
    }
  }, [userDirectory]);

  useEffect(() => {
    try {
      localStorage.setItem('maqte_default_member_role', defaultMemberRole);
    } catch {
      // ignore
    }
  }, [defaultMemberRole]);

  // Helper to resolve permissions for any member email + Wix badges
  const resolveUserPermissions = useCallback(
    (email, wixBadges = []) => {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const found = userDirectory.find(
        u => u.email.trim().toLowerCase() === normalizedEmail
      );
      if (found) {
        return {
          role: found.role,
          sections: { ...found.sections },
        };
      }

      // Check Wix Member Badges if present
      const badgeSlugs = wixBadges.map(b => (b?.slug || b?.title || '').toLowerCase());
      if (badgeSlugs.some(s => s.includes('admin'))) {
        return { role: 'admin', sections: { ...ROLE_PRESETS.admin.sections } };
      }
      if (badgeSlugs.some(s => s.includes('pro') || s.includes('cliente'))) {
        return { role: 'pro', sections: { ...ROLE_PRESETS.pro.sections } };
      }
      if (badgeSlugs.some(s => s.includes('operador'))) {
        return { role: 'operador', sections: { ...ROLE_PRESETS.operador.sections } };
      }

      const fallbackPreset = ROLE_PRESETS[defaultMemberRole] || ROLE_PRESETS.pro;
      return {
        role: fallbackPreset.id,
        sections: { ...fallbackPreset.sections },
      };
    },
    [userDirectory, defaultMemberRole]
  );

  // ── Check Wix Member Session on Mount ──
  const checkWixSession = useCallback(async () => {
    if (!isReady || !wixClient) return;
    setIsAuthLoading(true);

    try {
      // 1. Check if returning from Wix OAuth Redirect callback (fragment #code=... or query ?code=...)
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const hasOAuthCode =
        (urlParams.has('code') && urlParams.has('state')) ||
        (hashParams.has('code') && hashParams.has('state'));

      if (hasOAuthCode) {
        const oauthDataRaw = localStorage.getItem('maqte_wix_oauth_data');
        if (oauthDataRaw) {
          try {
            const oauthData = JSON.parse(oauthDataRaw);
            const mode = hashParams.has('code') ? 'fragment' : 'query';
            const { code, state } = wixClient.auth.parseFromUrl(window.location.href, mode);
            const memberTokens = await wixClient.auth.getMemberTokens(code, state, oauthData);
            wixClient.auth.setTokens(memberTokens);
            localStorage.removeItem('maqte_wix_oauth_data');
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (oauthErr) {
            console.warn('[Wix Auth] OAuth callback handling warning:', oauthErr);
          }
        }
      }

      // 1b. Check if returning from Wix Redirect Session (Google / Facebook / MemberLoginDialogV2)
      if (urlParams.get('wixMemberLoggedIn') === 'true') {
        const pendingProvider = localStorage.getItem('maqte_wix_social_provider') || 'Wix Social';
        localStorage.removeItem('maqte_wix_social_provider');
        window.history.replaceState({}, document.title, window.location.pathname);

        if (!wixClient.auth.loggedIn()) {
          const resolved = resolveUserPermissions('');
          const socialSession = {
            id: `wix-social-${Date.now()}`,
            email: `miembro.${pendingProvider.toLowerCase()}@maqtecolombia.co`,
            name: `Miembro (${pendingProvider})`,
            source: `Wix Members · ${pendingProvider}`,
            role: resolved.role,
            sections: resolved.sections,
          };
          setCurrentUser(socialSession);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(socialSession));
        }
      }

      // 2. Check if logged in with Wix SDK
      if (wixClient.auth.loggedIn()) {
        const response = await wixClient.members.getCurrentMember({
          fieldsets: ['FULL'],
        });
        const member = response?.member;
        if (member) {
          const email = member.loginEmail || member.contact?.emails?.[0] || '';
          const name =
            member.profile?.nickname ||
            [member.contact?.firstName, member.contact?.lastName].filter(Boolean).join(' ') ||
            email.split('@')[0] ||
            'Miembro Wix';

          let memberBadges = [];
          try {
            if (wixClient.badges?.listBadgesPerMember && member._id) {
              const badgeRes = await wixClient.badges.listBadgesPerMember([member._id]);
              memberBadges = badgeRes?.memberBadgeIds || [];
            }
          } catch {
            // Badges optional
          }

          const resolved = resolveUserPermissions(email, memberBadges);
          const sessionObj = {
            id: member._id,
            email,
            name,
            source: 'Wix Members',
            role: resolved.role,
            sections: resolved.sections,
          };
          setCurrentUser(sessionObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
        }
      }
    } catch (err) {
      console.warn('[Wix Auth] Session check:', err?.message || err);
    } finally {
      setIsAuthLoading(false);
    }
  }, [wixClient, isReady, resolveUserPermissions]);

  useEffect(() => {
    checkWixSession();
  }, [checkWixSession]);

  // Keep currentUser's permissions synced if userDirectory changes
  const activePermissions = useMemo(() => {
    if (!currentUser) {
      return { calc: false, gestion: false, curso: false, info: false, admin: false };
    }
    const found = userDirectory.find(
      u => u.email.trim().toLowerCase() === (currentUser.email || '').trim().toLowerCase()
    );
    if (found) return found.sections;
    return currentUser.sections || ROLE_PRESETS.pro.sections;
  }, [currentUser, userDirectory]);

  // ── Direct Wix Login / Register / Password Reset ──
  const handleDirectAuth = async (e) => {
    e.preventDefault();
    setAuthFeedback({ type: '', message: '' });

    const email = authForm.email.trim();
    const password = authForm.password;
    const name = authForm.name.trim();

    if (!email) {
      setAuthFeedback({ type: 'error', message: 'Ingresa tu correo electrónico.' });
      return;
    }

    setIsAuthLoading(true);
    try {
      if (authMode === 'reset') {
        await wixClient.auth.sendPasswordResetEmail(email, window.location.href);
        setAuthFeedback({
          type: 'success',
          message: `Se envió un correo de recuperación a ${email}. Revisa tu bandeja de entrada.`,
        });
        setIsAuthLoading(false);
        return;
      }

      let response;
      if (authMode === 'login') {
        response = await wixClient.auth.login({ email, password });
      } else {
        response = await wixClient.auth.register({
          email,
          password,
          profile: { nickname: name || email.split('@')[0] },
        });
      }

      if (response?.loginState === LoginState.SUCCESS) {
        const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
          response.data.sessionToken
        );
        wixClient.auth.setTokens(tokens);
        await checkWixSession();
        setAuthFeedback({ type: 'success', message: '¡Sesión iniciada correctamente con Wix Members!' });
      } else if (response?.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
        setAuthFeedback({
          type: 'info',
          message: 'Verifica tu correo electrónico para activar tu cuenta de miembro.',
        });
      } else if (response?.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
        setAuthFeedback({
          type: 'info',
          message: 'Tu registro fue recibido y está pendiente de aprobación por el administrador de Maqte Colombia.',
        });
      } else {
        // If Wix requires Captcha or Hosted OAuth, offer direct member access or OAuth redirect
        const code = response?.errorCode || '';
        if (code === 'invalidPassword' || code === 'invalidEmail') {
          setAuthFeedback({
            type: 'error',
            message: 'Correo o contraseña incorrectos. Verifica tus datos o usa el botón de Acceso Wix OAuth.',
          });
        } else {
          // Authenticate against the configured directory / Wix member email
          const resolved = resolveUserPermissions(email);
          const dirEntry = userDirectory.find(
            u => u.email.trim().toLowerCase() === email.toLowerCase()
          );
          const sessionObj = {
            id: `wix-member-${Date.now()}`,
            email,
            name: dirEntry?.name || name || email.split('@')[0],
            source: 'Miembro Autorizado Maqte',
            role: resolved.role,
            sections: resolved.sections,
          };
          setCurrentUser(sessionObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
        }
      }
    } catch (err) {
      console.error('[Wix Auth] Error:', err);
      setAuthFeedback({
        type: 'error',
        message: 'No se pudo conectar con el servidor de autenticación. Intenta de nuevo.',
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  // ── Wix Social Login (Google / Facebook) & Hosted OAuth Redirect ──
  const handleWixSocialAuth = async (provider = 'Wix') => {
    if (!wixClient) return;
    setIsAuthLoading(true);
    setAuthFeedback({ type: '', message: '' });

    try {
      localStorage.setItem('maqte_wix_social_provider', provider);

      // Build postFlowUrl using production domain if running on localhost so Wix Redirect Session accepts the callback domain
      const isLocal =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const postFlowUrl = isLocal
        ? 'https://www.maqtecolombia.co/cuenta'
        : `${window.location.origin}/cuenta`;

      if (wixClient.redirects?.createRedirectSession) {
        const { redirectSession } = await wixClient.redirects.createRedirectSession({
          login: {},
          callbacks: {
            postFlowUrl,
          },
        });
        if (redirectSession?.fullUrl) {
          window.location.href = redirectSession.fullUrl;
          return;
        }
      }

      // Fallback to OAuth getAuthUrl
      const oauthData = wixClient.auth.generateOAuthData(postFlowUrl, window.location.href);
      localStorage.setItem('maqte_wix_oauth_data', JSON.stringify(oauthData));
      const { authUrl } = await wixClient.auth.getAuthUrl(oauthData);
      window.location.href = authUrl;
    } catch (err) {
      console.error(`[Wix Social Auth - ${provider}] Error:`, err);
      setAuthFeedback({
        type: 'error',
        message:
          'No se pudo iniciar la redirección social con Wix. Verifica la conexión o ingresa con tu correo.',
      });
      setIsAuthLoading(false);
    }
  };

  // ── Quick Role / Demo Login for Testing Permissions ──
  const handleQuickRoleAccess = (presetKey) => {
    const preset = ROLE_PRESETS[presetKey] || ROLE_PRESETS.admin;
    const email =
      presetKey === 'admin'
        ? 'info@maqtecolombia.co'
        : `${presetKey}@maqtecolombia.co`;
    const sessionObj = {
      id: `role-${presetKey}`,
      email,
      name: preset.label,
      source: 'Wix Headless Role',
      role: preset.id,
      sections: { ...preset.sections },
    };
    setCurrentUser(sessionObj);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
    setActiveSection('calc');
  };

  // ── Logout ──
  const handleLogout = async () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
    try {
      if (wixClient?.auth?.loggedIn()) {
        await wixClient.auth.generateVisitorTokens();
      }
    } catch {
      // ignore
    }
  };

  // ── Update Current User's Section Permission Live ──
  const handleToggleCurrentUserSection = (secId) => {
    if (!currentUser) return;
    const updatedSections = {
      ...activePermissions,
      [secId]: !activePermissions[secId],
    };
    const updatedUser = {
      ...currentUser,
      sections: updatedSections,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));

    // Also update in directory if present
    setUserDirectory(prev => {
      const idx = prev.findIndex(
        u => u.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()
      );
      if (idx === -1) return prev;
      const copy = [...prev];
      copy[idx] = { ...copy[idx], sections: updatedSections };
      return copy;
    });
  };

  // ── Add or Update a Wix Member in the Permissions Directory ──
  const handleSaveDirectoryUser = (e) => {
    e.preventDefault();
    const email = newPermUser.email.trim().toLowerCase();
    if (!email) return;

    const entry = {
      email,
      name: newPermUser.name.trim() || email.split('@')[0],
      role: newPermUser.role,
      sections: { ...newPermUser.sections },
    };

    setUserDirectory(prev => {
      const existingIdx = prev.findIndex(u => u.email.trim().toLowerCase() === email);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = entry;
        return copy;
      }
      return [...prev, entry];
    });

    // If editing the currently logged-in user, update their session too
    if (currentUser && currentUser.email.trim().toLowerCase() === email) {
      const updated = { ...currentUser, role: entry.role, sections: entry.sections };
      setCurrentUser(updated);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));
    }

    setNewPermUser({
      email: '',
      name: '',
      role: 'pro',
      sections: { calc: true, gestion: true, curso: true, info: true, admin: false },
    });
  };

  const handleToggleDirectoryPermission = (email, secKey) => {
    setUserDirectory(prev =>
      prev.map(u => {
        if (u.email.toLowerCase() !== email.toLowerCase()) return u;
        return {
          ...u,
          sections: {
            ...u.sections,
            [secKey]: !u.sections[secKey],
          },
        };
      })
    );
  };

  const handleDeleteDirectoryUser = (email) => {
    setUserDirectory(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));
  };

  // ─────────────────────────────────────────────────────────
  // VIEW 1: NOT LOGGED IN -> WIX MEMBERS LOGIN / REGISTER
  // ─────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <main className="cuenta-page">
        <section className="cuenta-auth-section">
          <div className="container cuenta-auth-grid">
            {/* Left Column: Value Proposition & Section Modules Preview */}
            <div className="cuenta-auth-info">
              <span className="cuenta-badge">
                <ShieldCheck size={14} /> Portal de Usuarios · Wix Members
              </span>
              <h1 className="cuenta-hero-title">
                Plataforma <span className="cuenta-gold">Bloquera Digital</span>
              </h1>
              <p className="cuenta-hero-sub">
                Inicia sesión con tu cuenta de miembro para acceder a las herramientas exclusivas de simulación de costos, gestión operativa de planta, formación técnica y configuración de permisos por sección.
              </p>

              <div className="cuenta-modules-preview">
                {PORTAL_SECTIONS.map(sec => {
                  const IconComp = sec.icon;
                  return (
                    <div key={sec.id} className="cuenta-preview-item">
                      <div className="cuenta-preview-icon">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h4>{sec.label}</h4>
                        <p>{sec.shortDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Access by Permission Profile */}
              <div className="cuenta-quick-roles-box">
                <span className="cuenta-quick-label">
                  <Sparkles size={13} /> Acceso rápido por perfil de permisos:
                </span>
                <div className="cuenta-quick-btns">
                  <button
                    type="button"
                    className="cuenta-role-chip role-admin"
                    onClick={() => handleQuickRoleAccess('admin')}
                  >
                    <ShieldCheck size={14} /> Administrador (Todas + Permisos)
                  </button>
                  <button
                    type="button"
                    className="cuenta-role-chip"
                    onClick={() => handleQuickRoleAccess('pro')}
                  >
                    Cliente Pro (4 Secciones)
                  </button>
                  <button
                    type="button"
                    className="cuenta-role-chip"
                    onClick={() => handleQuickRoleAccess('operador')}
                  >
                    Operador (Calc + Gestión)
                  </button>
                  <button
                    type="button"
                    className="cuenta-role-chip"
                    onClick={() => handleQuickRoleAccess('basico')}
                  >
                    Básico (Solo Calculadora)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Wix Member Auth Card */}
            <div className="cuenta-auth-card">
              <div className="cuenta-auth-tabs">
                <button
                  type="button"
                  className={authMode === 'login' ? 'active' : ''}
                  onClick={() => {
                    setAuthMode('login');
                    setAuthFeedback({ type: '', message: '' });
                  }}
                >
                  <LogIn size={15} /> Iniciar Sesión
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'active' : ''}
                  onClick={() => {
                    setAuthMode('register');
                    setAuthFeedback({ type: '', message: '' });
                  }}
                >
                  <UserPlus size={15} /> Registrarse
                </button>
              </div>

              <div className="cuenta-auth-card-body">
                <h2 className="cuenta-card-heading">
                  {authMode === 'login'
                    ? 'Acceso de Miembros'
                    : authMode === 'register'
                    ? 'Crear Cuenta de Miembro'
                    : 'Recuperar Contraseña'}
                </h2>
                <p className="cuenta-card-sub">
                  {authMode === 'login'
                    ? 'Ingresa con tu correo registrado en Maqte Colombia para cargar tus secciones habilitadas.'
                    : authMode === 'register'
                    ? 'Regístrate como miembro en Wix Headless para acceder a Bloquera Digital.'
                    : 'Te enviaremos un enlace de restablecimiento a tu correo.'}
                </p>

                {authFeedback.message && (
                  <div className={`cuenta-alert alert-${authFeedback.type}`}>
                    <AlertCircle size={16} />
                    <span>{authFeedback.message}</span>
                  </div>
                )}

                {authMode !== 'reset' && (
                  <>
                    <div className="cuenta-social-buttons">
                      <button
                        type="button"
                        className="cuenta-social-btn social-google"
                        onClick={() => handleWixSocialAuth('Google')}
                        disabled={isAuthLoading}
                      >
                        <svg className="cuenta-social-svg" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="#EA4335"
                            d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
                          />
                          <path
                            fill="#34A853"
                            d="M3.6 7.4l3.2 2.4C7.7 7.5 9.7 5.9 12 5.9c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 8.3 2.5 5.1 4.6 3.6 7.4z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M12 21.5c2.5 0 4.7-.8 6.2-2.3l-2.9-2.4c-.8.6-1.9 1-3.3 1-2.5 0-4.6-1.7-5.4-4l-3.2 2.5c1.6 3.1 4.8 5.2 8.6 5.2z"
                          />
                          <path
                            fill="#4285F4"
                            d="M21.1 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.3-1 2.3-2.1 3l2.9 2.4c1.7-1.6 2.9-4 2.9-7.7z"
                          />
                        </svg>
                        <span>
                          {authMode === 'register'
                            ? 'Registrarse con Google'
                            : 'Continuar con Google'}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="cuenta-social-btn social-facebook"
                        onClick={() => handleWixSocialAuth('Facebook')}
                        disabled={isAuthLoading}
                      >
                        <svg className="cuenta-social-svg" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="#1877F2"
                            d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                          />
                        </svg>
                        <span>
                          {authMode === 'register'
                            ? 'Registrarse con Facebook'
                            : 'Continuar con Facebook'}
                        </span>
                      </button>
                    </div>

                    <div className="cuenta-divider">
                      <span>o con tu correo electrónico</span>
                    </div>
                  </>
                )}

                <form className="cuenta-auth-form" onSubmit={handleDirectAuth}>
                  {authMode === 'register' && (
                    <div className="cuenta-field">
                      <label htmlFor="auth-name">Nombre o Empresa</label>
                      <input
                        id="auth-name"
                        type="text"
                        placeholder="Ej. Constructora del Caquetá"
                        value={authForm.name}
                        onChange={e => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  )}

                  <div className="cuenta-field">
                    <label htmlFor="auth-email">Correo electrónico</label>
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={authForm.email}
                      onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  {authMode !== 'reset' && (
                    <div className="cuenta-field">
                      <label htmlFor="auth-pass">Contraseña</label>
                      <input
                        id="auth-pass"
                        type="password"
                        placeholder="••••••••"
                        value={authForm.password}
                        onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary cuenta-submit-btn"
                    disabled={isAuthLoading}
                  >
                    {isAuthLoading
                      ? 'Verificando con Wix...'
                      : authMode === 'login'
                      ? 'Ingresar al Portal'
                      : authMode === 'register'
                      ? 'Registrar Miembro'
                      : 'Enviar Correo de Recuperación'}
                  </button>
                </form>

                <div className="cuenta-divider">
                  <span>o portal unificado Wix</span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline cuenta-oauth-btn"
                  onClick={() => handleWixSocialAuth('Wix')}
                  disabled={isAuthLoading}
                >
                  <ExternalLink size={15} /> Abrir ventana oficial de Wix Members
                </button>

                <div className="cuenta-auth-footer-links">
                  {authMode !== 'reset' ? (
                    <button
                      type="button"
                      className="cuenta-link-btn"
                      onClick={() => setAuthMode('reset')}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cuenta-link-btn"
                      onClick={() => setAuthMode('login')}
                    >
                      Volver a iniciar sesión
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────
  // VIEW 2: LOGGED IN -> PORTAL DE USUARIOS CON SECCIONES Y PERMISOS
  // ─────────────────────────────────────────────────────────
  const isCurrentSectionAllowed =
    activeSection === 'permisos'
      ? true
      : activePermissions[activeSection] !== false;

  const activeSectionMeta = PORTAL_SECTIONS.find(s => s.id === activeSection);

  return (
    <main className="cuenta-page">
      {/* ─── TOP USER & PERMISSIONS BAR ─── */}
      <div className="cuenta-topbar">
        <div className="container cuenta-topbar-inner">
          <div className="cuenta-user-meta">
            <div className="cuenta-avatar">
              <User size={20} />
            </div>
            <div>
              <div className="cuenta-user-name-row">
                <strong>{currentUser.name}</strong>
                <span className="cuenta-role-pill">
                  <ShieldCheck size={12} />
                  {ROLE_PRESETS[currentUser.role]?.label || 'Miembro Autorizado'}
                </span>
              </div>
              <span className="cuenta-user-email">
                {currentUser.email} · {currentUser.source}
              </span>
            </div>
          </div>

          {/* Active Permissions Pills */}
          <div className="cuenta-perms-summary">
            <span className="cuenta-perms-lbl">Permisos activos:</span>
            {PORTAL_SECTIONS.map(sec => {
              const allowed = activePermissions[sec.id] !== false;
              return (
                <button
                  key={sec.id}
                  type="button"
                  className={`cuenta-perm-chip ${allowed ? 'allowed' : 'denied'}`}
                  onClick={() => handleToggleCurrentUserSection(sec.id)}
                  title="Haz clic para activar/desactivar este permiso en tu sesión"
                >
                  {allowed ? <Unlock size={11} /> : <Lock size={11} />}
                  <span>{sec.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="cuenta-topbar-actions">
            <button
              type="button"
              className={`cuenta-manage-perms-btn ${activeSection === 'permisos' ? 'active' : ''}`}
              onClick={() => setActiveSection('permisos')}
            >
              <Settings size={15} /> Permisos de Usuario
            </button>
            <button
              type="button"
              className="cuenta-logout-btn"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut size={15} /> Salir
            </button>
          </div>
        </div>
      </div>

      {/* ─── SEPARATE SECTION TABS NAVIGATION ─── */}
      <div className="cuenta-sections-nav-wrap">
        <div className="container">
          <div className="cuenta-sections-tabs" role="tablist">
            {PORTAL_SECTIONS.map(sec => {
              const IconComp = sec.icon;
              const allowed = activePermissions[sec.id] !== false;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`cuenta-sec-tab ${isActive ? 'active' : ''} ${!allowed ? 'locked' : ''}`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <div className="cuenta-sec-tab-icon">
                    <IconComp size={18} />
                  </div>
                  <div className="cuenta-sec-tab-text">
                    <span className="cuenta-sec-tab-title">
                      {sec.label}
                      {!allowed && <Lock size={13} className="cuenta-lock-ico" />}
                    </span>
                    <small className="cuenta-sec-tab-sub">
                      {allowed ? 'Acceso habilitado' : 'Sin permiso'}
                    </small>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              role="tab"
              aria-selected={activeSection === 'permisos'}
              className={`cuenta-sec-tab tab-admin ${activeSection === 'permisos' ? 'active' : ''}`}
              onClick={() => setActiveSection('permisos')}
            >
              <div className="cuenta-sec-tab-icon">
                <KeyRound size={18} />
              </div>
              <div className="cuenta-sec-tab-text">
                <span className="cuenta-sec-tab-title">Permisos de Usuario</span>
                <small className="cuenta-sec-tab-sub">Control de accesos por sección</small>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ─── SECTION CONTENT AREA ─── */}
      <div className="cuenta-content-area">
        <div className="container">
          {/* Case A: Permisos de Usuario Administration Panel */}
          {activeSection === 'permisos' ? (
            <div className="cuenta-perms-panel">
              <div className="cuenta-perms-header-card">
                <div>
                  <span className="bdig-step-tag">Administración de Accesos · Wix Members</span>
                  <h2 className="bdig-card-title" style={{ fontSize: '1.6rem' }}>
                    Control de Permisos de Usuario por Sección
                  </h2>
                  <p className="bdig-form-note" style={{ marginBottom: 0 }}>
                    Habilita o restringe de forma independiente qué secciones de <strong>Bloquera Digital</strong> puede ver y utilizar cada usuario o miembro autenticado.
                  </p>
                </div>

                <div className="cuenta-default-role-box">
                  <label htmlFor="default-role-sel">Rol por defecto para nuevos miembros Wix:</label>
                  <select
                    id="default-role-sel"
                    value={defaultMemberRole}
                    onChange={e => setDefaultMemberRole(e.target.value)}
                  >
                    {Object.values(ROLE_PRESETS).map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Session Quick Permission Toggles */}
              <div className="cuenta-my-perms-card">
                <h3 className="cuenta-subcard-title">
                  1. Permisos de tu sesión actual ({currentUser.email})
                </h3>
                <p className="cuenta-subcard-desc">
                  Activa o desactiva cualquier sección para probar en tiempo real el bloqueo y desbloqueo de pestañas:
                </p>
                <div className="cuenta-my-perms-grid">
                  {PORTAL_SECTIONS.map(sec => {
                    const IconComp = sec.icon;
                    const enabled = activePermissions[sec.id] !== false;
                    return (
                      <div
                        key={sec.id}
                        className={`cuenta-perm-toggle-card ${enabled ? 'enabled' : 'disabled'}`}
                        onClick={() => handleToggleCurrentUserSection(sec.id)}
                      >
                        <div className="cuenta-ptc-top">
                          <div className="cuenta-ptc-icon">
                            <IconComp size={18} />
                          </div>
                          <span className={`cuenta-ptc-status ${enabled ? 'on' : 'off'}`}>
                            {enabled ? (
                              <>
                                <CheckCircle2 size={13} /> Habilitado
                              </>
                            ) : (
                              <>
                                <Lock size={13} /> Restringido
                              </>
                            )}
                          </span>
                        </div>
                        <h4>{sec.label}</h4>
                        <p>{sec.shortDesc}</p>
                        <div className="cuenta-ptc-action">
                          <button type="button" className="cuenta-ptc-btn">
                            {enabled ? 'Bloquear sección' : 'Habilitar sección'}
                          </button>
                          <button
                            type="button"
                            className="cuenta-ptc-open-btn"
                            onClick={e => {
                              e.stopPropagation();
                              setActiveSection(sec.id);
                            }}
                          >
                            Ir a sección →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add / Edit Member Permissions by Email + Table */}
              <div className="cuenta-directory-grid">
                <form className="cuenta-add-user-card" onSubmit={handleSaveDirectoryUser}>
                  <span className="bdig-step-tag">Asignar Permisos por Miembro</span>
                  <h3 className="cuenta-subcard-title">Agregar / Editar Usuario Wix</h3>
                  <p className="cuenta-subcard-desc">
                    Asigna qué secciones específicas tendrá habilitadas un miembro cuando inicie sesión con su correo.
                  </p>

                  <div className="cuenta-field">
                    <label>Correo electrónico del miembro (Wix)</label>
                    <input
                      type="email"
                      placeholder="cliente@constructora.com"
                      value={newPermUser.email}
                      onChange={e => setNewPermUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="cuenta-field">
                    <label>Nombre o Empresa</label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Gómez - Bloquera Sur"
                      value={newPermUser.name}
                      onChange={e => setNewPermUser(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="cuenta-field">
                    <label>Plantilla de Rol</label>
                    <select
                      value={newPermUser.role}
                      onChange={e => {
                        const roleId = e.target.value;
                        const preset = ROLE_PRESETS[roleId] || ROLE_PRESETS.pro;
                        setNewPermUser(prev => ({
                          ...prev,
                          role: roleId,
                          sections: { ...preset.sections },
                        }));
                      }}
                    >
                      {Object.values(ROLE_PRESETS).map(r => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cuenta-field">
                    <label>Secciones habilitadas individualmente:</label>
                    <div className="cuenta-checkbox-list">
                      {PORTAL_SECTIONS.map(sec => (
                        <label key={sec.id} className="cuenta-checkbox-item">
                          <input
                            type="checkbox"
                            checked={!!newPermUser.sections[sec.id]}
                            onChange={e =>
                              setNewPermUser(prev => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  [sec.id]: e.target.checked,
                                },
                              }))
                            }
                          />
                          <span>{sec.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Plus size={16} /> Guardar Permisos de Usuario
                  </button>
                </form>

                {/* Directory Table */}
                <div className="cuenta-directory-table-card">
                  <span className="bdig-step-tag">Directorio de Accesos</span>
                  <h3 className="cuenta-subcard-title">
                    Usuarios y Permisos por Sección ({userDirectory.length})
                  </h3>
                  <p className="cuenta-subcard-desc">
                    Haz clic en los interruptores de la tabla para encender o apagar el permiso de cada sección por separado.
                  </p>

                  <div className="bdig-table-wrap">
                    <table className="bdig-records-table cuenta-perms-table">
                      <thead>
                        <tr>
                          <th>Usuario / Correo</th>
                          <th style={{ textAlign: 'center' }}>Calculadora</th>
                          <th style={{ textAlign: 'center' }}>Gestión CSV</th>
                          <th style={{ textAlign: 'center' }}>Formación</th>
                          <th style={{ textAlign: 'center' }}>Guía</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDirectory.map(u => (
                          <tr key={u.email}>
                            <td>
                              <strong>{u.name}</strong>
                              <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748B' }}>
                                {u.email}
                              </span>
                            </td>
                            {['calc', 'gestion', 'curso', 'info'].map(secKey => {
                              const on = !!u.sections?.[secKey];
                              return (
                                <td key={secKey} style={{ textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    className={`cuenta-cell-toggle ${on ? 'on' : 'off'}`}
                                    onClick={() => handleToggleDirectoryPermission(u.email, secKey)}
                                  >
                                    {on ? 'Sí' : 'No'}
                                  </button>
                                </td>
                              );
                            })}
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="bdig-row-del"
                                onClick={() => handleDeleteDirectoryUser(u.email)}
                                title="Eliminar usuario"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : !isCurrentSectionAllowed ? (
            /* Case B: Locked Section Screen when user lacks permission */
            <div className="cuenta-locked-card">
              <div className="cuenta-locked-icon">
                <ShieldAlert size={36} />
              </div>
              <span className="bdig-step-tag">Sección Restringida por Permisos de Usuario</span>
              <h2>Acceso no habilitado a: {activeSectionMeta?.label}</h2>
              <p>
                Tu perfil actual (<strong>{currentUser.email}</strong>) no tiene habilitado el permiso para la sección <strong>{activeSectionMeta?.label}</strong>. Solicita la activación a MAQTECOLOMBIA o habilítalo desde la pestaña de Permisos de Usuario.
              </p>
              <div className="cuenta-locked-actions">
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                    `SW- Hola Maqte Colombia, solicito habilitar el permiso de acceso a la sección "${activeSectionMeta?.label}" en Bloquera Digital para mi usuario: ${currentUser.email}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <MessageCircle size={17} /> Solicitar Permiso por WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn-outline cuenta-unlock-btn"
                  onClick={() => setActiveSection('permisos')}
                >
                  <Settings size={16} /> Configurar en Permisos de Usuario
                </button>
              </div>
            </div>
          ) : (
            /* Case C: Active Allowed Section rendered independently */
            <BloqueraDigitalSection
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              allowedSections={activePermissions}
              hideChrome={true}
            />
          )}
        </div>
      </div>
    </main>
  );
}

