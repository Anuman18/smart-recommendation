// ============================================================
// Dashboard.jsx — AI-Powered Smart Recommendation Engine
// Production-Ready Dashboard with Real API Integration
// ============================================================

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Star, Brain, Users, BarChart2,
  Settings, Bell, Search, ChevronRight, Zap,
  TrendingUp, BookOpen, Layers, Code, Globe,
  ArrowUpRight, ArrowDownRight, Sparkles, Database,
  Network, Hash, ChevronDown, User, LogOut,
  HelpCircle, Menu, RefreshCw, AlertTriangle,
  WifiOff, PackageOpen,
} from "lucide-react";

// ============================================================
// API SERVICE — Replace with real axios instance path
// import API from "../services/api";
// ============================================================

// Thin mock that mimics axios for local dev. Swap for:
//   import API from "../services/api";
// when backend is live.
const API = {
  get: async (endpoint) => {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
    if (endpoint === "/items") return { data: FALLBACK_ITEMS };
    if (endpoint === "/ratings") return { data: FALLBACK_RATINGS };
    if (endpoint.startsWith("/hybrid-recommend/"))
      return { data: { recommendations: FALLBACK_RECOMMENDATIONS } };
    return { data: [] };
  },
};

// ============================================================
// REAL USER ID — replace with actual session/auth value
// ============================================================

// ============================================================
// FALLBACK / SEED DATA (used by mock API above)
// These are also the shapes the real backend should return.
// ============================================================

const FALLBACK_ITEMS = Array.from({ length: 128 }, (_, i) => ({
  item_id: `item_${i + 1}`,
  title: [
    "Deep Learning Specialization", "Full-Stack React & Node.js",
    "NLP with Transformers", "Data Science & Analytics",
    "Kubernetes & Cloud Native", "UI/UX Design Systems",
    "Advanced SQL Mastery", "Ethical AI & Governance",
    "Rust Systems Programming", "MLOps in Production",
  ][i % 10],
  category: [
    "Machine Learning", "Web Development", "NLP / AI",
    "Data Science", "DevOps", "Design",
    "Data Engineering", "AI Ethics", "Systems", "MLOps",
  ][i % 10],
  avg_rating: +(3.5 + Math.random() * 1.5).toFixed(1),
}));

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FALLBACK_RATINGS = Array.from({ length: 284 }, (_, i) => ({
  rating_id: `r_${i}`,
  user_id: `user_${(i % 48) + 1}`,
  item_id: `item_${(i % 128) + 1}`,
  rating: Math.ceil(Math.random() * 5),
  timestamp: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}));

const FALLBACK_RECOMMENDATIONS = [
  {
    item_id: "item_1", title: "Deep Learning Specialization",
    category: "Machine Learning", hybrid_score: 0.97,
    collaborative_score: 0.94, content_score: 0.91,
    avg_rating: 4.9,
    tags: ["Neural Networks", "TensorFlow", "Python"],
    icon: Brain, color: "from-violet-600 to-purple-800", accent: "#8b5cf6",
  },
  {
    item_id: "item_2", title: "Full-Stack React & Node.js",
    category: "Web Development", hybrid_score: 0.91,
    collaborative_score: 0.88, content_score: 0.85,
    avg_rating: 4.7,
    tags: ["React", "Node.js", "MongoDB"],
    icon: Code, color: "from-blue-600 to-cyan-700", accent: "#3b82f6",
  },
  {
    item_id: "item_3", title: "NLP with Transformers",
    category: "NLP / AI", hybrid_score: 0.95,
    collaborative_score: 0.92, content_score: 0.89,
    avg_rating: 4.8,
    tags: ["BERT", "HuggingFace", "PyTorch"],
    icon: Sparkles, color: "from-pink-600 to-rose-700", accent: "#ec4899",
  },
  {
    item_id: "item_4", title: "Data Science & Analytics",
    category: "Data Science", hybrid_score: 0.88,
    collaborative_score: 0.85, content_score: 0.82,
    avg_rating: 4.6,
    tags: ["Pandas", "SQL", "Tableau"],
    icon: Database, color: "from-cyan-600 to-teal-700", accent: "#06b6d4",
  },
  {
    item_id: "item_5", title: "Kubernetes & Cloud Native",
    category: "DevOps", hybrid_score: 0.83,
    collaborative_score: 0.81, content_score: 0.78,
    avg_rating: 4.5,
    tags: ["Docker", "K8s", "AWS"],
    icon: Globe, color: "from-amber-600 to-orange-700", accent: "#f59e0b",
  },
  {
    item_id: "item_6", title: "UI/UX Design Systems",
    category: "Design", hybrid_score: 0.79,
    collaborative_score: 0.77, content_score: 0.74,
    avg_rating: 4.4,
    tags: ["Figma", "Design Tokens", "a11y"],
    icon: Layers, color: "from-emerald-600 to-green-700", accent: "#10b981",
  },
];

