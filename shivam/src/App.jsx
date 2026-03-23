import { useState, useEffect, useRef } from "react";

// =================== BACKEND SIMULATION ===================
let DB = {
  farmers: [
    { id:1, name:"रामराव पाटील", village:"शिरूर, पुणे", phone:"9876543210", crops:["🍅 टोमॅटो","🧅 कांदा","🥔 बटाटा"], priceRange:"₹18–₹35/kg", rating:4.8, verified:true },
    { id:2, name:"सुनीता कदम", village:"बार्शी, सोलापूर", phone:"9865432100", crops:["🌾 गहू","🌽 ज्वारी","🫘 हरभरा"], priceRange:"₹18–₹28/kg", rating:4.6, verified:true },
    { id:3, name:"विठ्ठल शिंदे", village:"वैजापूर, औरंगाबाद", phone:"9754321098", crops:["🥭 आंबा","🍇 द्राक्षे","🎋 ऊस"], priceRange:"₹80–₹200/unit", rating:4.9, verified:true },
    { id:4, name:"मालती जाधव", village:"दिंडोरी, नाशिक", phone:"9643210987", crops:["🥦 फ्लॉवर","🥕 गाजर","🥬 कोबी"], priceRange:"₹30–₹50/kg", rating:4.7, verified:false },
  ],
  products: [
    { id:1, emoji:"🍅", name:"ताजे टोमॅटो", farmerId:1, price:30, unit:"kg", stock:150, category:"भाज्या" },
    { id:2, emoji:"🧅", name:"लाल कांदा", farmerId:1, price:25, unit:"kg", stock:300, category:"भाज्या" },
    { id:3, emoji:"🌾", name:"देशी गहू", farmerId:2, price:22, unit:"kg", stock:500, category:"धान्य" },
    { id:4, emoji:"🥭", name:"हापूस आंबा", farmerId:3, price:150, unit:"डझन", stock:80, category:"फळे" },
    { id:5, emoji:"🥦", name:"ताजे फ्लॉवर", farmerId:4, price:40, unit:"kg", stock:60, category:"भाज्या" },
    { id:6, emoji:"🍇", name:"काळी द्राक्षे", farmerId:3, price:80, unit:"kg", stock:40, category:"फळे" },
    { id:7, emoji:"🥕", name:"गाजर", farmerId:4, price:35, unit:"kg", stock:90, category:"भाज्या" },
    { id:8, emoji:"🌽", name:"मका", farmerId:2, price:15, unit:"नग", stock:200, category:"धान्य" },
  ],
  orders: [],
  customers: [],
};

const api = {
  getFarmers: () => Promise.resolve([...DB.farmers]),
  getProducts: () => Promise.resolve([...DB.products]),
  getOrders: () => Promise.resolve([...DB.orders]),
  registerFarmer: (data) => {
    const farmer = { id: DB.farmers.length + 1, ...data, rating: 0, verified: false };
    DB.farmers.push(farmer);
    return Promise.resolve({ success: true, farmer });
  },
  registerCustomer: (data) => {
    const customer = { id: DB.customers.length + 1, ...data };
    DB.customers.push(customer);
    return Promise.resolve({ success: true, customer });
  },
  placeOrder: (order) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("mr-IN") + " " + now.toLocaleDateString("mr-IN");
    const o = { id: DB.orders.length + 1, ...order, status: "pending", time: timeStr };
    DB.orders.push(o);
    return Promise.resolve({ success: true, order: o });
  },
};

// =================== GLOBAL CSS ===================
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif;
  background: #fefce8;
  color: #1c1917;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f0fdf4; }
::-webkit-scrollbar-thumb { background: #15803d; border-radius: 3px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(5deg); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.04); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideIn {
  from { transform: translateX(120px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.82); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes sway {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes wiggle {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}
@keyframes borderGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(34,197,94,0.4); }
  50% { box-shadow: 0 0 28px rgba(34,197,94,0.8); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes leafFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}

.hero-btn-primary {
  background: linear-gradient(135deg, #b45309, #d97706, #ea580c);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 42px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
  box-shadow: 0 8px 28px rgba(234,88,12,0.45);
  animation: gradientMove 3s ease infinite;
}
.hero-btn-primary:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 16px 40px rgba(234,88,12,0.55);
}
.hero-btn-secondary {
  background: transparent;
  color: white;
  border: 2.5px solid rgba(255,255,255,0.75);
  border-radius: 50px;
  padding: 14px 40px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
  backdrop-filter: blur(4px);
}
.hero-btn-secondary:hover {
  background: rgba(255,255,255,0.18);
  transform: translateY(-3px);
  border-color: white;
}

.food-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(20,83,45,0.12);
  transition: all 0.35s cubic-bezier(.34,1.56,.64,1);
  cursor: pointer;
  position: relative;
}
.food-card:hover {
  transform: translateY(-14px) scale(1.025);
  box-shadow: 0 28px 64px rgba(20,83,45,0.22);
}
.food-card:hover .card-emoji {
  animation: pulse 0.5s infinite;
}

.farmer-card {
  background: white;
  border-radius: 22px;
  padding: 26px 24px;
  box-shadow: 0 8px 32px rgba(20,83,45,0.12);
  transition: all 0.3s ease;
  border-left: 5px solid #22c55e;
  position: relative;
  overflow: hidden;
}
.farmer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 28px 64px rgba(20,83,45,0.22);
}

.step-card {
  background: white;
  border-radius: 22px;
  padding: 34px 22px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(20,83,45,0.1);
  border-top: 5px solid #22c55e;
  transition: transform 0.25s, box-shadow 0.25s;
}
.step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 28px 64px rgba(20,83,45,0.2);
}

