import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if user has provided valid non-placeholder credentials
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('example.com') &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseAnonKey.length > 20
);

// Create actual client if configured, otherwise create dummy client to prevent runtime crash
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key-that-is-long-enough-to-prevent-validation-crash');

// ----------------------------------------------------
// DEMO / LOCALSTORAGE FALLBACK STORE
// Used when .env is not yet configured so app never crashes
// ----------------------------------------------------
const LOCAL_STORAGE_KEY = 'rscc_demo_certificates';

const INITIAL_DEMO_CERTS = [
  {
    
    
 
    
  }
];

function getDemoCerts() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CERTS));
      return INITIAL_DEMO_CERTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DEMO_CERTS;
  }
}

function saveDemoCerts(certs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(new CustomEvent('rscc_demo_certs_changed', { detail: certs }));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// ----------------------------------------------------
// CORE API METHODS
// ----------------------------------------------------

/**
 * Verify / Fetch a single certificate by Certificate ID
 * Case-insensitive query (matches 'rscc-2026-00125' or 'RSCC-2026-00125')
 */
export async function verifyCertificate(certificateId) {
  if (!certificateId || !certificateId.trim()) {
    return { data: null, error: new Error('Please enter a Certificate ID') };
  }

  const cleanId = certificateId.trim().toUpperCase();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .ilike('certificate_id', cleanId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return { data: null, error: new Error('Certificate ID not found') };
      return { data, error: null };
    } catch (err) {
      console.error('Supabase verifyCertificate error:', err);
      return { data: null, error: err };
    }
  }

  // Fallback to local storage
  const certs = getDemoCerts();
  const match = certs.find(c => c.certificate_id.toUpperCase() === cleanId);
  if (!match) {
    return { data: null, error: new Error('Certificate ID not found') };
  }
  return { data: match, error: null };
}

/**
 * Subscribe to Realtime updates for a single certificate
 * When the admin updates the status in the dashboard, the customer's verify page auto-refreshes!
 */
export function subscribeCertificateStatus(certificateId, onUpdate) {
  if (!certificateId) return () => {};
  const cleanId = certificateId.trim().toUpperCase();

  if (isSupabaseConfigured) {
    const channelName = `cert-${cleanId}-${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'certificates',
          filter: `certificate_id=eq.${cleanId}`
        },
        (payload) => {
          if (payload.new && onUpdate) {
            onUpdate(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Fallback: listen to localStorage custom event
  const listener = () => {
    const certs = getDemoCerts();
    const match = certs.find(c => c.certificate_id.toUpperCase() === cleanId);
    if (match && onUpdate) {
      onUpdate(match);
    }
  };

  window.addEventListener('rscc_demo_certs_changed', listener);
  return () => {
    window.removeEventListener('rscc_demo_certs_changed', listener);
  };
}

/**
 * Fetch list of certificates with optional search and status filters (for Admin Dashboard)
 */
export async function fetchCertificates({ search = '', status = 'all' } = {}) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search && search.trim()) {
        const s = `%${search.trim()}%`;
        query = query.or(`certificate_id.ilike.${s},customer_name.ilike.${s},phone.ilike.${s},certificate_type.ilike.${s}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Supabase fetchCertificates error:', err);
      return { data: [], error: err };
    }
  }

  // Fallback demo filter
  let certs = getDemoCerts();
  if (status && status !== 'all') {
    certs = certs.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    certs = certs.filter(c =>
      c.certificate_id.toLowerCase().includes(s) ||
      c.customer_name.toLowerCase().includes(s) ||
      (c.phone && c.phone.includes(s)) ||
      (c.certificate_type && c.certificate_type.toLowerCase().includes(s))
    );
  }
  return { data: certs, error: null };
}

/**
 * Generate Next Unique Certificate ID
 * Format: RSCC-YYYY-XXXXX (e.g., RSCC-2026-00001, RSCC-2026-00127)
 */