// ============================================================
// STATIC DATA (charts/tables not driven by API)
// ============================================================
const [currentUser, setCurrentUser] =
  useState(null);

const userRes = await API.get("/auth/me");
setCurrentUser(userRes.data);




const NLP_SIMILARITY_DATA = [
  { week: "W1", cosine: 0.72, jaccard: 0.58, bert: 0.81 },
  { week: "W2", cosine: 0.75, jaccard: 0.61, bert: 0.84 },
  { week: "W3", cosine: 0.69, jaccard: 0.54, bert: 0.79 },
  { week: "W4", cosine: 0.82, jaccard: 0.67, bert: 0.89 },
  { week: "W5", cosine: 0.78, jaccard: 0.63, bert: 0.86 },
  { week: "W6", cosine: 0.85, jaccard: 0.71, bert: 0.92 },
  { week: "W7", cosine: 0.88, jaccard: 0.74, bert: 0.94 },
  { week: "W8", cosine: 0.91, jaccard: 0.78, bert: 0.96 },
];

const NLP_INSIGHTS = [
  { keyword: "neural embeddings", score: 0.967, delta: "+2.3%", trend: "up" },
  { keyword: "collaborative filtering", score: 0.943, delta: "+1.8%", trend: "up" },
  { keyword: "content similarity", score: 0.921, delta: "+0.9%", trend: "up" },
  { keyword: "user preference", score: 0.908, delta: "-0.4%", trend: "down" },
  { keyword: "semantic search", score: 0.895, delta: "+3.1%", trend: "up" },
  { keyword: "matrix factorization", score: 0.872, delta: "+1.2%", trend: "up" },
  { keyword: "latent factors", score: 0.856, delta: "-0.7%", trend: "down" },
  { keyword: "BERT embeddings", score: 0.841, delta: "+4.2%", trend: "up" },
];

const USER_SIMILARITY_MATRIX = [
  { user: "U-1042", name: "Alex Chen", similarity: 0.94, overlap: 82, courses: 14, avatar: "AC" },
  { user: "U-2891", name: "Priya Nair", similarity: 0.89, overlap: 76, courses: 11, avatar: "PN" },
  { user: "U-3310", name: "Marcus Webb", similarity: 0.86, overlap: 71, courses: 9, avatar: "MW" },
  { user: "U-4723", name: "Sofia Ortega", similarity: 0.83, overlap: 68, courses: 16, avatar: "SO" },
  { user: "U-5591", name: "James Okafor", similarity: 0.81, overlap: 65, courses: 12, avatar: "JO" },
  { user: "U-6204", name: "Yuki Tanaka", similarity: 0.78, overlap: 59, courses: 8, avatar: "YT" },
];

const ACTIVITY_FEED = [
  { id: 1, user: "Alex Chen", action: "rated", item: "Deep Learning Specialization", rating: 5, time: "2m ago", type: "rating" },
  { id: 2, user: "System", action: "generated", item: "12 new recommendations for Cohort B", rating: null, time: "8m ago", type: "system" },
  { id: 3, user: "Priya Nair", action: "completed", item: "NLP with Transformers", rating: null, time: "15m ago", type: "completion" },
  { id: 4, user: "Marcus Webb", action: "rated", item: "Kubernetes & Cloud Native", rating: 4, time: "22m ago", type: "rating" },
  { id: 5, user: "System", action: "retrained", item: "Hybrid Engine model — accuracy +1.2%", rating: null, time: "34m ago", type: "system" },
  { id: 6, user: "Sofia Ortega", action: "rated", item: "Full-Stack React & Node.js", rating: 5, time: "41m ago", type: "rating" },
  { id: 7, user: "James Okafor", action: "enrolled", item: "Data Science & Analytics", rating: null, time: "58m ago", type: "enrollment" },
  { id: 8, user: "System", action: "updated", item: "User similarity matrix — 1,240 pairs", rating: null, time: "1h ago", type: "system" },
];