.order-row {
  background: white;
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 6px 24px rgba(20,83,45,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  border-left: 5px solid #22c55e;
  transition: box-shadow 0.2s;
}
.order-row:hover {
  box-shadow: 0 12px 40px rgba(20,83,45,0.18);
}

.nav-btn {
  background: transparent;
  border: 1.5px solid transparent;
  color: white;
  border-radius: 30px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.nav-btn.active {
  background: rgba(255,255,255,0.22);
  border-color: rgba(255,255,255,0.55);
}
.nav-btn:hover {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.3);
}

.filter-btn {
  border-radius: 40px;
  padding: 9px 24px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.22s;
  border: 2px solid #22c55e;
}
.filter-btn.active {
  background: linear-gradient(135deg,#15803d,#22c55e);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(21,128,61,0.3);
}
.filter-btn:not(.active) {
  background: white;
  color: #15803d;
}
.filter-btn:hover {
  transform: translateY(-2px);
}

.reg-tab-btn {
  border-radius: 40px;
  padding: 12px 36px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
}
.reg-tab-btn.active {
  background: white;
  color: #14532d;
  border: 2px solid white;
  box-shadow: 0 6px 20px rgba(0,0,0,0.18);
}
.reg-tab-btn:not(.active) {
  background: rgba(255,255,255,0.12);
  color: white;
  border: 2px solid rgba(255,255,255,0.4);
}
.reg-tab-btn:hover {
  transform: scale(1.05);
}

.floating-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.floating-btn:hover {
  transform: scale(1.2) rotate(-5deg);
}

.submit-btn {
  width: 100%;
  border: none;
  border-radius: 40px;
  padding: 15px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.submit-btn:hover {
  transform: scale(1.03);
}

input, textarea, select {
  font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif !important;
}

.input-field {
  width: 100%;
  border: 2px solid #dcfce7;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.95rem;
  font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif;
  background: #f0fdf4;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  color: #1c1917;
}
.input-field:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
}
.input-field::placeholder {
  color: #9ca3af;
}
`;

// =================== HERO BACKGROUND ===================
// Uses an actual landscape/farm photo from Unsplash (free to use)
const HERO_STYLE = {
  backgroundImage: `
    linear-gradient(135deg, rgba(20,83,45,0.88) 0%, rgba(21,128,61,0.80) 50%, rgba(20,83,45,0.92) 100%),
    url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80&auto=format&fit=crop')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundBlendMode: "multiply",
};

const C = {
  g1: "#14532d", g2: "#166534", g3: "#15803d", g4: "#22c55e", g5: "#bbf7d0",
  o1: "#ea580c", o2: "#f97316",
  cream: "#fefce8", muted: "#6b7280", text: "#1c1917",
};

// =================== LEAF PARTICLES ===================
function LeafParticles() {
  const leaves = ["🍃","🌿","🍀","🌱","🌾"];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${10 + i * 11}%`,
          top: "-30px",
          fontSize: `${1.2 + (i % 3) * 0.5}rem`,
          animation: `leafFall ${8 + i * 1.5}s ${i * 0.8}s linear infinite`,
          opacity: 0.6,
        }}>{leaves[i % leaves.length]}</div>
      ))}
    </div>
  );
}

// =================== TOAST ===================
function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: "linear-gradient(135deg,#14532d,#15803d)",
      color: "white", padding: "14px 24px", borderRadius: 40,
      fontWeight: 700, fontSize: "0.95rem",
      boxShadow: "0 8px 32px rgba(20,83,45,0.5)",
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
      transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
      pointerEvents: "none",
      display: "flex", alignItems: "center", gap: 10,
      maxWidth: 340,
    }}>
      <span style={{ fontSize: "1.3rem" }}>🌿</span> {msg}
    </div>
  );
}

// =================== LOADER ===================
function Loader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"48px 0", color: C.g3, fontWeight:600, fontSize:"1.05rem" }}>
      <div style={{ width:22, height:22, border:"3px solid #bbf7d0", borderTopColor: C.g3, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      लोड होत आहे...
    </div>
  );
}

// =================== BADGE ===================
function Badge({ text, color="#14532d", bg="#bbf7d0" }) {
  return (
    <span style={{ background:bg, color, fontSize:"0.73rem", fontWeight:700, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap" }}>
      {text}
    </span>
  );
}

// =================== STAT CARD ===================
function StatCard({ icon, num, label, delay=0 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let c = 0;
    const step = Math.max(1, Math.ceil(num / 60));
    const t = setInterval(() => { c = Math.min(c + step, num); setCount(c); if (c >= num) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, [num]);
  return (
    <div style={{
      background: "rgba(255,255,255,0.14)",
      backdropFilter: "blur(14px)",
      border: "1.5px solid rgba(255,255,255,0.28)",
      borderRadius: 22,
      padding: "20px 28px",
      textAlign: "center",
      animation: `fadeUp 0.7s ${delay}s both`,
      minWidth: 110,
    }}>
      <div style={{ fontSize:"2rem", marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:"2.4rem", fontWeight:900, color:"white", lineHeight:1, animation:"countUp 0.5s both" }}>{count}+</div>
      <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.88)", marginTop:3, fontWeight:600 }}>{label}</div>
    </div>
  );
}

// =================== FOOD CARD ===================
function FoodCard({ product, farmer, onOrder, delay=0 }) {
  return (
    <div className="food-card" style={{ animation:`fadeUp 0.6s ${delay}s both` }}>
      <div style={{
        background: "linear-gradient(135deg,#dcfce7,#bbf7d0,#a7f3d0)",
        padding: "34px 16px 22px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Pattern overlay */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cellipse cx='30' cy='30' rx='14' ry='20' fill='none' stroke='%2386efac' stroke-width='1.2' opacity='0.22' transform='rotate(30 30 30)'/%3E%3C/svg%3E")`,
          backgroundSize:"60px",
        }} />
        <div className="card-emoji" style={{ fontSize:"4.8rem", position:"relative", zIndex:1, display:"inline-block" }}>
          {product.emoji}
        </div>
        {product.stock < 70 && (
          <span style={{
            position:"absolute", top:12, right:12,
            background:"#dc2626", color:"white",
            fontSize:"0.7rem", fontWeight:800,
            padding:"4px 10px", borderRadius:20,
            animation:"pulse 1.3s infinite",
          }}>⚡ कमी स्टॉक</span>
        )}
        <span style={{
          position:"absolute", top:12, left:12,
          background: C.g1, color:"white",
          fontSize:"0.7rem", fontWeight:700,
          padding:"3px 10px", borderRadius:20,
        }}>{product.category}</span>
      </div>

      <div style={{ padding:"18px 20px 22px" }}>
        <div style={{ fontWeight:800, fontSize:"1.1rem", marginBottom:4 }}>{product.name}</div>
        <div style={{ color: C.g3, fontSize:"0.85rem", fontWeight:600, marginBottom:2 }}>👨‍🌾 {farmer?.name || "—"}</div>
        <div style={{ color: C.muted, fontSize:"0.8rem", marginBottom:12 }}>📍 {farmer?.village || "—"}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <span style={{ fontSize:"1.4rem", fontWeight:900, color: C.o1 }}>
            ₹{product.price}<span style={{ fontSize:"0.75rem", fontWeight:600, color: C.muted }}>/{product.unit}</span>
          </span>
          <span style={{ fontSize:"0.78rem", color: C.g3, fontWeight:600 }}>📦 {product.stock} शिल्लक</span>
        </div>
        <button
          onClick={() => onOrder(product, farmer)}
          style={{
            width:"100%", background:"linear-gradient(135deg,#15803d,#22c55e)",
            color:"white", border:"none", borderRadius:40,
            padding:"12px", fontWeight:800, fontSize:"0.95rem",
            cursor:"pointer", fontFamily:"inherit",
            boxShadow:"0 4px 16px rgba(21,128,61,0.35)",
            transition:"transform 0.18s, box-shadow 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(21,128,61,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(21,128,61,0.35)"; }}
        >🛒 ऑर्डर करा</button>
      </div>
    </div>
  );
}

