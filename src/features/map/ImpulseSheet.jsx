import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, Star, MapPin, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

// PREMIUM SHEET PHYSICS
const SHEET_TRANSITION = { duration: 0.4, ease: [0.25, 1, 0.5, 1] }; 

export default function ImpulseSheet({ impulse, onClose }) {
  const { user } = useAuth();
  const [requestStatus, setRequestStatus] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (impulse && user && impulse.user_id !== user.id) {
      checkRequestStatus();
    } else {
      setRequestStatus(null);
    }
    setShowDeleteConfirm(false);
  }, [impulse, user]);

  const checkRequestStatus = async () => {
    const { data } = await supabase.from('matches').select('status').eq('impulse_id', impulse.id).eq('requester_id', user.id).maybeSingle();
    if (data) setRequestStatus(data.status);
    else setRequestStatus(null);
  };

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('matches').insert({
      impulse_id: impulse.id, initiator_id: impulse.user_id, requester_id: user.id, status: 'pending'
    });
    if (!error) setRequestStatus('pending');
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from('impulses').delete().eq('id', impulse.id);
    if (!error) onClose();
    setLoading(false);
  };

  const author = impulse.users || {};
  const isOwner = user?.id === impulse.user_id;

  return (
    <>
      {/* FIXED BACKDROP: 
        Изменено с absolute на fixed и z-index поднят до 80, 
        чтобы гарантированно перекрыть BottomNav.
      */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
      />
      
      {/* FIXED SHEET: 
        Изменено с absolute на fixed и z-index поднят до 90.
      */}
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={SHEET_TRANSITION}
        className="fixed bottom-0 left-0 right-0 z-[90] bg-[#121212] rounded-t-[32px] border-t border-white/10 overflow-hidden shadow-2xl"
      >
        {showDeleteConfirm ? (
           <div className="p-8 pb-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500"><AlertCircle size={32} /></div>
             <h3 className="text-2xl font-black text-white mb-2">Удалить импульс?</h3>
             <p className="text-white/50 mb-8 font-medium">Это действие нельзя отменить.</p>
             <div className="w-full grid grid-cols-2 gap-3">
               <button onClick={() => setShowDeleteConfirm(false)} className="py-4 rounded-2xl bg-white/5 font-bold text-white">Отмена</button>
               <button onClick={handleDelete} disabled={loading} className="py-4 rounded-2xl bg-red-500 text-white font-bold">{loading ? '...' : 'Удалить'}</button>
             </div>
           </div>
        ) : (
          <>
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="relative px-6 pb-6">
              <div className="flex justify-between items-start mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/20 p-1 relative">
                    <img src={author.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                    {author.is_premium && <div className="absolute -top-1 -right-1 bg-black rounded-full p-1.5 border border-yellow-500"><Star size={12} className="text-yellow-400 fill-yellow-400" /></div>}
                  </div>
                  <div>
                    <h2 className={clsx("text-2xl font-black leading-none", author.is_premium ? "text-yellow-400" : "text-white")}>{author.first_name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase text-white tracking-wider border border-white/5">CEO & Founder</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/40"><X size={24} /></button>
              </div>
            </div>

            <div className="px-6 pb-8">
              <div className="p-5 rounded-[24px] bg-white/5 border border-white/5 mb-6">
                 <p className="text-white text-lg font-medium leading-relaxed">"{impulse.message}"</p>
                 {impulse.venues && <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-primary"><MapPin size={16} /><span className="font-bold text-sm uppercase tracking-widest">{impulse.venues.name}</span></div>}
              </div>

              {isOwner ? (
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(true)} className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-lg flex items-center justify-center gap-2">Удалить импульс <Trash2 size={20} /></motion.button>
              ) : (
                requestStatus === 'pending' ? (
                  <button disabled className="w-full py-4 rounded-2xl bg-white/5 text-white/40 font-bold text-lg flex items-center justify-center gap-2"><Clock size={20} /> Запрос отправлен</button>
                ) : requestStatus === 'accepted' ? (
                  <button className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg"><MessageCircle size={20} /> Открыть чат</button>
                ) : (
                  <motion.button whileTap={{ scale: 0.98 }} onClick={handleJoin} disabled={loading} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20">{loading ? '...' : <>Погнали! <CheckCircle size={20} /></>}</motion.button>
                )
              )}
              
              {!showDeleteConfirm && <p className="text-center text-white/20 text-xs mt-4 font-medium">Импульс исчезнет через 4 часа</p>}
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}