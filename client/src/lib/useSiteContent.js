import { useEffect, useState } from 'react';
import { api } from './api.js';
import { FAQ, PARTNER_TIERS, PRESS_ITEMS, SESSIONS, SPEAKERS } from '../content/summit.js';

/**
 * Public content = whatever the admin has entered, with the bundled fixtures
 * as fallback. Admin-managed items win outright once any exist for a type, so
 * the placeholder speakers disappear the moment real ones are added — but a
 * cold or unreachable API never leaves the site blank.
 */
const pick = (fromApi, fallback) => (fromApi && fromApi.length ? fromApi : fallback);

export default function useSiteContent() {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.contentAll()
      .then((d) => { if (!cancelled) setRemote(d); })
      .catch(() => { /* keep the bundled fallback */ });
    return () => { cancelled = true; };
  }, []);

  // Partners are grouped into their tiers for the Partners page.
  const partnerRows = remote?.partner || [];
  const partnerTiers = partnerRows.length
    ? PARTNER_TIERS.map((t) => ({
      tier: t.tier,
      members: partnerRows.filter((p) => p.tier === t.tier).map((p) => p.name),
    }))
    : PARTNER_TIERS;

  return {
    loading: remote === null,
    speakers: pick(remote?.speaker, SPEAKERS),
    sessions: pick(remote?.session, SESSIONS),
    partnerTiers,
    partners: partnerRows,
    press: pick(remote?.press, PRESS_ITEMS),
    faq: pick(remote?.faq, FAQ),
  };
}