// =================== FARMER CARD ===================
function FarmerCard({ farmer, delay=0 }) {
  return (
    <div className="farmer-card" style={{ animation:`fadeUp 0.7s ${delay}s both` }}>
      <div style={{
        position:"absolute", top:0, right:0,
        width:90, height:90,
        background:"linear-gradient(135deg,#f0fdf4,transparent)",
        borderBottomLeftRadius:80, pointerEvents:"none",
      }} />
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
        <div style={{
          width:60, height:60, borderRadius:"50%",
          background:"linear-gradient(135deg,#dcfce7,#86efac)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"2.1rem", flexShrink:0,
        }}>👨‍🌾</div>
        <div>
          <div style={{ fontWeight:800, fontSize:"1.1rem", color: C.g1 }}>{farmer.name}</div>
          <div style={{ fontSize:"0.82rem", color: C.muted, marginBottom:4 }}>📍 {farmer.village}</div>
          {farmer.verified && <Badge text="✅ सत्यापित शेतकरी" />}
        </div>
      </div>
      <div style={{ background:"#f0fdf4", borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:"0.87rem", lineHeight:1.8 }}>
        <span style={{ fontWeight:700, color: C.g3 }}>🌾 पिके: </span>
        {Array.isArray(farmer.crops) ? farmer.crops.join(", ") : farmer.crops}
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, fontSize:"0.85rem" }}>
        <span style={{ color: C.muted }}>💰 {farmer.priceRange || "—"}</span>
        <span>⭐ {farmer.rating > 0 ? farmer.rating : "नवीन"}</span>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <a href={`tel:${farmer.phone}`} style={{
          flex:1, background:"linear-gradient(135deg,#15803d,#22c55e)",
          color:"white", borderRadius:40, padding:"11px",
          fontWeight:800, fontSize:"0.88rem", cursor:"pointer",
          textAlign:"center", textDecoration:"none",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          transition:"transform 0.18s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >📞 कॉल</a>
        <a href={`https://wa.me/91${farmer.phone}?text=${encodeURIComponent(`नमस्कार ${farmer.name} जी, मला तुमच्याकडून माल घ्यायचा आहे.`)}`}
          target="_blank" rel="noreferrer"
          style={{
            flex:1, background:"linear-gradient(135deg,#ea580c,#f97316)",
            color:"white", borderRadius:40, padding:"11px",
            fontWeight:800, fontSize:"0.88rem",
            textAlign:"center", textDecoration:"none",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            transition:"transform 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >💬 WhatsApp</a>
      </div>
    </div>
  );
}

// =================== MODAL ===================
function Modal({ open, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,0,0,0.65)", backdropFilter:"blur(5px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"white", borderRadius:26, padding:"38px 32px",
        maxWidth:468, width:"100%",
        boxShadow:"0 30px 80px rgba(0,0,0,0.35)",
        position:"relative",
        animation:"scaleIn 0.28s cubic-bezier(.34,1.56,.64,1) both",
        maxHeight:"90vh", overflowY:"auto",
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:14, right:18,
          background:"#f1f5f9", border:"none", borderRadius:"50%",
          width:34, height:34, fontSize:"1.1rem", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background="#fee2e2"}
          onMouseLeave={e => e.currentTarget.style.background="#f1f5f9"}
        >✕</button>
        {children}
      </div>
    </div>
  );
}

// =================== MAIN APP ===================
export default function FarmDirect() {
  const [page, setPage] = useState("home");
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg:"", show:false });
  const [modal, setModal] = useState({ open:false, type:null, data:null });
  const [regTab, setRegTab] = useState("farmer");

  useEffect(() => {
    console.log("✅ App updated code successfully loaded!");
  }, []);

  // ✅ FIXED: Completely separate, independent state for each form
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderQty, setOrderQty] = useState("1");

  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerVillage, setFarmerVillage] = useState("");
  const [farmerCrops, setFarmerCrops] = useState("");
  const [farmerArea, setFarmerArea] = useState("");

  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custNeeds, setCustNeeds] = useState("");

  const [filterCat, setFilterCat] = useState("सर्व");

  const showToast = (msg) => {
    setToast({ msg, show:true });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3500);
  };

  const refreshData = () => {
    return Promise.all([api.getFarmers(), api.getProducts(), api.getOrders()])
      .then(([f, p, o]) => { setFarmers(f); setProducts(p); setOrders(o); });
  };

  useEffect(() => {
    refreshData().then(() => setLoading(false));
  }, []);

  const getFarmer = (id) => farmers.find(f => f.id === id);

  const handleOrder = (product, farmer) => {
    // Reset order form fields completely before opening modal
    setOrderName("");
    setOrderPhone("");
    setOrderAddress("");
    setOrderQty("1");
    setModal({ open:true, type:"order", data:{ product, farmer } });
  };

  const submitOrder = async () => {
    const name = orderName.trim();
    const phone = orderPhone.trim();
    const address = orderAddress.trim();
    const qty = orderQty;

    if (!name || !phone || !address) {
      showToast("⚠️ सर्व माहिती भरा — नाव, फोन, पत्ता!"); return;
    }
    if (phone.length < 10) {
      showToast("⚠️ योग्य फोन नंबर टाका!"); return;
    }

    const productName = modal.data.product.name;
    const farmerName2 = modal.data.farmer?.name;
    const farmerPhone2 = modal.data.farmer?.phone;

    await api.placeOrder({
      product: productName,
      productEmoji: modal.data.product.emoji,
      farmer: farmerName2,
      farmerPhone: farmerPhone2,
      qty: qty,
      customerName: name,
      customerPhone: phone,
      address: address,
    });

    await refreshData();
    setModal({ open:false, type:null, data:null });
    setOrderName(""); setOrderPhone(""); setOrderAddress(""); setOrderQty("1");
    showToast(`✅ ऑर्डर यशस्वी! ${farmerName2} यांना लवकरच संपर्क होईल.`);
    setTimeout(() => setPage("orders"), 1500);
  };

  const submitFarmer = async () => {
    const name = farmerName.trim();
    const phone = farmerPhone.trim();
    const village = farmerVillage.trim();
    const crops = farmerCrops.trim();
    if (!name || !phone || !village || !crops) {
      showToast("⚠️ सर्व माहिती भरा!"); return;
    }
    await api.registerFarmer({
      name, phone, village,
      crops: crops.split(",").map(s => s.trim()).filter(Boolean),
      priceRange:"—", rating:0, verified:false,
    });
    await refreshData();
    setFarmerName(""); setFarmerPhone(""); setFarmerVillage(""); setFarmerCrops(""); setFarmerArea("");
    showToast(`🌾 ${name} — शेतकरी यशस्वी नोंदणी झाली!`);
  };

  const submitCustomer = async () => {
    const name = custName.trim();
    const phone = custPhone.trim();
    const address = custAddress.trim();
    if (!name || !phone || !address) {
      showToast("⚠️ सर्व माहिती भरा!"); return;
    }
    await api.registerCustomer({ name, phone, address, needs: custNeeds });
    setCustName(""); setCustPhone(""); setCustAddress(""); setCustNeeds("");
    showToast(`🛒 ${name} — ग्राहक म्हणून नोंदणी झाली!`);
  };

  const cats = ["सर्व","भाज्या","फळे","धान्य"];
  const filteredProducts = filterCat === "सर्व" ? products : products.filter(p => p.category === filterCat);

  const labelStyle = { display:"block", fontWeight:700, color: C.g3, marginBottom:6, fontSize:"0.88rem" };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Toast msg={toast.msg} show={toast.show} />

      {/* FLOATING CONTACT */}
      <div style={{ position:"fixed", bottom:90, left:18, zIndex:900, display:"flex", flexDirection:"column", gap:10 }}>
        <a href="tel:9270441850" className="floating-btn" title="Shivam Pravin Mundhe — Call" style={{
          background:"linear-gradient(135deg,#15803d,#22c55e)",
          boxShadow:"0 6px 20px rgba(21,128,61,0.5)",
        }}>📞</a>
        <a href="https://wa.me/919270441850" target="_blank" rel="noreferrer" className="floating-btn" style={{
          background:"linear-gradient(135deg,#ea580c,#f97316)",
          boxShadow:"0 6px 20px rgba(234,88,12,0.5)",
        }}>💬</a>
      </div>

      {/* HEADER */}
      <header style={{
        ...HERO_STYLE,
        position:"sticky", top:0, zIndex:100,
        boxShadow:"0 4px 28px rgba(20,83,45,0.35)",
      }}>
        <div style={{
          maxWidth:1200, margin:"0 auto", padding:"0 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          minHeight:68, flexWrap:"wrap", gap:8,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setPage("home")}>
            <span style={{ fontSize:"2rem", animation:"sway 2.5s ease-in-out infinite", display:"inline-block" }}>🌿</span>
            <div>
              <span style={{ fontSize:"1.55rem", fontWeight:900, color:"white", letterSpacing:"-0.5px" }}>ShivamFarm</span>
              <div style={{ fontSize:"0.65rem", color:"#86efac", fontWeight:700, marginTop:-3 }}>Shivam Pravin Mundhe</div>
            </div>
          </div>
          <nav style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[
              {id:"home", icon:"🏠", label:"मुख्यपान"},
              {id:"products", icon:"🛒", label:"उत्पादने"},
              {id:"farmers", icon:"👨‍🌾", label:"शेतकरी"},
              {id:"register", icon:"📝", label:"नोंदणी"},
              {id:"orders", icon:"📦", label:`ऑर्डर ${orders.length > 0 ? `(${orders.length})` : ""}`},
              {id:"contact", icon:"📞", label:"संपर्क"},
            ].map(n => (
              <button key={n.id} className={`nav-btn ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
                {n.icon} {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>

        {/* ===== HOME PAGE ===== */}
        {page === "home" && (
          <div>
            {/* HERO */}
            <div style={{
              ...HERO_STYLE,
              color:"white", textAlign:"center",
              padding:"100px 24px 110px",
              position:"relative", overflow:"hidden",
            }}>
              <LeafParticles />
              {/* Animated orbs */}
              {[
                { w:350, h:350, top:"-100px", left:"-100px", delay:"0s" },
                { w:220, h:220, bottom:"20px", right:"60px", delay:"2.5s" },
                { w:150, h:150, top:"35%", right:"5%", delay:"4.5s" },
              ].map((o,i) => (
                <div key={i} style={{
                  position:"absolute", width:o.w, height:o.h, borderRadius:"50%",
                  background:"rgba(255,255,255,0.06)",
                  top:o.top, bottom:o.bottom, left:o.left, right:o.right,
                  animation:`float ${6+i}s ${o.delay} ease-in-out infinite`,
                  pointerEvents:"none",
                }} />
              ))}

              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:"5.5rem", animation:"floatSlow 2.8s ease-in-out infinite", display:"inline-block", marginBottom:18, filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}>🌾</div>
                <h1 style={{
                  fontSize:"clamp(2rem,5vw,3.6rem)", fontWeight:900, lineHeight:1.2,
                  textShadow:"0 4px 24px rgba(0,0,0,0.35)",
                  animation:"fadeUp 0.8s both", marginBottom:14,
                }}>
                  Shivam Farm<br />
                  <span style={{
                    color:"#86efac",
                    textShadow:"0 0 40px rgba(134,239,172,0.6)",
                  }}>शेतकरी ते ग्राहक थेट जोडणी</span>
                </h1>
                <p style={{
                  fontSize:"clamp(1rem,2vw,1.22rem)", maxWidth:560, margin:"0 auto 16px",
                  opacity:0.92, animation:"fadeUp 0.9s 0.12s both", lineHeight:1.8,
                }}>
                  बाजाराशिवाय! दलालाशिवाय!
                </p>
                <p style={{
                  fontSize:"clamp(0.95rem,1.8vw,1.1rem)", maxWidth:520, margin:"0 auto 40px",
                  opacity:0.82, animation:"fadeUp 0.9s 0.2s both",
                  background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)",
                  padding:"10px 24px", borderRadius:40, display:"inline-block",
                  border:"1px solid rgba(255,255,255,0.2)",
                }}>
                  🥦 ताजे भाज्या • 🍅 टोमॅटो • 🥭 आंबा • 🌾 धान्य — थेट शेतातून!
                </p>
                <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 1s 0.28s both" }}>
                  <button className="hero-btn-primary" onClick={() => setPage("products")}>🛒 उत्पादने पहा</button>
                  <button className="hero-btn-secondary" onClick={() => setPage("register")}>👨‍🌾 शेतकरी म्हणून जोडा</button>
                </div>

                <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:58, flexWrap:"wrap" }}>
                  <StatCard icon="👨‍🌾" num={farmers.length} label="शेतकरी" delay={0.3} />
                  <StatCard icon="🛒" num={12} label="ग्राहक" delay={0.42} />
                  <StatCard icon="🥦" num={products.length} label="उत्पादने" delay={0.54} />
                  <StatCard icon="📦" num={orders.length + 120} label="ऑर्डर" delay={0.66} />
                </div>
              </div>
            </div>

            {/* HOW IT WORKS */}
            <div style={{ padding:"80px 24px", maxWidth:1100, margin:"0 auto" }}>
              <h2 style={{ textAlign:"center", fontSize:"2.3rem", fontWeight:900, color: C.g1, marginBottom:8 }}>कसे काम करते? 🤔</h2>
              <p style={{ textAlign:"center", color: C.muted, marginBottom:52, fontSize:"1.05rem" }}>फक्त ४ सोपे पावले</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:24 }}>
                {[
                  {num:"1", icon:"👨‍🌾", title:"शेतकरी नोंदणी", desc:"नाव, पत्ता, फोन, पिके नोंदवा"},
                  {num:"2", icon:"📋", title:"उत्पादन लिस्ट", desc:"उपलब्ध माल, किंमत थेट टाका"},
                  {num:"3", icon:"📱", title:"ग्राहक निवड", desc:"ऑनलाईन पाहा, थेट कॉल करा"},
                  {num:"4", icon:"🚚", title:"थेट डिलिव्हरी", desc:"शेतातून घरापर्यंत ताजे!"},
                ].map((s,i) => (
                  <div key={i} className="step-card" style={{ animation:`fadeUp 0.7s ${i*0.12}s both` }}>
                    <div style={{
                      width:38, height:38, borderRadius:"50%",
                      background: C.g1, color:"white",
                      display:"inline-flex", alignItems:"center", justifyContent:"center",
                      fontWeight:900, fontSize:"1.1rem", marginBottom:10,
                    }}>{s.num}</div>
                    <div style={{ fontSize:"3.2rem", margin:"10px 0 12px" }}>{s.icon}</div>
                    <h3 style={{ fontWeight:800, color: C.g1, fontSize:"1.08rem", marginBottom:8 }}>{s.title}</h3>
                    <p style={{ color: C.muted, fontSize:"0.9rem", lineHeight:1.7 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED PRODUCTS */}
            <div style={{
              background:"linear-gradient(180deg,#f0fdf4 0%,#dcfce7 100%)",
              padding:"80px 24px",
            }}>
              <h2 style={{ textAlign:"center", fontSize:"2.2rem", fontWeight:900, color: C.g1, marginBottom:8 }}>ताजी उत्पादने 🥦</h2>
              <p style={{ textAlign:"center", color: C.muted, marginBottom:44 }}>आज उपलब्ध — शेतातून थेट</p>
              {loading ? <Loader /> : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:24, maxWidth:1100, margin:"0 auto" }}>
                  {products.slice(0,4).map((p,i) => (
                    <FoodCard key={p.id} product={p} farmer={getFarmer(p.farmerId)} onOrder={handleOrder} delay={i*0.08} />
                  ))}
                </div>
              )}
              <div style={{ textAlign:"center", marginTop:40 }}>
                <button onClick={() => setPage("products")} style={{
                  background:"linear-gradient(135deg,#15803d,#22c55e)",
                  color:"white", border:"none", borderRadius:40, padding:"14px 36px",
                  fontWeight:800, fontSize:"1rem", cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"0 4px 18px rgba(21,128,61,0.35)",
                  transition:"transform 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                >सर्व उत्पादने पहा →</button>
              </div>
            </div>

            {/* RECENT ORDERS on home */}
            {orders.length > 0 && (
              <div style={{ padding:"60px 24px", maxWidth:900, margin:"0 auto" }}>
                <h2 style={{ fontSize:"1.8rem", fontWeight:900, color: C.g1, marginBottom:8, textAlign:"center" }}>अलीकडील ऑर्डर 📦</h2>
                <p style={{ textAlign:"center", color: C.muted, marginBottom:28 }}>ताज्या ऑर्डर</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {orders.slice(-3).reverse().map((o,i) => (
                    <div key={o.id} className="order-row" style={{ animation:`slideIn 0.4s ${i*0.1}s both` }}>
                      <div>
                        <div style={{ fontWeight:800, color: C.g1 }}>{o.productEmoji || "📦"} #{o.id} — {o.product} × {o.qty}</div>
                        <div style={{ color: C.muted, fontSize:"0.85rem", marginTop:3 }}>👤 {o.customerName} | 👨‍🌾 {o.farmer}</div>
                      </div>
                      <Badge text="⏳ Pending" bg="#fef3c7" color="#92400e" />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign:"center", marginTop:20 }}>
                  <button onClick={() => setPage("orders")} style={{
                    background:"linear-gradient(135deg,#15803d,#22c55e)",
                    color:"white", border:"none", borderRadius:40, padding:"11px 28px",
                    fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                  }}>सर्व ऑर्डर पहा →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {page === "products" && (
          <div style={{ padding:"56px 24px", maxWidth:1200, margin:"0 auto" }}>
            <h2 style={{ fontSize:"2.2rem", fontWeight:900, color: C.g1, marginBottom:6, textAlign:"center" }}>सर्व उत्पादने 🛒</h2>
            <p style={{ textAlign:"center", color: C.muted, marginBottom:32 }}>शेतकऱ्यांकडून थेट ताजे</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:40, flexWrap:"wrap" }}>
              {cats.map(c => (
                <button key={c} className={`filter-btn ${filterCat===c?"active":""}`} onClick={() => setFilterCat(c)}>{c}</button>
              ))}
            </div>
            {loading ? <Loader /> : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:24 }}>
                {filteredProducts.map((p,i) => (
                  <FoodCard key={p.id} product={p} farmer={getFarmer(p.farmerId)} onOrder={handleOrder} delay={i*0.06} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== FARMERS ===== */}
        {page === "farmers" && (
          <div style={{ padding:"56px 24px", maxWidth:1100, margin:"0 auto" }}>
            <h2 style={{ fontSize:"2.2rem", fontWeight:900, color: C.g1, marginBottom:6, textAlign:"center" }}>आमचे शेतकरी 👨‍🌾</h2>
            <p style={{ textAlign:"center", color: C.muted, marginBottom:44 }}>थेट संपर्क करा</p>
            {loading ? <Loader /> : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))", gap:24 }}>
                {farmers.map((f,i) => <FarmerCard key={f.id} farmer={f} delay={i*0.09} />)}
              </div>
            )}
          </div>
        )}

        {/* ===== REGISTER ===== */}
        {page === "register" && (
          <div style={{
            ...HERO_STYLE,
            minHeight:"85vh", padding:"64px 24px",
          }}>
            <h2 style={{ color:"white", fontSize:"2.3rem", fontWeight:900, textAlign:"center", marginBottom:6 }}>नोंदणी करा 📝</h2>
            <p style={{ color:"rgba(255,255,255,0.82)", textAlign:"center", marginBottom:36 }}>मोफत नोंदणी — शेतकरी आणि ग्राहक दोन्ही</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:36, flexWrap:"wrap" }}>
              {[["farmer","👨‍🌾 शेतकरी"],["customer","🛒 ग्राहक"]].map(([id,label]) => (
                <button key={id} className={`reg-tab-btn ${regTab===id?"active":""}`} onClick={() => setRegTab(id)}>{label}</button>
              ))}
            </div>

            <div style={{
              background:"white", borderRadius:26, padding:"40px 34px",
              maxWidth:520, margin:"0 auto",
              boxShadow:"0 24px 64px rgba(0,0,0,0.25)",
              animation:"scaleIn 0.3s cubic-bezier(.34,1.56,.64,1) both",
            }}>
              {regTab === "farmer" ? (
                <>
                  <h3 style={{ color: C.g1, fontSize:"1.3rem", fontWeight:800, marginBottom:24, textAlign:"center" }}>👨‍🌾 शेतकरी नोंदणी</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div>
                      <label style={labelStyle}>पूर्ण नाव</label>
                      <input className="input-field" value={farmerName} onChange={e => setFarmerName(e.target.value)} placeholder="तुमचे नाव" />
                    </div>
                    <div>
                      <label style={labelStyle}>फोन नंबर</label>
                      <input className="input-field" value={farmerPhone} onChange={e => setFarmerPhone(e.target.value)} placeholder="9XXXXXXXXX" />
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={labelStyle}>गाव / पत्ता</label>
                    <input className="input-field" value={farmerVillage} onChange={e => setFarmerVillage(e.target.value)} placeholder="गाव, तालुका, जिल्हा" />
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={labelStyle}>पिके (स्वल्पविरामाने वेगळे करा)</label>
                    <textarea className="input-field" style={{ height:80, resize:"vertical" }} value={farmerCrops} onChange={e => setFarmerCrops(e.target.value)} placeholder="टोमॅटो, कांदा, गहू..." />
                  </div>
                  <div style={{ marginBottom:24 }}>
                    <label style={labelStyle}>शेती क्षेत्रफळ (एकर)</label>
                    <input className="input-field" type="number" value={farmerArea} onChange={e => setFarmerArea(e.target.value)} placeholder="2" />
                  </div>
                  <button className="submit-btn" onClick={submitFarmer} style={{
                    background:"linear-gradient(135deg,#15803d,#22c55e)",
                    color:"white", boxShadow:"0 6px 22px rgba(21,128,61,0.4)",
                  }}>✅ शेतकरी म्हणून नोंदणी करा</button>
                </>
              ) : (
                <>
                  <h3 style={{ color: C.g1, fontSize:"1.3rem", fontWeight:800, marginBottom:24, textAlign:"center" }}>🛒 ग्राहक नोंदणी</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div>
                      <label style={labelStyle}>पूर्ण नाव</label>
                      <input className="input-field" value={custName} onChange={e => setCustName(e.target.value)} placeholder="तुमचे नाव" />
                    </div>
                    <div>
                      <label style={labelStyle}>फोन नंबर</label>
                      <input className="input-field" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="9XXXXXXXXX" />
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={labelStyle}>पूर्ण पत्ता</label>
                    <textarea className="input-field" style={{ height:80, resize:"vertical" }} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="घर नं, रस्ता, गाव, जिल्हा..." />
                  </div>
                  <div style={{ marginBottom:24 }}>
                    <label style={labelStyle}>कोणते अन्नपदार्थ हवेत?</label>
                    <input className="input-field" value={custNeeds} onChange={e => setCustNeeds(e.target.value)} placeholder="भाज्या, फळे, धान्य..." />
                  </div>
                  <button className="submit-btn" onClick={submitCustomer} style={{
                    background:"linear-gradient(135deg,#ea580c,#f97316)",
                    color:"white", boxShadow:"0 6px 22px rgba(234,88,12,0.4)",
                  }}>✅ ग्राहक म्हणून नोंदणी करा</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {page === "orders" && (
          <div style={{ padding:"56px 24px", maxWidth:920, margin:"0 auto" }}>
            <h2 style={{ fontSize:"2.2rem", fontWeight:900, color: C.g1, marginBottom:6, textAlign:"center" }}>ऑर्डर यादी 📦</h2>
            <p style={{ textAlign:"center", color: C.muted, marginBottom:36 }}>
              {orders.length > 0 ? `एकूण ${orders.length} ऑर्डर` : "अजून कोणतीही ऑर्डर नाही"}
            </p>
            {orders.length === 0 ? (
              <div style={{ textAlign:"center", padding:"70px 0", color: C.muted }}>
                <div style={{ fontSize:"5rem", marginBottom:18, animation:"floatSlow 3s ease-in-out infinite", display:"inline-block" }}>📭</div>
                <p style={{ fontSize:"1.1rem", marginBottom:24 }}>अजून कोणतीही ऑर्डर नाही</p>
                <button onClick={() => setPage("products")} style={{
                  background:"linear-gradient(135deg,#15803d,#22c55e)",
                  color:"white", border:"none", borderRadius:40, padding:"13px 32px",
                  fontWeight:700, cursor:"pointer", fontFamily:"inherit", fontSize:"1rem",
                }}>🛒 उत्पादने पहा</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[...orders].reverse().map((o,i) => (
                  <div key={o.id} className="order-row" style={{ animation:`slideIn 0.4s ${i*0.07}s both` }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:"1.08rem", color: C.g1 }}>
                        {o.productEmoji || "📦"} #{o.id} — {o.product}
                        <span style={{ color: C.o1, fontWeight:700, marginLeft:8 }}>× {o.qty}</span>
                      </div>
                      <div style={{ color: C.muted, fontSize:"0.86rem", marginTop:5, display:"flex", gap:14, flexWrap:"wrap" }}>
                        <span>👤 {o.customerName}</span>
                        <span>📞 {o.customerPhone}</span>
                        <span>👨‍🌾 {o.farmer}</span>
                      </div>
                      <div style={{ color: C.muted, fontSize:"0.82rem", marginTop:3 }}>
                        📍 {o.address} &nbsp;|&nbsp; ⏰ {o.time}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                      <Badge
                        text={o.status === "pending" ? "⏳ Pending" : "✅ Done"}
                        bg={o.status === "pending" ? "#fef3c7" : "#dcfce7"}
                        color={o.status === "pending" ? "#92400e" : C.g1}
                      />
                      <a href={`tel:${o.farmerPhone}`} style={{
                        background:"linear-gradient(135deg,#15803d,#22c55e)",
                        color:"white", borderRadius:20, padding:"5px 14px",
                        fontWeight:700, fontSize:"0.78rem", textDecoration:"none",
                      }}>📞 शेतकरी कॉल</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CONTACT ===== */}
        {page === "contact" && (
          <div style={{ padding:"56px 24px", maxWidth:920, margin:"0 auto" }}>
            <h2 style={{ fontSize:"2.2rem", fontWeight:900, color: C.g1, marginBottom:6, textAlign:"center" }}>संपर्क करा 📞</h2>
            <p style={{ textAlign:"center", color: C.muted, marginBottom:46 }}>Shivam Pravin Mundhe — ShivamFarm संस्थापक</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:24, marginBottom:44 }}>
              {[
                { icon:"📞", title:"फोन कॉल", sub:"9270441850", desc:"सोमवार–रविवार, सकाळी ७ ते रात्री ९", href:"tel:9270441850", btn:"📞 आत्ता कॉल करा", color: C.g3 },
                { icon:"💬", title:"WhatsApp", sub:"9270441850", desc:"WhatsApp वर लवकर उत्तर मिळेल", href:"https://wa.me/919270441850", btn:"💬 WhatsApp करा", color: C.o1 },
                { icon:"📍", title:"सेवा क्षेत्र", sub:"महाराष्ट्र, भारत", desc:"संपूर्ण महाराष्ट्रभर सेवा उपलब्ध", href:null, btn:"📍 सर्व जिल्हे", color:"#7c3aed" },
              ].map((c,i) => (
                <div key={i} style={{
                  background:"white", borderRadius:22, padding:"38px 28px",
                  textAlign:"center", boxShadow:"0 8px 32px rgba(20,83,45,0.12)",
                  borderBottom:`5px solid ${c.color}`,
                  animation:`fadeUp 0.7s ${i*0.12}s both`,
                  transition:"transform 0.22s, box-shadow 0.22s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow="0 24px 56px rgba(20,83,45,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(20,83,45,0.12)"; }}
                >
                  <div style={{ fontSize:"3.2rem", marginBottom:12 }}>{c.icon}</div>
                  <h3 style={{ fontWeight:800, color: C.g1, fontSize:"1.2rem", marginBottom:7 }}>{c.title}</h3>
                  <div style={{ fontWeight:800, color:c.color, fontSize:"1.2rem", marginBottom:7 }}>{c.sub}</div>
                  <p style={{ color: C.muted, fontSize:"0.9rem", marginBottom:22, lineHeight:1.7 }}>{c.desc}</p>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{
                      background:c.color, color:"white", padding:"12px 28px",
                      borderRadius:40, fontWeight:700, textDecoration:"none",
                      fontSize:"0.95rem", display:"inline-block",
                      transition:"transform 0.18s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform="scale(1.07)"}
                      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                    >{c.btn}</a>
                  ) : (
                    <button onClick={() => showToast("📍 महाराष्ट्रातील सर्व जिल्ह्यांमध्ये सेवा!")} style={{
                      background:c.color, color:"white", padding:"12px 28px",
                      borderRadius:40, fontWeight:700, border:"none",
                      fontSize:"0.95rem", cursor:"pointer", fontFamily:"inherit",
                    }}>{c.btn}</button>
                  )}
                </div>
              ))}
            </div>

            {/* Credit card */}
            <div style={{
              ...HERO_STYLE,
              borderRadius:26, padding:"44px 32px",
              textAlign:"center", color:"white",
              position:"relative", overflow:"hidden",
            }}>
              <div style={{ fontSize:"3.5rem", marginBottom:14, animation:"floatSlow 3s ease-in-out infinite", display:"inline-block" }}>🌟</div>
              <h3 style={{ fontSize:"1.7rem", fontWeight:900, marginBottom:8 }}>Shivam Pravin Mundhe</h3>
              <p style={{ opacity:0.88, fontSize:"1.08rem", marginBottom:22 }}>ShivamFarm — शेतकरी ते ग्राहक थेट जोडणी प्लॅटफॉर्म</p>
              <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                <a href="tel:9270441850" style={{
                  background:"rgba(255,255,255,0.16)", color:"white",
                  padding:"11px 26px", borderRadius:30, textDecoration:"none",
                  fontWeight:700, border:"1.5px solid rgba(255,255,255,0.45)",
                  transition:"background 0.2s",
                }}>📞 9270441850</a>
                <a href="https://wa.me/919270441850" target="_blank" rel="noreferrer" style={{
                  background:"rgba(255,255,255,0.16)", color:"white",
                  padding:"11px 26px", borderRadius:30, textDecoration:"none",
                  fontWeight:700, border:"1.5px solid rgba(255,255,255,0.45)",
                }}>💬 WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        ...HERO_STYLE,
        color:"rgba(255,255,255,0.9)", textAlign:"center", padding:"44px 24px 28px",
      }}>
        <div style={{ fontSize:"1.8rem", fontWeight:900, color:"white", marginBottom:10 }}>🌿 ShivamFarm</div>
        <p style={{ fontSize:"0.95rem", marginBottom:5, opacity:0.85 }}>शेतकरी ते ग्राहक — थेट जोडणी | बाजाराशिवाय ताजे अन्न</p>
        <p style={{ fontSize:"0.82rem", opacity:0.55, marginBottom:14 }}>© 2025 ShivamFarm | महाराष्ट्र, भारत</p>
        <div style={{ color:"#86efac", fontWeight:800, fontSize:"1rem" }}>
          🌟 Designed & Built by Shivam Pravin Mundhe | 📞 9270441850
        </div>
      </footer>

      {/* ===== ORDER MODAL ===== */}
      <Modal open={modal.open && modal.type === "order"} onClose={() => setModal({ open:false, type:null, data:null })}>
        {modal.data && (
          <>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ fontSize:"4rem", marginBottom:8, animation:"floatSlow 2s ease-in-out infinite", display:"inline-block" }}>{modal.data.product.emoji}</div>
              <h2 style={{ color: C.g1, fontSize:"1.5rem", fontWeight:900, marginBottom:5 }}>{modal.data.product.name}</h2>
              <p style={{ color: C.muted, fontSize:"0.9rem" }}>👨‍🌾 {modal.data.farmer?.name} &nbsp;|&nbsp; 💰 ₹{modal.data.product.price}/{modal.data.product.unit}</p>
            </div>

            <div style={{ marginBottom:13 }}>
              <label style={labelStyle}>तुमचे नाव *</label>
              <input
                className="input-field"
                value={orderName}
                onChange={e => setOrderName(e.target.value)}
                placeholder="पूर्ण नाव टाका"
                autoComplete="off"
              />
            </div>
            <div style={{ marginBottom:13 }}>
              <label style={labelStyle}>फोन नंबर *</label>
              <input
                className="input-field"
                value={orderPhone}
                onChange={e => setOrderPhone(e.target.value)}
                placeholder="9XXXXXXXXX"
                type="tel"
                autoComplete="off"
              />
            </div>
            <div style={{ marginBottom:13 }}>
              <label style={labelStyle}>डिलिव्हरी पत्ता *</label>
              <textarea
                className="input-field"
                style={{ height:78, resize:"vertical" }}
                value={orderAddress}
                onChange={e => setOrderAddress(e.target.value)}
                placeholder="घर नं, गाव, जिल्हा..."
                autoComplete="off"
              />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={labelStyle}>प्रमाण ({modal.data.product.unit}) *</label>
              <input
                className="input-field"
                type="number"
                min="1"
                value={orderQty}
                onChange={e => setOrderQty(e.target.value)}
              />
            </div>

            {/* Total price preview */}
            <div style={{
              background:"#f0fdf4", borderRadius:12, padding:"10px 16px",
              marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <span style={{ color: C.g3, fontWeight:700 }}>एकूण रक्कम:</span>
              <span style={{ color: C.o1, fontWeight:900, fontSize:"1.2rem" }}>
                ₹{(parseInt(orderQty)||1) * modal.data.product.price}
              </span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <button onClick={submitOrder} style={{
                background:"linear-gradient(135deg,#15803d,#22c55e)",
                color:"white", border:"none", borderRadius:40, padding:14,
                fontWeight:800, cursor:"pointer", fontFamily:"inherit", fontSize:"0.97rem",
                transition:"transform 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >✅ ऑर्डर द्या</button>
              <a href={`tel:${modal.data.farmer?.phone}`} style={{
                background:"linear-gradient(135deg,#ea580c,#f97316)",
                color:"white", borderRadius:40, padding:14,
                fontWeight:800, textAlign:"center", textDecoration:"none",
                fontSize:"0.97rem", display:"flex", alignItems:"center", justifyContent:"center",
              }}>📞 थेट कॉल</a>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}