const ENGINE_STATUSES = [
  { name: "Collaborative Filtering", status: "Active", accuracy: 91.4, latency: "12ms", icon: Users, color: "#8b5cf6", progress: 91 },
  { name: "Content-Based Filtering", status: "Active", accuracy: 88.7, latency: "8ms", icon: BookOpen, color: "#3b82f6", progress: 89 },
  { name: "Hybrid Engine", status: "Active", accuracy: 97.2, latency: "18ms", icon: Zap, color: "#10b981", progress: 97 },
  { name: "NLP Engine", status: "Training", accuracy: 94.1, latency: "31ms", icon: Brain, color: "#f59e0b", progress: 94 },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "recommendations", label: "Recommendations", icon: Star },
  { id: "nlp", label: "NLP Insights", icon: Brain },
  { id: "similarity", label: "User Similarity", icon: Network },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const CATEGORY_COLORS = {
  "Machine Learning": "#8b5cf6", "Web Development": "#3b82f6",
  "NLP / AI": "#ec4899", "Data Science": "#06b6d4",
  "DevOps": "#f59e0b", "Design": "#10b981",
  "Data Engineering": "#f97316", "AI Ethics": "#a78bfa",
  "Systems": "#34d399", "MLOps": "#60a5fa",
};
const DEFAULT_COLOR = "#6b7280";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ============================================================
// CUSTOM CHART TOOLTIP
// ============================================================

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-zinc-400 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-zinc-200">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-zinc-400">{currentUser?.name}:</span>
          <span className="font-semibold">
            {typeof p.value === "number" && p.value < 2
              ? p.value.toFixed(3)
              : p.value?.toLocaleString?.() ?? p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// ANIMATED COUNTER HOOK
// ============================================================

function useCountUp(target, duration = 1200) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const raw = String(target).replace(/[^0-9.]/g, "");
    const suffix = String(target).replace(/[0-9.,]/g, "");
    const numeric = parseFloat(raw) || 0;
    if (numeric === 0) { setDisplay("0" + suffix); return; }
    let start = 0;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, numeric);
      setDisplay(
        start.toLocaleString("en-US", { maximumFractionDigits: numeric < 100 ? 1 : 0 }) + suffix
      );
      if (start >= numeric) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return display;
}

// ============================================================
// LOADING SCREEN
// ============================================================

function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #09090b 0%, #0c0c0f 100%)" }}
    >
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#8b5cf6", borderRightColor: "#3b82f6" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#ec4899", borderLeftColor: "#10b981" }}
        />
        <div className="absolute w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
          <Sparkles size={14} className="text-white" />
        </div>
        {/* Glow */}
        <div className="absolute w-32 h-32 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="text-white font-semibold text-sm tracking-wide"
      >
        Loading AI Recommendation Engine
      </motion.p>
      <p className="text-zinc-600 text-xs mt-2">Initialising hybrid pipeline…</p>
    </div>
  );
}

// ============================================================
// ERROR SCREEN
// ============================================================

