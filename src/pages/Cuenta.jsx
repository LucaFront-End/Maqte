import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User, Lock, Unlock, ShieldCheck, LogIn, UserPlus, LogOut,
  Calculator, ClipboardList, GraduationCap, HelpCircle,
  AlertCircle, MessageCircle, ExternalLink, RefreshCw, ShieldAlert,
  Sparkles, Eye, PlayCircle
} from 'lucide-react';
import { LoginState } from '@wix/sdk';
import { useWixClient } from '../hooks/useWixClient';
import { BRAND } from '../data/content';
import BloqueraDigitalSection from '../components/BloqueraDigitalSection';
import BenefitSalesLanding from '../components/BenefitSalesLanding';
import './Cuenta.css';

const LOCAL_SESSION_KEY = 'maqte_portal_active_user_v2';
const WIX_MEMBER_PERMS_COLLECTION =
  import.meta.env.VITE_WIX_MEMBER_PERMS_COLLECTION || 'PermisosMiembros';

export const ROLE_PRESETS = {
  visitante: {
    id: 'visitante',
    label: 'Visitante (Sin registro)',
    sections: { calc: true, gestion: false, curso: false, info: true },
  },
  registrado_basico: {
    id: 'registrado_basico',
    label: 'Miembro Registrado (Permiso Básico)',
    sections: { calc: true, gestion: false, curso: false, info: true },
  },
  operador: {
    id: 'operador',
    label: 'Miembro Operador (Permiso Gestión)',
    sections: { calc: true, gestion: true, curso: false, info: true },
  },
  pro: {
    id: 'pro',
    label: 'Miembro Bloquera Pro (Acceso Total)',
    sections: { calc: true, gestion: true, curso: true, info: true },
  },
  admin: {
    id: 'admin',
    label: 'Administrador Maqte Colombia',
    sections: { calc: true, gestion: true, curso: true, info: true },
  },
};

const PORTAL_SECTIONS = [
  {
    id: 'calc',
    label: 'Calculadora de Costos',
    shortDesc: 'Simulación de costos por bloque, mezclas y rentabilidad por lote',
    requiredPermLabel: 'Acceso público y miembros',
    icon: Calculator,
  },
  {
    id: 'gestion',
    label: 'Gestión de Bloquera',
    shortDesc: 'Registro de ventas, compras, gastos, producción y respaldo CSV',
    requiredPermLabel: 'Permiso Miembro Gestión / Pro',
    icon: ClipboardList,
  },
  {
    id: 'curso',
    label: 'Centro de Formación',
    shortDesc: '8 módulos técnicos del curso de fabricación de bloques Maqte',
    requiredPermLabel: 'Permiso Miembro Formación / Pro',
    icon: GraduationCap,
  },
  {
    id: 'info',
    label: 'Guía de Uso',
    shortDesc: 'Guía oficial de bloques H10–H20 y metodología de cálculo',
    requiredPermLabel: 'Acceso público y miembros',
    icon: HelpCircle,
  },
];

// Authorized emails pre-configured with full member permissions
const AUTHORIZED_MEMBER_EMAILS = {
  'info@maqtecolombia.co': 'admin',
  'ventas@maqtecolombia.co': 'admin',
  'pro@maqtecolombia.co': 'pro',
  'operador@maqtecolombia.co': 'operador',
};

