import React, { useState, useEffect } from 'react';
import {
  IconCertificate,
  IconSearch,
  IconCheckCircle,
  IconAlertCircle,
  IconXCircle,
  IconDownload,
  IconExternalLink,
  IconWhatsApp,
  IconFileText,
  IconQrCode
} from '../components/Icons';
import { verifyCertificate, subscribeCertificateStatus } from '../lib/supabaseClient';

export default function VerifyCertificatePage({ initialCertId = '', onNavigate }) {
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // Auto-verify if initialCertId is passed
  useEffect(() => {
    if (initialCertId) {
      setCertIdInput(initialCertId);
      handleVerify(initialCertId);
    }
  }, [initialCertId]);

  // Subscribe to Realtime Postgres changes when certificate is found
  useEffect(() => {
    if (!certificate?.certificate_id) return;

    setIsLiveActive(true);
    const unsubscribe = subscribeCertificateStatus(certificate.certificate_id, (updated) => {
      setCertificate((prev) => ({
        ...prev,
        ...updated
      }));
    });

    return () => {
      unsubscribe();
      setIsLiveActive(false);
    };
  }, [certificate?.certificate_id]);

  const handleVerify = async (idToVerify = null) => {
    const targetId = (idToVerify || certIdInput).trim().toUpperCase();
    if (!targetId) {
      setErrorMsg('Please enter a valid Certificate ID (e.g., RSCC-2026-00001)');
      setCertificate(null);
      setSearched(true);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      const { data, error } = await verifyCertificate(targetId);
      if (error || !data) {
        setErrorMsg(`No certificate found matching ID "${targetId}". Please check the ID and try again, or contact support.`);
        setCertificate(null);
      } else {
        setCertificate(data);
        setErrorMsg('');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during verification. Please try again.');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'verified' || s === 'completed' || s === 'approved') {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
        dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]',
        icon: <IconCheckCircle className="w-5 h-5 text-emerald-400" />,
        label: 'Verified / Approved'
      };
    }
    if (s === 'processing' || s === 'in progress') {
      return {
        bg: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400',
        dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse',
        icon: <IconAlertCircle className="w-5 h-5 text-cyan-400" />,
        label: 'Processing / In Progress'
      };
    }
    if (s === 'rejected') {
      return {
        bg: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
        dot: 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]',
        icon: <IconXCircle className="w-5 h-5 text-rose-400" />,
        label: 'Rejected'
      };
    }
    return {
      bg: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
      dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse',
      icon: <IconAlertCircle className="w-5 h-5 text-amber-400" />,
      label: 'Pending Verification'
    };
  };

  const quickSamples = ['RSCC-2026-00001', 'RSCC-2026-00002', 'RSCC-2026-00125'];

  return (
    <div className="min-h-screen bg-[#040817] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <IconCertificate className="w-4 h-4" />
            Official Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            Verify Your Certificate
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Enter your unique Certificate ID to verify authenticity, view customer details, and track live status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-[#0b132b]/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <IconSearch className="w-5 h-5 text-cyan-400" />
              </div>
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. RSCC-2026-00125"
                className="w-full pl-11 pr-4 py-3.5 bg-[#070d1e] border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 text-base font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all uppercase tracking-wider"
              />
              {certIdInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCertIdInput('');
                    setCertificate(null);
                    setSearched(false);
                    setErrorMsg('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !certIdInput.trim()}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <IconCertificate className="w-5 h-5" />
                  <span>Verify Certificate</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sample IDs */}
          <div className="mt-4 pt-3 border-t border-cyan-500/10 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span className="text-gray-400">Quick Test IDs:</span>
            {quickSamples.map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => {
                  setCertIdInput(sampleId);
                  handleVerify(sampleId);
                }}
                className="px-2.5 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-mono border border-cyan-500/20 transition-colors"
              >
                {sampleId}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {searched && errorMsg && !loading && (
          <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-6 mb-8 text-center animate-fadeIn">
            <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 mb-3">
              <IconXCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-rose-300 mb-1">Verification Failed</h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto mb-4">{errorMsg}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const sample = 'RSCC-2026-00001';
                  setCertIdInput(sample);
                  handleVerify(sample);
                }}
                className="px-4 py-2 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 text-xs font-medium rounded-lg transition-colors"
              >
                Try Sample ID: RSCC-2026-00001
              </button>
              <a
                href="https://wa.me/919876543210?text=Hello%20RS%20Computer,%20I%20need%20help%20verifying%20my%20certificate."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <IconWhatsApp className="w-4 h-4" />
                Contact Helpdesk
              </a>
            </div>
          </div>
        )}

        {/* Valid Certificate Result Card */}
        {certificate && !loading && (
          <div className="bg-[#0b132b]/95 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)] backdrop-blur-xl animate-fadeIn">
            {/* Top Certificate Header Banner */}
            <div className="bg-gradient-to-r from-cyan-950/80 via-[#0d1b3e] to-cyan-950/80 p-5 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  <IconCertificate className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                    Official Record
                    {isLiveActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Synced
                      </span>
                    )}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-mono">
                    {certificate.certificate_id}
                    <button
                      type="button"
                      onClick={() => handleCopyId(certificate.certificate_id)}
                      className="text-xs px-2 py-0.5 rounded bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/30 text-cyan-300 transition-colors"
                      title="Copy Certificate ID"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {(() => {
                const badge = getStatusBadge(certificate.status);
                return (
                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${badge.bg} font-semibold text-sm`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* Certificate Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div className="bg-[#070d1e]/80 p-4 rounded-xl border border-cyan-500/15">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Customer Name
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {certificate.customer_name || 'N/A'}
                  </div>
                </div>

                {/* Certificate Type */}
                <div className="bg-[#070d1e]/80 p-4 rounded-xl border border-cyan-500/15">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Certificate Type
                  </div>
                  <div className="text-base sm:text-lg font-bold text-cyan-300">
                    {certificate.certificate_type || 'General Certificate'}
                  </div>
                </div>

                {/* Issue Date */}
                <div className="bg-[#070d1e]/80 p-4 rounded-xl border border-cyan-500/15">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Issue Date
                  </div>
                  <div className="text-base font-semibold text-gray-200">
                    {certificate.issue_date
                      ? new Date(certificate.issue_date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </div>
                </div>

                {/* Issuer Authority */}
                <div className="bg-[#070d1e]/80 p-4 rounded-xl border border-cyan-500/15">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Issuing Cyber Cafe
                  </div>
                  <div className="text-base font-semibold text-gray-200">
                    RS Computer Cyber Cafe & Digital Services
                  </div>
                </div>
              </div>

              {/* Description / Remarks */}
              {certificate.description && (
                <div className="bg-[#070d1e]/80 p-4 rounded-xl border border-cyan-500/15">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Official Description / Remarks
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {certificate.description}
                  </p>
                </div>
              )}

              {/* Certificate File View / Download Section */}
              {certificate.file_url ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <IconFileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Certificate Document Attached</div>
                      <div className="text-xs text-gray-400">PDF / Image uploaded by RS Computer Admin</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <a
                      href={certificate.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                      <IconExternalLink className="w-4 h-4" />
                      View Online
                    </a>
                    <a
                      href={certificate.file_url}
                      download={`Certificate-${certificate.certificate_id}`}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#070d1e] hover:bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <IconDownload className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#070d1e]/50 border border-cyan-500/10 text-xs text-gray-400 flex items-center gap-2">
                  <span className="text-gray-500">ℹ️</span>
                  <span>Physical certificate copy available at our cyber cafe counter upon presenting this Certificate ID.</span>
                </div>
              )}

              {/* Actions & WhatsApp Support */}
              <div className="pt-4 border-t border-cyan-500/15 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <span>Last Updated:</span>
                  <span className="text-gray-300 font-mono">
                    {certificate.updated_at
                      ? new Date(certificate.updated_at).toLocaleString('en-IN')
                      : 'Recently'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-[#070d1e] hover:bg-cyan-950/60 border border-cyan-500/20 text-xs text-cyan-300 font-medium transition-colors"
                  >
                    🖨️ Print Slip
                  </button>
                  <a
                    href={`https://wa.me/919876543210?text=Hello%20RS%20Computer,%20I%20have%20an%20inquiry%20regarding%20Certificate%20ID%20${certificate.certificate_id}%20(${encodeURIComponent(certificate.customer_name || '')})`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs text-emerald-300 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <IconWhatsApp className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informational feature cards below */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#070d1e]/60 border border-cyan-500/15 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2.5">
              <IconCheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Instant Verification</h4>
            <p className="text-xs text-gray-400">
              Directly queries our secure database with genuine certificate tracking.
            </p>
          </div>

          <div className="bg-[#070d1e]/60 border border-cyan-500/15 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2.5">
              <IconQrCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Unique RSCC ID</h4>
            <p className="text-xs text-gray-400">
              Each document is sealed with a collision-free tracking code.
            </p>
          </div>

          <div className="bg-[#070d1e]/60 border border-cyan-500/15 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2.5">
              <IconFileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Download & Print</h4>
            <p className="text-xs text-gray-400">
              Access digital softcopies and verification slips 24/7 on any device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
