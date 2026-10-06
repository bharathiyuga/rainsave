import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import {
  MaterialListing,
  MaterialOrder,
  Building,
  BuildingStatus,
  MaterialListingStatus,
  SustainabilityMetrics
} from '../types';
import {
  ShieldCheck,
  Building2,
  Layers,
  ShoppingBag,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Coins,
  Recycle,
  Filter
} from 'lucide-react';

export function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();
  const { navigate } = useRouter();

  const [activeSection, setActiveSection] = useState<'marketplace' | 'buildings' | 'orders'>('marketplace');
  const [metrics, setMetrics] = useState<SustainabilityMetrics>(() => db.getSustainabilityMetrics());
  const [listings, setListings] = useState<MaterialListing[]>(() => db.getListings());
  const [buildings, setBuildings] = useState<Building[]>(() => db.getBuildings());
  const [orders, setOrders] = useState<MaterialOrder[]>(() => db.getOrders());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setMetrics(db.getSustainabilityMetrics());
      setListings(db.getListings());
      setBuildings(db.getBuildings());
      setOrders(db.getOrders());
    });
    return unsub;
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
        <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400">
          Please switch to the Admin demo account in the top right user menu to test administrative moderation.
        </p>
      </div>
    );
  }

  const filteredListings = listings.filter((l) => {
    if (categoryFilter !== 'all' && l.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.material_name.toLowerCase().includes(q) ||
        l.seller_name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleListingStatus = (id: string, newStatus: MaterialListingStatus) => {
    try {
      db.updateListing(id, { status: newStatus });
      success(`Listing status updated to ${newStatus}`, 'Updated');
    } catch (e: any) {
      error(e.message || 'Failed to update status');
    }
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Admin confirmation: Remove this listing permanently from the database?')) {
      try {
        db.deleteListing(id);
        success('Listing removed by administrator', 'Deleted');
      } catch (e: any) {
        error(e.message || 'Failed to remove listing');
      }
    }
  };

  const handleBuildingStatus = (id: string, status: BuildingStatus) => {
    try {
      db.updateBuildingStatus(id, status);
      success(`Building status updated to ${status}`, 'Building Updated');
    } catch (e: any) {
      error(e.message || 'Failed to update building');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Supabase RLS & Admin Moderation Center
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            RainRevive Governance Portal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full administrative oversight over surplus material listings, building revival audits, and community transactions.
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl text-xs font-semibold border border-slate-800">
          <button
            onClick={() => setActiveSection('marketplace')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'marketplace'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Material Marketplace
          </button>
          <button
            onClick={() => setActiveSection('buildings')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'buildings'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Building Approvals
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSection === 'orders'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Admin Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Listings</span>
          <p className="text-xl font-black text-white font-mono">{listings.length}</p>
        </div>
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Available</span>
          <p className="text-xl font-black text-emerald-400 font-mono">
            {listings.filter((l) => l.status === 'available').length}
          </p>
        </div>
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-indigo-400 block">Sold Lots</span>
          <p className="text-xl font-black text-indigo-400 font-mono">
            {listings.filter((l) => l.status === 'sold').length}
          </p>
        </div>
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-sky-400 block">Transactions</span>
          <p className="text-xl font-black text-sky-400 font-mono">{metrics.totalTransactions}</p>
        </div>
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-teal-400 block">Reused Lots</span>
          <p className="text-xl font-black text-teal-400 font-mono">{metrics.materialsReusedCount}</p>
        </div>
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">Waste Prevented</span>
          <p className="text-xl font-black text-amber-400 font-mono">{metrics.wastePreventedTons}t</p>
        </div>
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Community Saved</span>
          <p className="text-xl font-black text-emerald-400 font-mono">₹{(metrics.communityMoneySavedInr / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* SECTION 1: MATERIAL MARKETPLACE MANAGEMENT */}
      {activeSection === 'marketplace' && (
        <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Material Marketplace Management
              </h2>
              <p className="text-xs text-slate-400">
                Filter, moderate, and remove inappropriate material submissions
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-750 bg-slate-900 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-750 text-xs bg-slate-900 text-slate-300 font-medium"
              >
                <option value="all">Status: All</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Material</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image_url} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-800" />
                        <div>
                          <p className="font-bold text-white truncate max-w-[200px]">{item.material_name}</p>
                          <p className="text-[10px] text-slate-400">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-300">{item.category}</td>
                    <td className="p-3 font-mono">{item.quantity} {item.unit}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{item.price.toLocaleString()}</td>
                    <td className="p-3 text-slate-300">{item.seller_name}</td>
                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleListingStatus(item.id, e.target.value as any)}
                        className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg border outline-none bg-slate-900 border-slate-700 text-slate-200"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => navigate(`/materials/${item.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60"
                        title="Remove listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: BUILDING REVIVAL MANAGEMENT */}
      {activeSection === 'buildings' && (
        <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Building Revival Submissions & Blueprint Approvals
            </h2>
            <p className="text-xs text-slate-400">
              Audit structural feasibility scores and authorize adaptive reuse plans
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {buildings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img src={b.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-800" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{b.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 font-mono">
                        Score: {b.revival_score}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{b.address}</p>
                    <p className="text-xs text-slate-300">
                      Proposed: <strong className="text-white">{b.proposed_use}</strong> • {b.area_sqft} sq.ft
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/building/${b.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-slate-300 font-bold text-xs hover:text-white"
                  >
                    View File
                  </button>

                  <select
                    value={b.status}
                    onChange={(e) => handleBuildingStatus(b.id, e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-700 font-bold text-xs bg-slate-900 text-slate-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="in_progress">In Progress</option>
                    <option value="revived">Revived (Living)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ALL ORDERS */}
      {activeSection === 'orders' && (
        <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              All Marketplace Orders & Purchase Requests
            </h2>
            <p className="text-xs text-slate-400">
              Audit all transaction messages, buyer offers, and fulfillment states
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Material</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-slate-400">{o.id}</td>
                    <td className="p-3 font-bold text-white">{o.listing_name}</td>
                    <td className="p-3 text-slate-300">{o.buyer_name} ({o.contact_phone})</td>
                    <td className="p-3 text-slate-300">{o.seller_name}</td>
                    <td className="p-3 font-mono font-extrabold text-emerald-400">₹{o.total_price.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="capitalize font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-750">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