export default function Cuenta() {
  const { wixClient, isReady } = useWixClient();

  // ── Auth & Member State ──
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState({ type: '', message: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Active logged-in member (from Wix Members)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Currently selected portal section tab
  const [activeSection, setActiveSection] = useState('calc');
  // Toggle to preview the Sales Landing of each of the 3 benefits even when unlocked
  const [viewSalesLanding, setViewSalesLanding] = useState(false);

  // Resolve permissions for a Wix Member using Wix Badges + Wix CMS PermisosMiembros + pre-authorized emails
  const resolveMemberPermissions = useCallback(
    async (email, wixBadges = []) => {
      const normalizedEmail = (email || '').trim().toLowerCase();

      // 1. Check Wix CMS Collection 'PermisosMiembros' if available
      if (normalizedEmail && wixClient?.items?.query) {
        try {
          const queryPromise = wixClient.items
            .query(WIX_MEMBER_PERMS_COLLECTION)
            .eq('email', normalizedEmail)
            .limit(1)
            .find();
          const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1200));
          const cmsRes = await Promise.race([queryPromise, timeoutPromise]);
          const cmsItem = cmsRes?.items?.[0];
          if (cmsItem) {
            return {
              role: cmsItem.rol || 'pro',
              roleLabel: cmsItem.nombreRol || 'Miembro Autorizado Wix',
              sections: {
                calc: cmsItem.calc !== false,
                gestion: Boolean(cmsItem.gestion),
                curso: Boolean(cmsItem.curso),
                info: cmsItem.info !== false,
              },
            };
          }
        } catch {
          // CMS collection optional
        }
      }

      // 2. Check Wix Member Badges assigned in Wix Dashboard
      const badgeSlugs = wixBadges.map(b =>
        (typeof b === 'string' ? b : b?.slug || b?.title || '').toLowerCase()
      );
      if (badgeSlugs.some(s => s.includes('admin'))) {
        return {
          role: 'admin',
          roleLabel: ROLE_PRESETS.admin.label,
          sections: { ...ROLE_PRESETS.admin.sections },
        };
      }
      if (
        badgeSlugs.some(
          s => s.includes('pro') || s.includes('cliente') || s.includes('bloquera') || s.includes('vip')
        )
      ) {
        return {
          role: 'pro',
          roleLabel: ROLE_PRESETS.pro.label,
          sections: { ...ROLE_PRESETS.pro.sections },
        };
      }
      if (badgeSlugs.some(s => s.includes('operador') || s.includes('gestion'))) {
        return {
          role: 'operador',
          roleLabel: ROLE_PRESETS.operador.label,
          sections: { ...ROLE_PRESETS.operador.sections },
        };
      }
      if (badgeSlugs.some(s => s.includes('curso') || s.includes('formacion'))) {
        return {
          role: 'curso',
          roleLabel: 'Miembro Formación Activa',
          sections: { calc: true, gestion: false, curso: true, info: true },
        };
      }

      // 3. Check pre-authorized corporate / client emails
      if (AUTHORIZED_MEMBER_EMAILS[normalizedEmail]) {
        const presetKey = AUTHORIZED_MEMBER_EMAILS[normalizedEmail];
        const preset = ROLE_PRESETS[presetKey] || ROLE_PRESETS.pro;
        return {
          role: preset.id,
          roleLabel: preset.label,
          sections: { ...preset.sections },
        };
      }
      if (normalizedEmail.endsWith('@maqtecolombia.co')) {
        return {
          role: 'pro',
          roleLabel: ROLE_PRESETS.pro.label,
          sections: { ...ROLE_PRESETS.pro.sections },
        };
      }

      // 4. Default for registered member without special Wix Badge/Permission yet:
      // Calculator & Guide unlocked; Gestión & Centro de Formación locked until permission is granted in Wix
      return {
        role: 'registrado_basico',
        roleLabel: ROLE_PRESETS.registrado_basico.label,
        sections: { ...ROLE_PRESETS.registrado_basico.sections },
      };
    },
    [wixClient]
  );

  // ── Check Wix Member Session on Mount ──
  const checkWixSession = useCallback(async () => {
    if (!isReady || !wixClient) return;
    setIsAuthLoading(true);

    try {
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
            console.warn('[Wix Auth] OAuth callback warning:', oauthErr);
          }
        }
      }

      // Check if logged in with Wix SDK
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

          const resolved = await resolveMemberPermissions(email, memberBadges);
          const sessionObj = {
            id: member._id,
            email,
            name,
            source: 'Wix Members',
            role: resolved.role,
            roleLabel: resolved.roleLabel,
            sections: resolved.sections,
          };
          setCurrentUser(sessionObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
          setShowAuthModal(false);
        }
      }
    } catch (err) {
      console.warn('[Wix Auth] Session check:', err?.message || err);
    } finally {
      setIsAuthLoading(false);
    }
  }, [wixClient, isReady, resolveMemberPermissions]);

  useEffect(() => {
    checkWixSession();
  }, [checkWixSession]);

  // Active permissions based on whether the user is logged in and what Wix Member permissions they have
  const activePermissions = useMemo(() => {
    if (!currentUser) {
      return ROLE_PRESETS.visitante.sections;
    }
    return currentUser.sections || ROLE_PRESETS.registrado_basico.sections;
  }, [currentUser]);

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
        setAuthFeedback({ type: 'success', message: '¡Sesión iniciada correctamente!' });
        setShowAuthModal(false);
      } else if (response?.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
        setAuthFeedback({
          type: 'info',
          message: 'Verifica tu correo electrónico para activar tu cuenta de miembro.',
        });
      } else if (response?.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
        setAuthFeedback({
          type: 'info',
          message:
            'Tu registro fue recibido y está pendiente de aprobación de permisos de miembro por MAQTECOLOMBIA.',
        });
      } else {
        const code = response?.errorCode || '';
        if (code === 'invalidPassword' || code === 'invalidEmail') {
          setAuthFeedback({
            type: 'error',
            message: 'Correo o contraseña incorrectos. Verifica tus datos.',
          });
        } else {
          // Resolve member permissions from Wix CMS / badges / email
          const resolved = await resolveMemberPermissions(email, []);
          const sessionObj = {
            id: `wix-member-${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            source: 'Wix Members',
            role: resolved.role,
            roleLabel: resolved.roleLabel,
            sections: resolved.sections,
          };
          setCurrentUser(sessionObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionObj));
          setShowAuthModal(false);
        }
      }
    } catch (err) {
      console.error('[Wix Auth] Error:', err);
      setAuthFeedback({
        type: 'error',
        message: 'No se pudo autenticar con Wix. Verifica tus credenciales o usa el acceso con Google/Facebook.',
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

      const oauthData = wixClient.auth.generateOAuthData(postFlowUrl, window.location.href);
      localStorage.setItem('maqte_wix_oauth_data', JSON.stringify(oauthData));
      const { authUrl } = await wixClient.auth.getAuthUrl(oauthData);
      window.location.href = authUrl;
    } catch (err) {
      console.error(`[Wix Social Auth - ${provider}] Error:`, err);
      setAuthFeedback({
        type: 'error',
        message: 'No se pudo iniciar la redirección social con Wix. Intenta con tu correo.',
      });
      setIsAuthLoading(false);
    }
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

  const isCurrentSectionAllowed = activePermissions[activeSection] !== false;
  const activeSectionMeta = PORTAL_SECTIONS.find(s => s.id === activeSection);

  // Reusable Auth Card (rendered inside locked section or inside topbar login modal)
  const renderWixAuthCard = () => (
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
            ? 'Inicia sesión con tu cuenta registrada en Maqte Colombia para desbloquear las secciones según tus permisos de miembro.'
            : authMode === 'register'
            ? 'Regístrate como miembro en Wix para vincular tus permisos de acceso a Bloquera Digital.'
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
                  {authMode === 'register' ? 'Registrarse con Google' : 'Continuar con Google'}
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
                  {authMode === 'register' ? 'Registrarse con Facebook' : 'Continuar con Facebook'}
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
              ? 'Verificando permisos en Wix...'
              : authMode === 'login'
              ? 'Ingresar con mi Cuenta'
              : authMode === 'register'
              ? 'Registrarme como Miembro'
              : 'Enviar Correo de Recuperación'}
          </button>
        </form>

        <div className="cuenta-divider">
          <span>o ventana oficial de Wix</span>
        </div>

        <button
          type="button"
          className="btn btn-outline cuenta-oauth-btn"
          onClick={() => handleWixSocialAuth('Wix')}
          disabled={isAuthLoading}
        >
          <ExternalLink size={15} /> Acceder con Portal Wix Members
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
  );

  return (
    <main className="cuenta-page">
      {/* ─── TOP USER & MEMBER PERMISSIONS STATUS BAR ─── */}
      <div className="cuenta-topbar">
        <div className="container cuenta-topbar-inner">
          <div className="cuenta-user-meta">
            <div className="cuenta-avatar">
              <User size={20} />
            </div>
            <div>
              {currentUser ? (
                <>
                  <div className="cuenta-user-name-row">
                    <strong>{currentUser.name}</strong>
                    <span className="cuenta-role-pill">
                      <ShieldCheck size={12} />
                      {currentUser.roleLabel ||
                        ROLE_PRESETS[currentUser.role]?.label ||
                        'Miembro Registrado'}
                    </span>
                  </div>
                  <span className="cuenta-user-email">
                    {currentUser.email} · {currentUser.source}
                  </span>
                </>
              ) : (
                <>
                  <div className="cuenta-user-name-row">
                    <strong>Bloquera Digital · MAQTECOLOMBIA</strong>
                    <span className="cuenta-role-pill">
                      <Lock size={12} /> Modo Visitante
                    </span>
                  </div>
                  <span className="cuenta-user-email">
                    Inicia sesión con tu cuenta de miembro para desbloquear Gestión y Centro de Formación
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Read-only Member Permission Badges */}
          <div className="cuenta-perms-summary">
            <span className="cuenta-perms-lbl">Estado de acceso:</span>
            {PORTAL_SECTIONS.map(sec => {
              const allowed = activePermissions[sec.id] !== false;
              return (
                <span
                  key={sec.id}
                  className={`cuenta-perm-chip ${allowed ? 'allowed' : 'denied'}`}
                  title={
                    allowed
                      ? `${sec.label}: Acceso habilitado`
                      : `${sec.label}: Bloqueado (requiere permiso de miembro)`
                  }
                >
                  {allowed ? <Unlock size={11} /> : <Lock size={11} />}
                  <span>{sec.label.split(' ')[0]}</span>
                </span>
              );
            })}
          </div>

          <div className="cuenta-topbar-actions">
            {activeSection !== 'info' && isCurrentSectionAllowed && (
              <button
                type="button"
                className={`cuenta-manage-perms-btn ${viewSalesLanding ? 'active' : ''}`}
                onClick={() => setViewSalesLanding(prev => !prev)}
                title="Alternar entre la Landing Comercial de este Beneficio y la Herramienta"
              >
                {viewSalesLanding ? (
                  <>
                    <PlayCircle size={14} /> Abrir Herramienta
                  </>
                ) : (
                  <>
                    <Eye size={14} /> Ver Landing de Venta
                  </>
                )}
              </button>
            )}

            {currentUser ? (
              <>
                <button
                  type="button"
                  className="cuenta-manage-perms-btn"
                  onClick={checkWixSession}
                  title="Sincronizar permisos de miembro desde Wix"
                >
                  <RefreshCw size={14} /> Actualizar Permisos
                </button>
                <button
                  type="button"
                  className="cuenta-logout-btn"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut size={15} /> Salir
                </button>
              </>
            ) : (
              <button
                type="button"
                className="cuenta-manage-perms-btn active"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn size={15} /> Iniciar Sesión / Registrarse
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 4 SECTION TABS NAVIGATION ─── */}
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
                      {allowed ? 'Acceso habilitado' : 'Landing de Venta · Solo miembros'}
                    </small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION CONTENT AREA ─── */}
      <div className="cuenta-content-area">
        <div className="container">
          {activeSection !== 'info' && (!isCurrentSectionAllowed || viewSalesLanding) ? (
            /* Case A: Render Sales Landing for Benefit 01 (calc), 02 (gestion), or 03 (curso) */
            <BenefitSalesLanding
              benefitId={activeSection}
              isLocked={!isCurrentSectionAllowed}
              currentUser={currentUser}
              onOpenTool={
                isCurrentSectionAllowed ? () => setViewSalesLanding(false) : undefined
              }
              onSelectBenefit={id => {
                setActiveSection(id);
                setViewSalesLanding(true);
              }}
              onRequestLogin={checkWixSession}
              authCardElement={!currentUser ? renderWixAuthCard() : null}
            />
          ) : (
            /* Case B: Active Section is Allowed -> Render Interactive Tool */
            <BloqueraDigitalSection
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              allowedSections={activePermissions}
              hideChrome={true}
            />
          )}
        </div>
      </div>

      {/* ─── LOGIN / REGISTER MODAL (WHEN OPENED FROM TOPBAR) ─── */}
      {showAuthModal && !currentUser && (
        <div
          className="bdig-guide-modal-backdrop"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {renderWixAuthCard()}
          </div>
        </div>
      )}
    </main>
  );
}
