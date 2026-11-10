// =============================================================
// Wix CMS Integration Helper — Maqte Colombia
//
// Saves multi-step configurator leads ("¿Qué máquina necesito?")
// directly to Wix CMS (@wix/data) starting at Step 1 (contact data)
// and updates the same CMS record on the final step with the
// user's project parameters and recommended machine.
// =============================================================

import { createWixClient } from './wixClient';

export const LEADS_COLLECTION_ID =
  import.meta.env.VITE_WIX_LEADS_COLLECTION || 'CotizacionesMaquinaria';

const LOCAL_LEADS_KEY = 'maqte_cms_leads_v1';

function readLocalLeads() {
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalLeads(leads) {
  try {
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(leads));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Step 1: Creates the initial lead record immediately and syncs to Wix CMS
 * as soon as the user submits their contact information
 * (Nombre, Teléfono, Ciudad, País, Correo).
 */
export async function saveLeadStep1(contactData) {
  const wixClient = createWixClient();
  const timestamp = new Date().toISOString();
  const localId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const itemPayload = {
    nombre: contactData.nombre?.trim() || '',
    telefono: contactData.telefono?.trim() || '',
    ciudad: contactData.ciudad?.trim() || '',
    pais: contactData.pais?.trim() || 'Colombia',
    correo: contactData.correo?.trim() || '',
    etapa: 'Paso 1 - Datos de contacto',
    completado: false,
    fechaCreacion: timestamp,
    fechaActualizacion: timestamp,
    origen: 'Asesor Multi-Paso Maquinaria 2026',
  };

  // 1. Save immediately in local storage so Step 1 -> Step 2 is instantaneous
  const initialRecord = {
    _id: localId,
    wixId: null,
    syncedToWix: false,
    ...itemPayload,
  };
  const existing = readLocalLeads();
  writeLocalLeads([initialRecord, ...existing]);

  // 2. Sync to Wix CMS in background (with 2.5s timeout guard if awaited)
  let wixId = null;
  let syncedToWix = false;

  try {
    if (wixClient?.items?.insert) {
      const insertPromise = wixClient.items.insert(LEADS_COLLECTION_ID, itemPayload);
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1200));
      const inserted = await Promise.race([insertPromise, timeoutPromise]);
      wixId = inserted?._id || inserted?.item?._id || null;
      if (wixId) {
        syncedToWix = true;
        const current = readLocalLeads();
        const idx = current.findIndex(r => r._id === localId);
        if (idx !== -1) {
          current[idx] = { ...current[idx], _id: wixId, wixId, syncedToWix: true };
          writeLocalLeads(current);
        }
      }
    }
  } catch {
    // Fallback to local persistence if collection does not exist yet or permissions are restricted
  }

  return {
    id: wixId || localId,
    wixId,
    syncedToWix,
    record: { ...initialRecord, _id: wixId || localId, wixId, syncedToWix },
  };
}

/**
 * Final Step (Step 5 -> Step 6): Updates the existing lead record created in Step 1
 * with all the configurator answers (ladrillos/día, nivel de producción, presupuesto,
 * tipo de ladrillo) and the recommended machine.
 */
export async function updateLeadFinal(leadState, projectAnswers, recommendedMachine) {
  const wixClient = createWixClient();
  const timestamp = new Date().toISOString();

  const mergedPayload = {
    nombre: leadState.contact?.nombre?.trim() || '',
    telefono: leadState.contact?.telefono?.trim() || '',
    ciudad: leadState.contact?.ciudad?.trim() || '',
    pais: leadState.contact?.trim?.() || leadState.contact?.pais?.trim() || 'Colombia',
    correo: leadState.contact?.correo?.trim() || '',
    ladrillosPorDia: projectAnswers.dailyBricksLabel || '',
    ladrillosPorDiaId: projectAnswers.dailyBricks || '',
    nivelProduccion: projectAnswers.prodLevelLabel || '',
    nivelProduccionId: projectAnswers.prodLevel || '',
    presupuestoCOP: Number(projectAnswers.budgetCOP) || 0,
    presupuestoFormateado: projectAnswers.budgetFormatted || '',
    tipoLadrillo: projectAnswers.brickTypeLabel || '',
    tipoLadrilloId: projectAnswers.brickType || '',
    maquinaRecomendadaCodigo: recommendedMachine?.code || '',
    maquinaRecomendadaNombre: recommendedMachine?.name || '',
    maquinaRecomendadaPrecio: recommendedMachine?.price || '',
    etapa: 'Paso 6 - Enviado con éxito',
    completado: true,
    fechaCreacion: leadState.createdAt || timestamp,
    fechaActualizacion: timestamp,
    origen: 'Asesor Multi-Paso Maquinaria 2026',
  };

  const finalLocalId = leadState.wixId || leadState.id || `lead_${Date.now()}`;

  // 1. Update local record immediately so Step 5 -> Step 6 is instantaneous
  const updatedRecord = {
    _id: finalLocalId,
    wixId: leadState.wixId || null,
    syncedToWix: Boolean(leadState.syncedToWix),
    ...mergedPayload,
  };

  const existing = readLocalLeads();
  const idx = existing.findIndex(
    item => item._id === leadState.id || (leadState.wixId && item.wixId === leadState.wixId)
  );
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updatedRecord };
    writeLocalLeads(existing);
  } else {
    writeLocalLeads([updatedRecord, ...existing]);
  }

  // 2. Sync update to Wix CMS
  let syncedToWix = false;
  let wixId = leadState.wixId || null;

  try {
    const cmsOp =
      wixId && wixClient?.items?.update
        ? wixClient.items.update(LEADS_COLLECTION_ID, { _id: wixId, ...mergedPayload })
        : wixClient?.items?.insert
        ? wixClient.items.insert(LEADS_COLLECTION_ID, mergedPayload)
        : null;

    if (cmsOp) {
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1200));
      const res = await Promise.race([cmsOp, timeoutPromise]);
      wixId = res?._id || res?.item?._id || wixId;
      if (res) {
        syncedToWix = true;
        const current = readLocalLeads();
        const cIdx = current.findIndex(item => item._id === finalLocalId || item._id === leadState.id);
        if (cIdx !== -1) {
          current[cIdx] = { ...current[cIdx], _id: wixId || finalLocalId, wixId, syncedToWix: true };
          writeLocalLeads(current);
        }
      }
    }
  } catch {
    // Fallback to local update if CMS collection permissions are restricted
  }

  return {
    id: wixId || finalLocalId,
    wixId,
    syncedToWix,
    record: { ...updatedRecord, _id: wixId || finalLocalId, wixId, syncedToWix },
  };
}