export async function generateNextCertificateId() {
  const currentYear = new Date().getFullYear();
  const prefix = `RSCC-${currentYear}-`;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('certificate_id')
        .ilike('certificate_id', `${prefix}%`)
        .order('certificate_id', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        let maxSeq = 0;
        data.forEach(row => {
          const parts = row.certificate_id.split('-');
          if (parts.length === 3) {
            const num = parseInt(parts[2], 10);
            if (!isNaN(num) && num > maxSeq) {
              maxSeq = num;
            }
          }
        });
        const nextSeq = String(maxSeq + 1).padStart(5, '0');
        return `${prefix}${nextSeq}`;
      }
    } catch (err) {
      console.warn('Could not auto-fetch sequence from Supabase, using fallback generator:', err);
    }
  }

  // Demo sequence calculation
  const certs = getDemoCerts();
  let maxSeq = 0;
  certs.forEach(c => {
    if (c.certificate_id && c.certificate_id.startsWith(prefix)) {
      const parts = c.certificate_id.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }
  });
  const nextSeq = String(maxSeq + 1).padStart(5, '0');
  return `${prefix}${nextSeq}`;
}

/**
 * Upload certificate file (PDF or Image) to Supabase Storage bucket 'certificates'
 */
export async function uploadCertificateFile(file, certificateId) {
  if (!file) return { fileUrl: null, filePath: null, error: null };

  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${certificateId}/${Date.now()}_${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from('certificates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      return {
        fileUrl: publicData?.publicUrl || null,
        filePath,
        error: null
      };
    } catch (err) {
      console.error('Storage upload error:', err);
      return { fileUrl: null, filePath: null, error: err };
    }
  }

  // Fallback: Create Data URI for demo preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        fileUrl: reader.result,
        filePath: `local/${file.name}`,
        error: null
      });
    };
    reader.onerror = (e) => resolve({ fileUrl: null, filePath: null, error: e });
    reader.readAsDataURL(file);
  });
}

/**
 * Create a new Certificate
 */
export async function createCertificate(certData, file = null) {
  let fileUrl = certData.file_url || null;
  let filePath = certData.file_path || null;

  if (file) {
    const uploadResult = await uploadCertificateFile(file, certData.certificate_id);
    if (uploadResult.error) {
      console.warn('File upload warning (proceeding with record save):', uploadResult.error);
    } else {
      fileUrl = uploadResult.fileUrl;
      filePath = uploadResult.filePath;
    }
  }

  const payload = {
    certificate_id: certData.certificate_id.trim().toUpperCase(),
    customer_name: certData.customer_name.trim(),
    phone: certData.phone ? certData.phone.trim() : null,
    certificate_type: certData.certificate_type,
    issue_date: certData.issue_date || new Date().toISOString().split('T')[0],
    status: certData.status || 'Pending',
    description: certData.description || null,
    file_url: fileUrl,
    file_path: filePath
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase createCertificate error:', err);
      return { data: null, error: err };
    }
  }

  // Fallback
  const certs = getDemoCerts();
  if (certs.some(c => c.certificate_id.toUpperCase() === payload.certificate_id)) {
    return { data: null, error: new Error(`Certificate ID ${payload.certificate_id} already exists.`) };
  }

  const newRecord = {
    ...payload,
    id: 'cert-' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  certs.unshift(newRecord);
  saveDemoCerts(certs);
  return { data: newRecord, error: null };
}

/**
 * Update an existing Certificate
 */
export async function updateCertificate(id, updates, newFile = null) {
  let fileUrl = updates.file_url;
  let filePath = updates.file_path;

  if (newFile && updates.certificate_id) {
    const uploadResult = await uploadCertificateFile(newFile, updates.certificate_id);
    if (!uploadResult.error) {
      fileUrl = uploadResult.fileUrl;
      filePath = uploadResult.filePath;
    }
  }

  const payload = {
    ...updates,
    file_url: fileUrl,
    file_path: filePath,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase updateCertificate error:', err);
      return { data: null, error: err };
    }
  }

  // Fallback
  const certs = getDemoCerts();
  const index = certs.findIndex(c => c.id === id);
  if (index === -1) {
    return { data: null, error: new Error('Certificate not found') };
  }
  certs[index] = { ...certs[index], ...payload };
  saveDemoCerts(certs);
  return { data: certs[index], error: null };
}

/**
 * Delete a Certificate
 */
export async function deleteCertificate(id, filePath = null) {
  if (isSupabaseConfigured) {
    try {
      if (filePath) {
        await supabase.storage.from('certificates').remove([filePath]);
      }
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Supabase deleteCertificate error:', err);
      return { error: err };
    }
  }

  // Fallback
  const certs = getDemoCerts();
  const filtered = certs.filter(c => c.id !== id);
  saveDemoCerts(filtered);
  return { error: null };
}
