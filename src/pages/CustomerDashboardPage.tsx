import { useState, useEffect } from 'react';
import { db, subscribeToDB } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import { MaterialOrder, OrderStatus } from '../types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  ArrowRight,
  ExternalLink,
  Layers
} from 'lucide-react';

export function CustomerDashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { navigate } = useRouter();

  const [orders, setOrders] = useState<MaterialOrder[]>(() =>
    db.getOrders().filter((o) => o.buyer_id === user.id || user.role === 'admin')
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const unsub = subscribeToDB(() => {
      setOrders(db.getOrders().filter((o) => o.buyer_id === user.id || user.role === 'admin'));
    });
    return unsub;
  }, [user.id, user.role]);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    return true;
  });

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Cancel this purchase request?')) {
      try {
        db.updateOrderStatus(orderId, 'cancelled');
        success('Purchase request cancelled.', 'Cancelled');
      } catch (e: any) {
        error(e.message || 'Failed to cancel order');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-950/80 border border-sky-500/30 text-sky-300">
            <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
            Customer Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            My Material Purchase Requests
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track material orders, seller confirmations, and local pickup details.
          </p>
        </div>

        <button
          onClick={() => navigate('/materials')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 border border-slate-750"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Browse More Materials</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl text-xs font-semibold overflow-x-auto w-fit border border-slate-800">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'requested', label: 'Requested' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'completed', label: 'Completed' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all ${
              selectedStatus === tab.id
                ? 'bg-sky-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.id === 'all' ? orders.length : orders.filter((o) => o.status === tab.id).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#0b1222] rounded-3xl p-16 text-center border border-slate-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No purchase requests in this view</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't requested any materials with this status yet.
          </p>
          <button
            onClick={() => navigate('/materials')}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Explore Materials Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={order.listing_image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200'}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-750 shrink-0"
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">{order.listing_name}</h3>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        order.status === 'accepted'
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                          : order.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : order.status === 'rejected'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : order.status === 'cancelled'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Requested Quantity: <strong className="text-white font-mono">{order.quantity} {order.unit}</strong> • Total Cost:{' '}
                    <strong className="text-emerald-400 font-mono font-bold text-sm">₹{order.total_price.toLocaleString()}</strong>
                  </p>

                  <p className="text-xs text-slate-400 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    "{order.buyer_message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>Seller: <strong className="text-slate-300">{order.seller_name}</strong></span>
                    <span>Requested: {new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 md:flex-col md:items-end">
                <button
                  onClick={() => navigate(`/materials/${order.listing_id}`)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <span>View Material</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {order.status === 'requested' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs border border-rose-800/50"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