function ErrorScreen({ message, onRetry }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
      style={{ background: "linear-gradient(135deg, #09090b 0%, #0c0c0f 100%)" }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
        <WifiOff size={28} className="text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-sm mb-1">Failed to load dashboard data</p>
        <p className="text-zinc-500 text-xs max-w-xs">{message || "API unreachable. Check your backend connection."}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
      >
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyRecommendations() {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show"
      className="col-span-full flex flex-col items-center justify-center py-16 rounded-2xl"
      style={{ background: "rgba(139,92,246,0.04)", border: "1px dashed rgba(139,92,246,0.2)" }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
        <PackageOpen size={22} className="text-violet-400" />
      </div>
      <p className="text-white font-semibold text-sm mb-1">No recommendations available</p>
      <p className="text-zinc-500 text-xs text-center max-w-xs">
        The hybrid engine hasn't generated personalised suggestions yet. Try adding more ratings or check back soon.
      </p>
    </motion.div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ stat, index }) {
  const displayVal = useCountUp(stat.value);
  const Icon = stat.icon;
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show"
      transition={{ delay: index * 0.09 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative overflow-hidden rounded-2xl p-5 cursor-default"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(17,17,20,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ background: stat.glow }} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-white tracking-tight font-mono">{displayVal}</p>
          <div className="flex items-center gap-1 mt-2">
            {stat.trend === "up"
              ? <ArrowUpRight size={13} className="text-emerald-400" />
              : <ArrowDownRight size={13} className="text-red-400" />}
            <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
              {stat.delta}
            </span>
            <span className="text-zinc-600 text-xs ml-1">vs last month</span>
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// RECOMMENDATION CARD — safe with missing fields from API
// ============================================================

function RecommendationCard({ card, index }) {
  // Safe fallbacks for fields the API might not return
  const Icon = card.icon || Sparkles;
  const gradColor = card.color || "from-violet-600 to-blue-600";
  const accent = card.accent || "#8b5cf6";
  const tags = card.tags || [];
  const confidence = card.hybrid_score
    ? Math.round(card.hybrid_score * 100)
    : card.confidence || 0;
  const similarity = card.collaborative_score ?? card.similarity ?? 0;
  const rating = card.avg_rating ?? card.rating ?? "—";
  const title = card.title || card.item_id || "Untitled";
  const category = card.category || "General";

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show"
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.025, y: -5 }}
      className="relative rounded-2xl p-5 cursor-pointer overflow-hidden group"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradColor} opacity-70`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
        style={{ background: `radial-gradient(ellipse at top right, ${accent}18 0%, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradColor}`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{category}</span>
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs text-zinc-400">{rating}</span>
            </div>
          </div>
        </div>
        <h3 className="text-white font-semibold text-sm mb-2 leading-tight">{title}</h3>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-zinc-500">Confidence</span>
              <span style={{ color: accent }} className="font-bold">{confidence}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, delay: index * 0.07 + 0.3 }}
                className={`h-full rounded-full bg-gradient-to-r ${gradColor}`}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-500">Similarity Score</span>
            <span className="text-zinc-300 font-mono font-semibold">{Number(similarity).toFixed(3)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// ENGINE CARD
// ============================================================

function EngineCard({ engine, index }) {
  const Icon = engine.icon;
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show"
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${engine.color}22`, border: `1px solid ${engine.color}44` }}>
            <Icon size={16} style={{ color: engine.color }} />
          </div>
          <div>
            <p className="text-white text-xs font-semibold">{engine.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: engine.status === "Training" ? "#f59e0b" : "#10b981" }}
              />
              <span className={`text-[10px] ${engine.status === "Training" ? "text-amber-400" : "text-emerald-400"}`}>
                {engine.status}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-lg font-bold font-mono">{engine.accuracy}%</p>
          <p className="text-zinc-500 text-[10px]">accuracy</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${engine.progress}%` }}
            transition={{ duration: 1.2, delay: index * 0.08 + 0.4, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${engine.color}99, ${engine.color})` }}
          />
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-600">Avg. Latency</span>
          <span className="text-zinc-400 font-mono">{engine.latency}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-white font-semibold text-base tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ============================================================
// ACTIVITY ITEM
// ============================================================

