/**
 * The single seam between services and storage.
 *
 * Everything above this line imports from here and nowhere else. Two backends
 * implement the same eight names — init, createWithId, findByRegistrationId,
 * findByEmailAndId, findExisting, list, update, count:
 *
 *   dataapi  registrations live in the TiesVerse Data API (admin.tiesverse.com)
 *   json     registrations live in server/data/db.json
 *
 * `STORAGE` picks one. If dataapi is chosen but unreachable at boot, this falls
 * back to json and says so, because a summit that cannot take registrations is
 * worse than one whose rows are temporarily local. Set STORAGE_FALLBACK=false
 * to make an unreachable Data API a hard startup failure instead.
 */
import { config } from '../config.js';
import * as jsonRepo from './jsonRegistrationRepository.js';
import * as dataApiRepo from './dataApiRegistrationRepository.js';

let active = config.storage === 'dataapi' ? dataApiRepo : jsonRepo;

export function activeBackend() {
  return active === dataApiRepo ? 'dataapi' : 'json';
}

export async function init() {
  if (active === dataApiRepo) {
    try {
      await dataApiRepo.init();
      console.log(`[storage] TiesVerse Data API, store "${config.dataApi.slug}"`);
      return;
    } catch (err) {
      if (!config.storageFallback) throw err;
      console.error(`[storage] Data API unavailable: ${err.message}`);
      console.error('[storage] Falling back to local JSON. Records written now will NOT be in the Data API.');
      active = jsonRepo;
    }
  }
  await jsonRepo.init();
  if (activeBackend() === 'json') console.log('[storage] local JSON (server/data/db.json)');
}

export const createWithId = (...a) => active.createWithId(...a);
export const findByRegistrationId = (...a) => active.findByRegistrationId(...a);
export const findByEmailAndId = (...a) => active.findByEmailAndId(...a);
export const findExisting = (...a) => active.findExisting(...a);
export const list = (...a) => active.list(...a);
export const update = (...a) => active.update(...a);
export const count = (...a) => active.count(...a);
