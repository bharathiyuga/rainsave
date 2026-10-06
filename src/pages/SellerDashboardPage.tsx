import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import { MaterialListing, MaterialOrder, MaterialListingStatus } from '../types';
import {
  PackageCheck,
  PlusCircle,
  TrendingUp,
  Coins,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Tag,
  Clock,
  MapPin,
  ShoppingBag,
  Layers,
  ArrowRight
} from 'lucide-react';

export function SellerDashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { navigate } = useRouter();

  const [listings, setListings] = useState<MaterialListing[]>(() =>
    db.getListings().filter((l) => l.seller_id === user.id || user.role === 'admin')
  );
  const [orders, setOrders] = useState<MaterialOrder[]>(() =>
    db.getOrders().filter((o) => o.seller_id === user.id || user.role === 'admin')
  );
  const [activeTab, setActiveTab] = useState<'available' | 'reserved' | 'sold' | 'inactive'>('available');

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setListings(db.getListings().filter((l) => l.seller_id === user.id || user.role === 'admin'));
      setOrders(db.getOrders().filter((o) => o.seller_id === user.id || user.role === 'admin'));
    });
    return unsub;
  }, [user.id, user.role]);

  const totalListings = listings.length;
  const availableMaterials = listings.filter((l) => l.status === 'available').length;
  const soldMaterials = listings.filter((l) => l.status === 'sold').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, o) => acc + o.total_price, 0);
  const materialsReusedCount = orders.filter((o) => o.status === 'completed').length;

  const filteredListings = listings.filter((l) => l.status === activeTab);

  const handleUpdateStatus = (id: string, newStatus: MaterialListingStatus) => {
    try {
      db.updateListing(id, { status: newStatus });
      success(`Listing marked as ${newStatus}`, 'Updated');
    } catch (e: any) {
      error(e.message || 'Failed to update status');
    }
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to remove this material listing?')) {
      try {
        db.deleteListing(id);
        success('Material listing deleted successfully.', 'Deleted');
      } catch (e: any) {
        error(e.message || 'Failed to delete listing');
      }
    }
  };

  const handleOrderStatus = (orderId: string, status: MaterialOrder['status']) => {
    try {
      db.updateOrderStatus(orderId, status);
      success(`Purchase request updated to "${status}"!`, 'Order Updated');
    } catch (e: any) {
      error(e.message || 'Failed to update order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            Seller Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            My Construction Material Listings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your surplus stock, review incoming buyer purchase requests, and record closed sales.
          </p>
        </div>

        <button
          onClick={() => navigate('/sell-material')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Material</span>
        </button>
      </div>

      {/* 5 Key Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Listings</span>
          <p className="text-2xl font-black text-white font-mono">{totalListings}</p>
          <span className="text-[10px] text-slate-500">Cataloged lots</span>
        </div>

        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-emerald-400 block">Available Now</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{availableMaterials}</p>
          <span className="text-[10px] text-emerald-500">Active on market</span>
        </div>

        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-indigo-400 block">Sold & Diverted</span>
          <p className="text-2xl font-black text-indigo-400 font-mono">{soldMaterials}</p>
          <span className="text-[10px] text-indigo-500">Kept from landfills</span>
        </div>

        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-amber-400 block">Total Revenue</span>
          <p className="text-2xl font-black text-amber-400 font-mono">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-amber-500">Recovered capital</span>
        </div>

        <div className="bg-[#0b1222]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase text-sky-400 block">Materials Reused</span>
          <p className="text-2xl font-black text-sky-400 font-mono">{materialsReusedCount}</p>
          <span className="text-[10px] text-sky-500">Orders completed</span>
        </div>

      </div>

      {/* SECTION: PURCHASE REQUESTS RECEIVED */}
      <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              Incoming Purchase Requests ({orders.length})
            </h2>
            <p className="text-xs text-slate-400">
              Customers waiting for your confirmation or pickup coordination
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No purchase requests received yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-800">
            {orders.map((order) => (
              <div key={order.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={order.listing_image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100'}
                    alt=""
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{order.listing_name}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'accepted'
                            ? 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                            : order.status === 'completed'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : order.status === 'rejected'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Requested: <strong className="text-white font-mono">{order.quantity} {order.unit}</strong> • Total:{' '}
                      <strong className="text-emerald-400 font-mono">₹{order.total_price.toLocaleString()}</strong>
                    </p>
                    <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 italic">
                      "{order.buyer_message}"
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Buyer: <strong className="text-slate-300">{order.buyer_name}</strong> • Phone: {order.contact_phone}
                    </p>
                  </div>
                </div>

                {/* Seller Actions on Order */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {order.status === 'requested' && (
                    <>
                      <button
                        onClick={() => handleOrderStatus(order.id, 'accepted')}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleOrderStatus(order.id, 'rejected')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 font-bold text-xs border border-slate-700"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleOrderStatus(order.id, 'completed')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Pickup Completed</span>
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Deal Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: MY LISTINGS (With Tabs) */}
      <div className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white">
            Material Inventory Management
          </h2>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl text-xs font-semibold border border-slate-800">
            {(['available', 'reserved', 'sold', 'inactive'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab} ({listings.filter((l) => l.status === tab).length})
              </button>
            ))}
          </div>
        </div>

        {/* Listings List */}
        {filteredListings.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              No listings currently in "{activeTab}" status.
            </p>
            {activeTab === 'available' && (
              <button
                onClick={() => navigate('/sell-material')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30"
              >
                Create Listing Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-950">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white border border-slate-700 shadow">
                      {item.category}
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900/90 text-slate-200 border border-slate-700">
                      {item.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-white line-clamp-1">{item.material_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{item.location}</span>
                    </p>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-base font-extrabold text-white font-mono">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 font-semibold font-mono">{item.quantity} {item.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Actions per Listing */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                  <button
                    onClick={() => navigate(`/materials/${item.id}`)}
                    className="text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>

                  {item.status === 'available' ? (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'sold')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Sold
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'available')}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      Relist Available
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteListing(item.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
