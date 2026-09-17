import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from '../../lib/prisma';
import {
  Shield,
  Users,
  Inbox,
  ShoppingBag,
  Database,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';

const ADMIN_EMAILS = ['qse6209@gmail.com', 'mrdulow12@gmail.com'];

interface AdminDashboardProps {
  adminEmail: string;
  data: {
    users: any[];
    requests: any[];
    teeOrders: any[];
    subscribers: any[];
    consultingSlots: any[];
    dbNotice?: string;
  };
}

export default function AdminDashboard({ adminEmail, data }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'orders' | 'subscribers' | 'users' | 'security'>('requests');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <Head>
        <title>ADMIN MATRIX // QUARTER SPOON NETWORK</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-[#0044FF] selection:text-white pb-20">
        {/* Admin Top Command Header */}
        <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-[#0B132B] flex items-center justify-center">
                <Image
                  src="/assets/QS%20NETWORK%201.png"
                  alt="QS Network Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black tracking-widest uppercase text-white">
                    QUARTER SPOON COMMAND MATRIX
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0044FF]/20 border border-[#0044FF] text-[10px] font-mono font-bold text-[#0044FF]">
                    LEVEL 5 CLEARANCE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                  <span>AUTHENTICATED DIRECTOR:</span>
                  <span className="text-white font-bold">{adminEmail}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0044FF] animate-ping" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg border border-white/15 bg-[#0B132B]/60 hover:bg-white/10 text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-white transition-colors"
              >
                PUBLIC VIEW
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/40 text-xs font-mono uppercase tracking-wider text-red-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          </div>
        </header>

        {/* Notice if in Edge Standby */}
        {data.dbNotice && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 font-mono text-xs text-amber-300">
              ⚡ {data.dbNotice}
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
          {/* Telemetry Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider">
                  SERVICE INQUIRIES
                </span>
                <Inbox className="w-5 h-5 text-[#0044FF]" />
              </div>
              <div className="text-3xl font-black font-mono text-white mb-1">
                {data.requests.length}
              </div>
              <span className="text-[11px] font-mono text-[#0044FF]">
                DUAL-COMMIT LOG ACTIVE
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider">
                  CUSTOM STREETWEAR
                </span>
                <ShoppingBag className="w-5 h-5 text-[#0044FF]" />
              </div>
              <div className="text-3xl font-black font-mono text-white mb-1">
                {data.teeOrders.length}
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                OFF THA GRID ORDERS
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider">
                  SUBSCRIBERS
                </span>
                <Mail className="w-5 h-5 text-[#0044FF]" />
              </div>
              <div className="text-3xl font-black font-mono text-white mb-1">
                {data.subscribers.length}
              </div>
              <span className="text-[11px] font-mono text-[#0044FF]">
                POSTGRES DIRECT SYNC
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider">
                  CLIENT IDENTITIES
                </span>
                <Users className="w-5 h-5 text-[#0044FF]" />
              </div>
              <div className="text-3xl font-black font-mono text-white mb-1">
                {data.users.length}
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                REGISTERED PROFILES
              </span>
            </div>
          </section>

          {/* Tab Selection */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'requests'
                  ? 'bg-[#0044FF] text-white font-bold shadow-[0_0_15px_rgba(0,68,255,0.4)]'
                  : 'bg-[#0B132B]/60 text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              SERVICE INQUIRIES ({data.requests.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#0044FF] text-white font-bold shadow-[0_0_15px_rgba(0,68,255,0.4)]'
                  : 'bg-[#0B132B]/60 text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              CUSTOM TEE ORDERS ({data.teeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'subscribers'
                  ? 'bg-[#0044FF] text-white font-bold shadow-[0_0_15px_rgba(0,68,255,0.4)]'
                  : 'bg-[#0B132B]/60 text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              NEWSLETTER ({data.subscribers.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'users'
                  ? 'bg-[#0044FF] text-white font-bold shadow-[0_0_15px_rgba(0,68,255,0.4)]'
                  : 'bg-[#0B132B]/60 text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              USERS ({data.users.length})
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'security'
                  ? 'bg-[#0044FF] text-white font-bold shadow-[0_0_15px_rgba(0,68,255,0.4)]'
                  : 'bg-[#0B132B]/60 text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              SECURITY STATUS
            </button>
          </div>

          {/* Active Tab View */}
          <div className="bg-[#0B132B]/40 border border-white/10 rounded-2xl overflow-hidden p-6">
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-sm uppercase tracking-wider text-white">
                    INCOMING SERVICE REQUESTS (POSTGRESQL + FORMSPREE DUAL-COMMIT)
                  </h2>
                  <span className="font-mono text-xs text-[#94A3B8]">
                    DISPATCH TARGET: mrdulow12@gmail.com
                  </span>
                </div>

                {data.requests.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-[#94A3B8]">
                    NO SERVICE REQUESTS LOGGED YET.
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {data.requests.map((req: any) => (
                      <div key={req.id} className="py-4 space-y-2">
                        <div
                          onClick={() => toggleExpand(req.id)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#0044FF]/20 border border-[#0044FF] text-[10px] font-mono text-[#0044FF]">
                                {req.serviceType}
                              </span>
                              <span className="font-bold text-sm text-white">
                                {req.subjectLine}
                              </span>
                            </div>
                            <div className="font-mono text-xs text-[#94A3B8]">
                              {req.user?.name || 'Anonymous'} ({req.user?.email || 'No email'}) •{' '}
                              {new Date(req.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs px-2 py-1 rounded bg-black/60 text-[#94A3B8] border border-white/10">
                              {req.status}
                            </span>
                            {expandedId === req.id ? (
                              <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                            )}
                          </div>
                        </div>

                        {expandedId === req.id && (
                          <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-3 mt-2">
                            <div className="text-[#94A3B8]">PROJECT DETAILS / SPECIFICATION:</div>
                            <p className="text-white whitespace-pre-wrap leading-relaxed">
                              {req.projectDetails}
                            </p>
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#94A3B8]">
                              <span>RECORD ID: {req.id}</span>
                              <a
                                href={`mailto:${req.user?.email}?subject=Quarter%20Spoon%20Network%20Follow-up`}
                                className="text-[#0044FF] hover:underline"
                              >
                                REPLY TO CLIENT →
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-mono text-sm uppercase tracking-wider text-white">
                  CUSTOM STREETWEAR ORDERS (OFF THA GRID CUSTOM TEEZ)
                </h2>

                {data.teeOrders.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-[#94A3B8]">
                    NO CUSTOM TEE ORDERS IN THE QUEUE.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.teeOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{order.designTitle}</span>
                          <span className="px-2 py-0.5 rounded bg-[#0044FF]/20 text-[#0044FF] border border-[#0044FF] text-[10px]">
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                          <div>GARMENT SIZE: <span className="text-white">{order.garmentSize}</span></div>
                          <div>FABRIC COLOR: <span className="text-white">{order.fabricColor}</span></div>
                          <div className="col-span-2">
                            CLIENT: <span className="text-white">{order.user?.email || 'N/A'}</span>
                          </div>
                        </div>
                        {order.customText && (
                          <div className="p-2.5 rounded bg-[#0B132B] border border-white/10 text-white">
                            TEXT PRINT: "{order.customText}"
                          </div>
                        )}
                        <div className="text-[#94A3B8] text-[11px]">
                          SUBMITTED: {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div className="space-y-4">
                <h2 className="font-mono text-sm uppercase tracking-wider text-white">
                  NEWSLETTER SUBSCRIBER LEDGER
                </h2>

                {data.subscribers.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-[#94A3B8]">
                    NO SUBSCRIBERS LOGGED YET.
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {data.subscribers.map((sub: any) => (
                      <div key={sub.id} className="py-3 flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#0044FF]" />
                          <span className="text-white font-bold">{sub.email}</span>
                          <span className="text-[#94A3B8]">({sub.source || 'Direct'})</span>
                        </div>
                        <span className="text-[#94A3B8] text-[11px]">
                          {new Date(sub.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <h2 className="font-mono text-sm uppercase tracking-wider text-white">
                  REGISTERED USERS & IDENTITIES
                </h2>

                {data.users.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-[#94A3B8]">
                    NO REGISTERED USERS FOUND.
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {data.users.map((u: any) => (
                      <div key={u.id} className="py-3 flex items-center justify-between font-mono text-xs">
                        <div>
                          <span className="text-white font-bold">{u.email}</span>
                          <span className="text-[#94A3B8] ml-2">({u.name || 'No Name'})</span>
                        </div>
                        <span className="text-[#94A3B8] text-[11px]">
                          JOINED: {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 font-mono text-xs">
                <h2 className="text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0044FF]" />
                  <span>EDGE SECURITY & ACCESS CONTROL SPECIFICATION</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                    <div className="text-[#0044FF] font-bold">AUTHORIZED DIRECTORS (WHITELIST)</div>
                    <ul className="space-y-1 text-white">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0044FF]" />
                        <span>qse6209@gmail.com</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0044FF]" />
                        <span>mrdulow12@gmail.com</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                    <div className="text-[#0044FF] font-bold">EDGE MIDDLEWARE ACTIVE</div>
                    <p className="text-[#94A3B8] leading-relaxed">
                      Intercepts all requests matching <code className="text-white">/admin/*</code> and{' '}
                      <code className="text-white">/api/admin/*</code>. Evaluates NextAuth JWT tokens at the edge runtime.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                    <div className="text-[#0044FF] font-bold">INCIDENT DISPATCH RELAY</div>
                    <p className="text-[#94A3B8] leading-relaxed">
                      Unauthorized access attempts immediately dispatch JSON breach telemetry with client IP, route, and timestamp directly to{' '}
                      <span className="text-white">mrdulow12@gmail.com</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                    <div className="text-[#0044FF] font-bold">DUAL-COMMIT DATABASE LEDGER</div>
                    <p className="text-[#94A3B8] leading-relaxed">
                      All inquiries and orders persist to PostgreSQL schema via Prisma ORM and mirror to Formspree endpoint in real time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const email = (session?.user?.email ? String(session.user.email).trim().toLowerCase() : '');
  if (!session || !ADMIN_EMAILS.includes(email)) {
    return {
      redirect: {
        destination: `/403?unauthorized=${encodeURIComponent(email || 'guest')}&target=/admin/dashboard`,
        permanent: false,
      },
    };
  }

  try {
    const [users, requests, teeOrders, subscribers, consultingSlots] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.serviceRequest.findMany({
        include: { user: true },
        orderBy: { submittedAt: 'desc' },
        take: 50,
      }),
      prisma.customTeeOrder.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.newsletterSubscriber.findMany({
        orderBy: { joinedAt: 'desc' },
        take: 50,
      }),
      prisma.consultingSlot.findMany({
        orderBy: { startTime: 'asc' },
        take: 50,
      }),
    ]);

    return {
      props: {
        adminEmail: email,
        data: {
          users: JSON.parse(JSON.stringify(users)),
          requests: JSON.parse(JSON.stringify(requests)),
          teeOrders: JSON.parse(JSON.stringify(teeOrders)),
          subscribers: JSON.parse(JSON.stringify(subscribers)),
          consultingSlots: JSON.parse(JSON.stringify(consultingSlots)),
        },
      },
    };
  } catch (err: any) {
    console.error('Admin DB query error in getServerSideProps:', err);
    return {
      props: {
        adminEmail: email,
        data: {
          users: [],
          requests: [],
          teeOrders: [],
          subscribers: [],
          consultingSlots: [],
          dbNotice: 'PostgreSQL dual-commit database in edge standby mode.',
        },
      },
    };
  }
};