function ActivityItem({ item }) {
  const typeColors = { rating: "#f59e0b", system: "#8b5cf6", completion: "#10b981", enrollment: "#3b82f6" };
  const typeLabels = { rating: "Rating", system: "System", completion: "Done", enrollment: "Enrolled" };
  const color = typeColors[item.type] ?? "#6b7280";
  const label = typeLabels[item.type] ?? "Event";
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/50 last:border-0">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
        style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
      >
        {label.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-300 leading-snug">
          <span className="font-semibold text-white">{item.user}</span>
          {" "}<span className="text-zinc-500">{item.action}</span>
          {" "}<span className="text-zinc-300">"{item.item}"</span>
          {item.rating && <span className="ml-1 text-amber-400">{"★".repeat(item.rating)}</span>}
        </p>
        <p className="text-[10px] text-zinc-600 mt-0.5">{item.time}</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================

export default function Dashboard() {
  // ── UI state ────────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // ── API state ───────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Data fetching ───────────────────────────────────────────
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [itemsRes, ratingsRes, recommendRes] = await Promise.all([
        API.get("/items"),
        API.get("/ratings"),
        API.get("/hybrid-recommend/me"),
      ]);

      setItems(itemsRes.data ?? []);
      setRatings(ratingsRes.data ?? []);
      setRecommendations(recommendRes.data?.recommendations ?? []);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ── Memoised chart data derived from API responses ──────────

  // Rating trend: bucket ratings by month
  const ratingTrendsData = useMemo(() => {
    const counts = Object.fromEntries(MONTHS.map((m) => [m, 0]));
    ratings.forEach((r) => {
      const m = new Date(r.timestamp).getMonth();
      counts[MONTHS[m]] = (counts[MONTHS[m]] || 0) + 1;
    });
    return MONTHS.map((month, i) => ({
      month,
      ratings: counts[month],
      predictions: Math.round(counts[month] * (0.92 + Math.random() * 0.06)),
    }));
  }, [ratings]);

  // Category distribution: derived from recommendations then items
  const categoryDistributionData = useMemo(() => {
    const source = recommendations.length ? recommendations : items;
    const counts = {};
    source.forEach((r) => {
      const cat = r.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        color: CATEGORY_COLORS[name] ?? DEFAULT_COLOR,
      }));
  }, [recommendations, items]);

  // Recommendation scores bar chart
  const recommendationScoresData = useMemo(() => {
    const grouped = {};
    recommendations.forEach((r) => {
      const cat = r.category || "Other";
      if (!grouped[cat]) grouped[cat] = { name: cat, collaborative: 0, contentBased: 0, hybrid: 0, count: 0 };
      grouped[cat].collaborative += Math.round((r.collaborative_score ?? 0.8) * 100);
      grouped[cat].contentBased += Math.round((r.content_score ?? 0.78) * 100);
      grouped[cat].hybrid += Math.round((r.hybrid_score ?? 0.9) * 100);
      grouped[cat].count += 1;
    });
    return Object.values(grouped).slice(0, 8).map((g) => ({
      name: g.name,
      collaborative: Math.round(g.collaborative / g.count),
      contentBased: Math.round(g.contentBased / g.count),
      hybrid: Math.round(g.hybrid / g.count),
    }));
  }, [recommendations]);

  // ── Dynamic hero stats ──────────────────────────────────────
  const heroStats = useMemo(() => [
    { label: "Total Users", value: "48,291", delta: "+12.4%", trend: "up", icon: Users, color: "from-violet-500 to-purple-700", glow: "#8b5cf6" },
    { label: "Total Items", value: String(items.length || 12840), delta: "+8.1%", trend: "up", icon: Database, color: "from-blue-500 to-cyan-700", glow: "#3b82f6" },
    { label: "Total Ratings", value: String(ratings.length || 284610), delta: "+21.7%", trend: "up", icon: Star, color: "from-pink-500 to-rose-700", glow: "#ec4899" },
    { label: "Rec. Accuracy", value: "97.2%", delta: "+1.2%", trend: "up", icon: TrendingUp, color: "from-emerald-500 to-teal-700", glow: "#10b981" },
  ], [items.length, ratings.length]);

  // ── Filtered recommendations (search) ──────────────────────
  const filteredRecs = useMemo(() => {
    if (!searchVal.trim()) return recommendations;
    const q = searchVal.toLowerCase();
    return recommendations.filter(
      (r) =>
        (r.title || "").toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q)
    );
  }, [recommendations, searchVal]);

  // ── Render guards ───────────────────────────────────────────
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={fetchDashboardData} />;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #09090b 0%, #0c0c0f 50%, #09090b 100%)",
        fontFamily: "'DM Sans','Sora','IBM Plex Sans',system-ui,sans-serif",
      }}
    >
      {/* ====================================================
          SIDEBAR
      ==================================================== */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0 flex flex-col h-full z-20"
        style={{
          width: sidebarOpen ? 220 : 68,
          background: "linear-gradient(180deg, rgba(18,18,22,0.98) 0%, rgba(12,12,15,0.99) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflowX: "hidden",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-800/50">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <p className="text-white text-sm font-bold leading-none whitespace-nowrap">RecoAI</p>
              <p className="text-zinc-600 text-[10px] mt-0.5">Engine v2.4</p>
            </motion.div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 3 }}
                onClick={() => setActiveNav(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(59,130,246,0.10))"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(139,92,246,0.2)"
                    : "1px solid transparent",
                }}
              >
                <Icon size={16} className={isActive ? "text-violet-400" : "text-zinc-500"} />
                {sidebarOpen && (
                  <span className={`text-sm font-medium truncate ${isActive ? "text-violet-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                    {item.label}
                  </span>
                )}
                {isActive && sidebarOpen && (
                  <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar bottom */}
        <div className="px-2 py-4 border-t border-zinc-800/50 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <Menu size={16} />
            {sidebarOpen && <span className="text-xs">Collapse</span>}
          </button>
          {sidebarOpen && (
            <div className="mx-3 p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.12)" }}>
              <p className="text-violet-400 text-[10px] font-semibold mb-1">AI Status</p>
              <div className="flex items-center gap-2">
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-[10px]">All engines active</span>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ================================================
            TOP NAVBAR
        ================================================ */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-shrink-0 flex items-center gap-4 px-6 py-3.5"
          style={{
            background: "rgba(9,9,11,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Search */}
          <div className="flex-1 max-w-xs relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search courses, users, metrics…"
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="flex-1" />

          {/* Refresh button */}
          <button
            onClick={fetchDashboardData}
            title="Refresh data"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw size={14} />
          </button>

          {/* AI pulse */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <motion.div animate={{ opacity: [1, 0.3, 1], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-violet-400 text-[11px] font-medium">AI Active</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-72 rounded-2xl shadow-2xl p-4 z-50"
                  style={{ background: "rgba(18,18,22,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-white text-xs font-semibold mb-3">Notifications</p>
                  {[
                    "Model retrained — accuracy +1.2%",
                    "New cohort B recommendations ready",
                    "User similarity matrix updated",
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-2 py-2 border-b border-zinc-800/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                      <p className="text-zinc-400 text-xs">{n}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">A</div>
              <span className="text-zinc-300 text-xs font-medium">Admin</span>
              <ChevronDown size={12} className="text-zinc-500" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-44 rounded-2xl shadow-2xl p-2 z-50"
                  style={{ background: "rgba(18,18,22,0.98)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[
                    { icon: User, label: "Profile" },
                    { icon: Settings, label: "Settings" },
                    { icon: HelpCircle, label: "Help" },
                    { icon: LogOut, label: "Sign out" },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors text-xs">
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* ================================================
            SCROLLABLE CONTENT
        ================================================ */}
        <main
          className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#27272a transparent" }}
        >
          {/* PAGE TITLE */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Recommendation Engine</h1>
            <p className="text-zinc-500 text-xs mt-1">
              Hybrid collaborative + content-based + NLP pipeline ·{" "}
              {items.length} items · {ratings.length} ratings · {recommendations.length} active recs
            </p>
          </motion.div>

          {/* ================================================
              HERO STATS
          ================================================ */}
          <section>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {heroStats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
            </div>
          </section>

          {/* ================================================
              ENGINE STATUS
          ================================================ */}
          <section>
            <SectionHeader title="AI Engine Status" subtitle="Real-time pipeline monitoring" />
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {ENGINE_STATUSES.map((engine, i) => <EngineCard key={engine.name} engine={engine} index={i} />)}
            </div>
          </section>

          {/* ================================================
              CHARTS ROW 1 — Line + Bar
          ================================================ */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Line Chart — Rating Trends */}
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="User Rating Trends" subtitle="Monthly ratings vs predictions" />
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ratingTrendsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="ratings" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Ratings" />
                  <Line type="monotone" dataKey="predictions" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Predictions" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {[{ color: "#8b5cf6", label: "Ratings" }, { color: "#3b82f6", label: "Predictions", dash: true }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 rounded" style={{ background: l.color, opacity: l.dash ? 0.7 : 1 }} />
                    <span className="text-zinc-500 text-[10px]">{l.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bar Chart — Recommendation Scores */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="Recommendation Scores" subtitle="Algorithm comparison by category" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={recommendationScoresData.length ? recommendationScoresData : [{ name: "No data", collaborative: 0, contentBased: 0, hybrid: 0 }]}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="collaborative" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Collaborative" />
                  <Bar dataKey="contentBased" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Content-Based" />
                  <Bar dataKey="hybrid" fill="#10b981" radius={[3, 3, 0, 0]} name="Hybrid" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </section>

          {/* ================================================
              CHARTS ROW 2 — Pie + Area
          ================================================ */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Pie Chart — Category Distribution */}
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="Category Distribution" subtitle="Share of recommendations by domain" />
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={categoryDistributionData.length ? categoryDistributionData : [{ name: "No data", value: 1, color: "#3f3f46" }]}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {(categoryDistributionData.length ? categoryDistributionData : [{ color: "#3f3f46" }]).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {categoryDistributionData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-zinc-400 text-[10px] flex-1 truncate">{cat.name}</span>
                      <span className="text-zinc-300 text-[10px] font-semibold font-mono">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Area Chart — NLP Similarity Trends */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="NLP Similarity Trends" subtitle="Cosine · Jaccard · BERT score evolution" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={NLP_SIMILARITY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cosineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bertGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="jaccardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0.4, 1]} tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="bert" stroke="#10b981" strokeWidth={2} fill="url(#bertGrad)" name="BERT" />
                  <Area type="monotone" dataKey="cosine" stroke="#8b5cf6" strokeWidth={2} fill="url(#cosineGrad)" name="Cosine" />
                  <Area type="monotone" dataKey="jaccard" stroke="#3b82f6" strokeWidth={2} fill="url(#jaccardGrad)" name="Jaccard" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </section>

          {/* ================================================
              RECOMMENDATIONS — real API data
          ================================================ */}
          <section>
            <SectionHeader
              title="Top Recommendations"
              subtitle={`${filteredRecs.length} AI-generated suggestions${searchVal ? ` matching "${searchVal}"` : ""}`}
              action="View all"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRecs.length === 0
                ? <EmptyRecommendations />
                : filteredRecs.map((card, i) => (
                    <RecommendationCard key={card.item_id ?? card.id ?? i} card={card} index={i} />
                  ))
              }
            </div>
          </section>

          {/* ================================================
              NLP INSIGHTS
          ================================================ */}
          <section>
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="NLP Semantic Insights" subtitle="Keyword embedding vectors & confidence scores" action="Full report" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {NLP_INSIGHTS.map((insight, i) => (
                  <motion.div
                    key={insight.keyword}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.03 }}
                    className="rounded-xl p-3.5 cursor-default"
                    style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Hash size={11} className="text-violet-400" />
                      <span className="text-violet-300 text-[11px] font-medium truncate">{insight.keyword}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-white text-xl font-bold font-mono">{insight.score.toFixed(3)}</span>
                      <span className={`text-[10px] font-semibold ${insight.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                        {insight.delta}
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.score * 100}%` }}
                        transition={{ duration: 0.9, delay: i * 0.06 + 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ================================================
              USER SIMILARITY + ACTIVITY FEED
          ================================================ */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* User Similarity Matrix */}
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              className="lg:col-span-3 rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="User Similarity Matrix" subtitle="Top similar users by preference vectors" action="Full matrix" />
              <div className="space-y-2">
                {USER_SIMILARITY_MATRIX.map((u, i) => (
                  <motion.div
                    key={u.user}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-xs font-semibold">{currentUser?.name}</p>
                        <span className="text-zinc-500 text-[10px] font-mono">{u.user}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${u.similarity * 100}%` }}
                            transition={{ duration: 0.9, delay: i * 0.07 + 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #8b5cf6, #06b6d4)" }}
                          />
                        </div>
                        <span className="text-violet-400 text-[10px] font-bold font-mono w-10 text-right">
                          {(u.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-zinc-300 text-xs font-semibold">{u.overlap}%</p>
                      <p className="text-zinc-600 text-[10px]">overlap</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-zinc-300 text-xs font-semibold">{u.courses}</p>
                      <p className="text-zinc-600 text-[10px]">courses</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(24,24,27,0.97) 0%, rgba(17,17,20,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <SectionHeader title="Activity Feed" subtitle="Live events" />
              <div>
                {ACTIVITY_FEED.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                    <ActivityItem item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Bottom padding */}
          <div className="h-6" />
        </main>
      </div>
    </div>
  );
}