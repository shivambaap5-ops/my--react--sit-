import { useState, useEffect } from "react";

// =================== BACKEND SIMULATION ===================
const DB = {
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
    const o = { id: DB.orders.length + 1, ...order, status: "pending", time: new Date().toLocaleTimeString("mr-IN") };
    DB.orders.push(o);
    return Promise.resolve({ success: true, order: o });
  },
};

// =================== CONSTANTS (no CSS vars in inline styles) ===================
const C = {
  g1: "#14532d", g2: "#166534", g3: "#15803d", g4: "#22c55e", g5: "#bbf7d0",
  o1: "#ea580c", o2: "#f97316", o3: "#fdba74",
  cream: "#fefce8", muted: "#6b7280", text: "#1c1917",
  radius: 16, radiusLg: 24,
  shadow: "0 8px 32px rgba(20,83,45,0.15)",
  shadowLg: "0 20px 60px rgba(20,83,45,0.22)",
  fieldBg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23166534'/%3E%3Cpath d='M0 60 Q30 40 60 60 Q90 80 120 60' fill='none' stroke='%2315803d' stroke-width='2' opacity='0.5'/%3E%3Cpath d='M0 90 Q30 70 60 90 Q90 110 120 90' fill='none' stroke='%2315803d' stroke-width='2' opacity='0.4'/%3E%3Cpath d='M0 30 Q30 10 60 30 Q90 50 120 30' fill='none' stroke='%2315803d' stroke-width='2' opacity='0.4'/%3E%3Ccircle cx='60' cy='20' r='3' fill='%2386efac' opacity='0.3'/%3E%3Ccircle cx='20' cy='80' r='2' fill='%2386efac' opacity='0.3'/%3E%3Ccircle cx='100' cy='50' r='2' fill='%2386efac' opacity='0.3'/%3E%3C/svg%3E")`,
  leafPtn: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cellipse cx='30' cy='30' rx='12' ry='18' fill='none' stroke='%2386efac' stroke-width='1.2' opacity='0.25' transform='rotate(30 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='12' ry='18' fill='none' stroke='%2386efac' stroke-width='1.2' opacity='0.15' transform='rotate(-30 30 30)'/%3E%3C/svg%3E")`,
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif; background: #fefce8; color: #1c1917; overflow-x: hidden; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f0fdf4; }
::-webkit-scrollbar-thumb { background: #15803d; border-radius: 3px; }
@keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
@keyframes float { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-16px) rotate(4deg); } }
@keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes slideIn { from { transform:translateX(120px); opacity:0; } to { transform:translateX(0); opacity:1; } }
@keyframes scaleIn { from { transform:scale(0.85); opacity:0; } to { transform:scale(1); opacity:1; } }
@keyframes sway { 0%,100% { transform:rotate(-6deg); } 50% { transform:rotate(6deg); } }
@keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
`;

// =================== SMALL COMPONENTS ===================

function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: "linear-gradient(135deg,#14532d,#15803d)",
      color: "white", padding: "14px 24px", borderRadius: 40,
      fontWeight: 700, fontSize: "0.95rem",
      boxShadow: "0 8px 32px rgba(20,83,45,0.4)",
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
      transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
      pointerEvents: "none",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: "1.3rem" }}>🌿</span> {msg}
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "40px 0", color: C.g3, fontWeight: 600, fontSize: "1.05rem" }}>
      <div style={{ width: 20, height: 20, border: "3px solid #bbf7d0", borderTopColor: C.g3, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      लोड होत आहे...
    </div>
  );
}

function Badge({ text, color = "#14532d", bg = "#bbf7d0" }) {
  return (
    <span style={{ background: bg, color, fontSize: "0.73rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

function StatCard({ icon, num, label, delay = 0 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let c = 0;
    const step = Math.max(1, Math.ceil(num / 60));
    const t = setInterval(() => { c = Math.min(c + step, num); setCount(c); if (c >= num) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [num]);
  return (
    <div style={{
      background: "rgba(255,255,255,0.14)",
      backdropFilter: "blur(12px)",
      border: "1.5px solid rgba(255,255,255,0.25)",
      borderRadius: 20,
      padding: "20px 28px",
      textAlign: "center",
      animation: `fadeUp 0.7s ${delay}s both`,
      minWidth: 120,
    }}>
      <div style={{ fontSize: "2rem", marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", lineHeight: 1 }}>{count}+</div>
      <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", marginTop: 3 }}>{label}</div>
    </div>
  );
}

function FoodCard({ product, farmer, onOrder, delay = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "white",
        borderRadius: C.radiusLg,
        overflow: "hidden",
        boxShadow: hover ? C.shadowLg : C.shadow,
        transform: hover ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
        animation: `fadeUp 0.6s ${delay}s both`,
        cursor: "pointer",
      }}
    >
      <div style={{
        background: "linear-gradient(135deg,#dcfce7,#bbf7d0,#a7f3d0)",
        padding: "32px 16px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: C.leafPtn, backgroundSize: "60px" }} />
        <div style={{ fontSize: "4.5rem", animation: hover ? "pulse 0.6s infinite" : "none", position: "relative", zIndex: 1 }}>
          {product.emoji}
        </div>
        {product.stock < 60 && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: "#dc2626", color: "white",
            fontSize: "0.72rem", fontWeight: 800,
            padding: "4px 10px", borderRadius: 20,
            animation: "pulse 1.2s infinite",
          }}>⚡ कमी स्टॉक</span>
        )}
        <span style={{
          position: "absolute", top: 12, left: 12,
          background: C.g1, color: "white",
          fontSize: "0.72rem", fontWeight: 700,
          padding: "3px 10px", borderRadius: 20,
        }}>{product.category}</span>
      </div>

      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 4 }}>{product.name}</div>
        <div style={{ color: C.g3, fontSize: "0.85rem", fontWeight: 600, marginBottom: 3 }}>👨‍🌾 {farmer?.name || "—"}</div>
        <div style={{ color: C.muted, fontSize: "0.82rem", marginBottom: 10 }}>📍 {farmer?.village || "—"}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: "1.35rem", fontWeight: 900, color: C.o1 }}>
            ₹{product.price}<span style={{ fontSize: "0.78rem", fontWeight: 600, color: C.muted }}>/{product.unit}</span>
          </span>
          <span style={{ fontSize: "0.8rem", color: C.g3, fontWeight: 600 }}>📦 {product.stock} शिल्लक</span>
        </div>
        <button
          onClick={() => onOrder(product, farmer)}
          style={{
            width: "100%", background: "linear-gradient(135deg,#15803d,#22c55e)",
            color: "white", border: "none", borderRadius: 40,
            padding: "11px", fontWeight: 800, fontSize: "0.95rem",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(21,128,61,0.35)",
            transition: "transform 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >🛒 ऑर्डर करा</button>
      </div>
    </div>
  );
}

function FarmerCard({ farmer, delay = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "white",
        borderRadius: C.radiusLg,
        padding: "26px 24px",
        boxShadow: hover ? C.shadowLg : C.shadow,
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s ease",
        animation: `fadeUp 0.7s ${delay}s both`,
        borderLeft: "5px solid #22c55e",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 100, height: 100,
        background: "linear-gradient(135deg,#f0fdf4,transparent)",
        borderBottomLeftRadius: 80,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 58, height: 58, borderRadius: "50%",
          background: "linear-gradient(135deg,#dcfce7,#86efac)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", flexShrink: 0,
        }}>👨‍🌾</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.1rem", color: C.g1 }}>{farmer.name}</div>
          <div style={{ fontSize: "0.83rem", color: C.muted, marginBottom: 4 }}>📍 {farmer.village}</div>
          {farmer.verified && <Badge text="✅ सत्यापित शेतकरी" />}
        </div>
      </div>

      <div style={{
        background: "#f0fdf4", borderRadius: 12, padding: "10px 14px",
        marginBottom: 14, fontSize: "0.87rem", lineHeight: 1.7,
      }}>
        <span style={{ fontWeight: 700, color: C.g3 }}>🌾 पिके: </span>
        {Array.isArray(farmer.crops) ? farmer.crops.join(", ") : farmer.crops}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, fontSize: "0.85rem" }}>
        <span style={{ color: C.muted }}>💰 {farmer.priceRange || "—"}</span>
        <span>⭐ {farmer.rating > 0 ? farmer.rating : "नवीन"}</span>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <a href={`tel:${farmer.phone}`} style={{
          flex: 1, background: "linear-gradient(135deg,#15803d,#22c55e)",
          color: "white", borderRadius: 40, padding: "11px",
          fontWeight: 800, fontSize: "0.88rem", cursor: "pointer",
          textAlign: "center", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          boxShadow: "0 4px 14px rgba(21,128,61,0.3)",
          transition: "transform 0.18s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >📞 कॉल</a>
        <a
          href={`https://wa.me/91${farmer.phone}?text=${encodeURIComponent(`नमस्कार ${farmer.name} जी, मला तुमच्याकडून माल घ्यायचा आहे.`)}`}
          target="_blank" rel="noreferrer"
          style={{
            flex: 1, background: "linear-gradient(135deg,#ea580c,#f97316)",
            color: "white", borderRadius: 40, padding: "11px",
            fontWeight: 800, fontSize: "0.88rem",
            textAlign: "center", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            boxShadow: "0 4px 14px rgba(234,88,12,0.3)",
            transition: "transform 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >💬 WhatsApp</a>
      </div>
    </div>
  );
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 24, padding: "36px 32px",
        maxWidth: 460, width: "100%",
        boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
        position: "relative",
        animation: "scaleIn 0.28s cubic-bezier(.34,1.56,.64,1) both",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 18,
          background: "#f1f5f9", border: "none", borderRadius: "50%",
          width: 32, height: 32, fontSize: "1.1rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
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
  const [toast, setToast] = useState({ msg: "", show: false });
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [regTab, setRegTab] = useState("farmer");
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", qty: 1 });
  const [farmerForm, setFarmerForm] = useState({ name: "", phone: "", village: "", crops: "", area: "" });
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", address: "", needs: "" });
  const [filterCat, setFilterCat] = useState("सर्व");

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  };

  useEffect(() => {
    Promise.all([api.getFarmers(), api.getProducts(), api.getOrders()]).then(([f, p, o]) => {
      setFarmers(f); setProducts(p); setOrders(o); setLoading(false);
    });
  }, []);

  const getFarmer = (id) => farmers.find(f => f.id === id);

  const handleOrder = (product, farmer) => {
    setModal({ open: true, type: "order", data: { product, farmer } });
  };

  const submitOrder = async () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      showToast("⚠️ सर्व माहिती भरा!"); return;
    }
    await api.placeOrder({
      product: modal.data.product.name,
      farmer: modal.data.farmer?.name,
      farmerPhone: modal.data.farmer?.phone,
      qty: orderForm.qty,
      customerName: orderForm.name,
      customerPhone: orderForm.phone,
      address: orderForm.address,
    });
    const updatedOrders = await api.getOrders();
    setOrders(updatedOrders);
    setModal({ open: false, type: null, data: null });
    setOrderForm({ name: "", phone: "", address: "", qty: 1 });
    showToast(`✅ ऑर्डर यशस्वी! ${modal.data.farmer?.name} यांना लवकरच संपर्क करा.`);
  };

  const submitFarmer = async () => {
    const { name, phone, village, crops } = farmerForm;
    if (!name || !phone || !village || !crops) { showToast("⚠️ सर्व माहिती भरा!"); return; }
    await api.registerFarmer({
      name, phone, village,
      crops: crops.split(",").map(s => s.trim()),
      priceRange: "—", rating: 0, verified: false,
    });
    const updatedFarmers = await api.getFarmers();
    setFarmers(updatedFarmers);
    setFarmerForm({ name: "", phone: "", village: "", crops: "", area: "" });
    showToast(`🌾 ${name} — शेतकरी यशस्वी नोंदणी!`);
  };

  const submitCustomer = async () => {
    const { name, phone, address } = customerForm;
    if (!name || !phone || !address) { showToast("⚠️ सर्व माहिती भरा!"); return; }
    await api.registerCustomer(customerForm);
    setCustomerForm({ name: "", phone: "", address: "", needs: "" });
    showToast(`🛒 ${name} — ग्राहक म्हणून नोंदणी झाली!`);
  };

  const cats = ["सर्व", "भाज्या", "फळे", "धान्य"];
  const filteredProducts = filterCat === "सर्व" ? products : products.filter(p => p.category === filterCat);

  // shared input style — no CSS vars
  const inputStyle = {
    width: "100%", border: "2px solid #dcfce7", borderRadius: 12,
    padding: "12px 14px", fontSize: "0.95rem", fontFamily: "inherit",
    background: "#f0fdf4", transition: "border-color 0.2s", outline: "none",
  };
  const labelStyle = { display: "block", fontWeight: 700, color: C.g3, marginBottom: 6, fontSize: "0.9rem" };
  const focusIn = e => e.currentTarget.style.borderColor = "#22c55e";
  const focusOut = e => e.currentTarget.style.borderColor = "#dcfce7";

  const NavBtn = ({ id, label, icon }) => (
    <button
      onClick={() => setPage(id)}
      style={{
        background: page === id ? "rgba(255,255,255,0.22)" : "transparent",
        border: page === id ? "1.5px solid rgba(255,255,255,0.55)" : "1.5px solid transparent",
        color: "white", borderRadius: 30, padding: "8px 16px",
        fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
        fontFamily: "inherit", transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: 5,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
      onMouseLeave={e => e.currentTarget.style.background = page === id ? "rgba(255,255,255,0.22)" : "transparent"}
    >{icon} {label}</button>
  );

  // ---- hero bg style ----
  const heroBg = {
    backgroundImage: `${C.fieldBg}, linear-gradient(135deg, #14532d 0%, #15803d 100%)`,
    backgroundBlendMode: "overlay, normal",
    backgroundSize: "120px, cover",
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Toast msg={toast.msg} show={toast.show} />

      {/* FLOATING CONTACT BUTTONS */}
      <div style={{ position: "fixed", bottom: 28, left: 20, zIndex: 900, display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="tel:9270441850" title="Shivam Pravin Mundhe" style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg,#15803d,#22c55e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", textDecoration: "none",
          boxShadow: "0 6px 20px rgba(21,128,61,0.45)",
          transition: "transform 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.18)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >📞</a>
        <a href="https://wa.me/919270441850" target="_blank" rel="noreferrer" style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg,#ea580c,#f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", textDecoration: "none",
          boxShadow: "0 6px 20px rgba(234,88,12,0.45)",
          transition: "transform 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.18)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >💬</a>
      </div>

      {/* HEADER */}
      <header style={{
        ...heroBg,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 4px 24px rgba(20,83,45,0.28)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 68, flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
            <span style={{ fontSize: "2rem", animation: "sway 2.5s ease-in-out infinite", display: "inline-block" }}>🌿</span>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>ShivamFarm</span>
          </div>
          <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <NavBtn id="home" icon="🏠" label="मुख्यपान" />
            <NavBtn id="products" icon="🛒" label="उत्पादने" />
            <NavBtn id="farmers" icon="👨‍🌾" label="शेतकरी" />
            <NavBtn id="register" icon="📝" label="नोंदणी" />
            <NavBtn id="orders" icon="📦" label="ऑर्डर" />
            <NavBtn id="contact" icon="📞" label="संपर्क" />
          </nav>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 30, padding: "5px 14px",
            fontSize: "0.78rem", color: "#bbf7d0", fontWeight: 700,
          }}>✨ Shivam Pravin Mundhe</div>
        </div>
      </header>

      <main>

        {/* ===== HOME ===== */}
        {page === "home" && (
          <div>
            {/* HERO */}
            <div style={{
              ...heroBg,
              color: "white", textAlign: "center",
              padding: "90px 24px 100px",
              position: "relative", overflow: "hidden",
            }}>
              {/* Animated orbs */}
              {[
                { w: 300, h: 300, top: "-80px", left: "-80px", delay: "0s" },
                { w: 200, h: 200, bottom: "20px", right: "40px", delay: "2s" },
                { w: 140, h: 140, top: "40%", right: "8%", delay: "4s" },
              ].map((o, i) => (
                <div key={i} style={{
                  position: "absolute", width: o.w, height: o.h, borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  top: o.top, bottom: o.bottom, left: o.left, right: o.right,
                  animation: `float 6s ${o.delay} ease-in-out infinite`,
                  pointerEvents: "none",
                }} />
              ))}

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "5rem", animation: "float 2.5s ease-in-out infinite", display: "inline-block", marginBottom: 16 }}>🌾</div>
                <h1 style={{
                  fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1.2,
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  animation: "fadeUp 0.8s both", marginBottom: 14,
                }}>
                  Shivam Farm - शेतकरी ते ग्राहक<br />
                  <span style={{ color: "#86efac" }}>थेट जोडणी</span>
                </h1>
                <p style={{
                  fontSize: "clamp(1rem,2vw,1.25rem)", maxWidth: 580, margin: "0 auto 36px",
                  opacity: 0.92, animation: "fadeUp 0.9s 0.1s both", lineHeight: 1.7,
                }}>
                  बाजाराशिवाय! दलालाशिवाय! शेतकऱ्यांचे ताजे अन्न<br />थेट तुमच्या दारापर्यंत 🥦🍅🥭
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1s 0.2s both" }}>
                  <button onClick={() => setPage("products")} style={{
                    background: "linear-gradient(135deg,#ea580c,#f97316)",
                    color: "white", border: "none", borderRadius: 50, padding: "15px 38px",
                    fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 8px 28px rgba(234,88,12,0.45)",
                    transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.04)"; e.currentTarget.style.boxShadow = "0 16px 36px rgba(234,88,12,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 28px rgba(234,88,12,0.45)"; }}
                  >🛒 उत्पादने पहा</button>
                  <button onClick={() => setPage("register")} style={{
                    background: "transparent", color: "white",
                    border: "2.5px solid rgba(255,255,255,0.7)", borderRadius: 50,
                    padding: "13px 36px", fontSize: "1.1rem", fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >👨‍🌾 शेतकरी म्हणून जोडा</button>
                </div>

                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 52, flexWrap: "wrap" }}>
                  <StatCard icon="👨‍🌾" num={farmers.length} label="शेतकरी" delay={0.3} />
                  <StatCard icon="🛒" num={12} label="ग्राहक" delay={0.4} />
                  <StatCard icon="🥦" num={products.length} label="उत्पादने" delay={0.5} />
                  <StatCard icon="📦" num={orders.length + 120} label="ऑर्डर" delay={0.6} />
                </div>
              </div>
            </div>

            {/* HOW IT WORKS */}
            <div style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
              <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 900, color: C.g1, marginBottom: 8 }}>कसे काम करते? 🤔</h2>
              <p style={{ textAlign: "center", color: C.muted, marginBottom: 48, fontSize: "1.05rem" }}>फक्त ४ सोपे पावले</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 24 }}>
                {[
                  { num: "1", icon: "👨‍🌾", title: "शेतकरी नोंदणी", desc: "नाव, पत्ता, फोन, पिके नोंदवा" },
                  { num: "2", icon: "📋", title: "उत्पादन लिस्ट", desc: "उपलब्ध माल, किंमत थेट टाका" },
                  { num: "3", icon: "📱", title: "ग्राहक निवड", desc: "ऑनलाईन पाहा, थेट कॉल करा" },
                  { num: "4", icon: "🚚", title: "थेट डिलिव्हरी", desc: "शेतातून घरापर्यंत ताजे!" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "white", borderRadius: 20, padding: "32px 22px",
                    textAlign: "center", boxShadow: C.shadow,
                    borderTop: "5px solid #22c55e",
                    animation: `fadeUp 0.7s ${i * 0.1}s both`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = C.shadowLg; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = C.shadow; }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: C.g1, color: "white",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: "1.1rem", marginBottom: 12,
                    }}>{s.num}</div>
                    <div style={{ fontSize: "3rem", margin: "8px 0" }}>{s.icon}</div>
                    <h3 style={{ fontWeight: 800, color: C.g1, fontSize: "1.1rem", marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ color: C.muted, fontSize: "0.92rem", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED PRODUCTS */}
            <div style={{ background: "#f0fdf4", padding: "72px 24px" }}>
              <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 900, color: C.g1, marginBottom: 8 }}>ताजी उत्पादने 🥦</h2>
              <p style={{ textAlign: "center", color: C.muted, marginBottom: 40 }}>आज उपलब्ध</p>
              {loading ? <Loader /> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 22, maxWidth: 1100, margin: "0 auto" }}>
                  {products.slice(0, 4).map((p, i) => (
                    <FoodCard key={p.id} product={p} farmer={getFarmer(p.farmerId)} onOrder={handleOrder} delay={i * 0.08} />
                  ))}
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: 36 }}>
                <button onClick={() => setPage("products")} style={{
                  background: "linear-gradient(135deg,#15803d,#22c55e)",
                  color: "white", border: "none", borderRadius: 40, padding: "13px 34px",
                  fontWeight: 800, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 18px rgba(21,128,61,0.35)",
                  transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >सर्व उत्पादने पहा →</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {page === "products" && (
          <div style={{ padding: "56px 24px", maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: C.g1, marginBottom: 6, textAlign: "center" }}>सर्व उत्पादने 🛒</h2>
            <p style={{ textAlign: "center", color: C.muted, marginBottom: 32 }}>शेतकऱ्यांकडून थेट ताजे</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
              {cats.map(c => (
                <button key={c} onClick={() => setFilterCat(c)} style={{
                  background: filterCat === c ? "linear-gradient(135deg,#15803d,#22c55e)" : "white",
                  color: filterCat === c ? "white" : C.g3,
                  border: `2px solid ${filterCat === c ? "transparent" : "#22c55e"}`,
                  borderRadius: 40, padding: "9px 24px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem",
                  transition: "all 0.2s",
                  boxShadow: filterCat === c ? "0 4px 16px rgba(21,128,61,0.3)" : "none",
                }}>{c}</button>
              ))}
            </div>
            {loading ? <Loader /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 24 }}>
                {filteredProducts.map((p, i) => (
                  <FoodCard key={p.id} product={p} farmer={getFarmer(p.farmerId)} onOrder={handleOrder} delay={i * 0.06} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== FARMERS ===== */}
        {page === "farmers" && (
          <div style={{ padding: "56px 24px", maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: C.g1, marginBottom: 6, textAlign: "center" }}>आमचे शेतकरी 👨‍🌾</h2>
            <p style={{ textAlign: "center", color: C.muted, marginBottom: 40 }}>थेट संपर्क करा</p>
            {loading ? <Loader /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
                {farmers.map((f, i) => <FarmerCard key={f.id} farmer={f} delay={i * 0.09} />)}
              </div>
            )}
          </div>
        )}

        {/* ===== REGISTER ===== */}
        {page === "register" && (
          <div style={{
            ...heroBg,
            minHeight: "80vh", padding: "56px 24px",
          }}>
            <h2 style={{ color: "white", fontSize: "2.2rem", fontWeight: 900, textAlign: "center", marginBottom: 6 }}>नोंदणी करा 📝</h2>
            <p style={{ color: "rgba(255,255,255,0.82)", textAlign: "center", marginBottom: 36 }}>मोफत नोंदणी — शेतकरी आणि ग्राहक दोन्ही</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
              {[["farmer", "👨‍🌾 शेतकरी"], ["customer", "🛒 ग्राहक"]].map(([id, label]) => (
                <button key={id} onClick={() => setRegTab(id)} style={{
                  background: regTab === id ? "white" : "rgba(255,255,255,0.12)",
                  color: regTab === id ? C.g1 : "white",
                  border: `2px solid ${regTab === id ? "white" : "rgba(255,255,255,0.4)"}`,
                  borderRadius: 40, padding: "12px 36px", fontWeight: 800,
                  fontSize: "1rem", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: regTab === id ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
                }}>{label}</button>
              ))}
            </div>

            <div style={{
              background: "white", borderRadius: 24, padding: "38px 32px",
              maxWidth: 520, margin: "0 auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
              animation: "scaleIn 0.3s cubic-bezier(.34,1.56,.64,1) both",
            }}>
              {regTab === "farmer" ? (
                <>
                  <h3 style={{ color: C.g1, fontSize: "1.3rem", fontWeight: 800, marginBottom: 24, textAlign: "center" }}>👨‍🌾 शेतकरी नोंदणी</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div><label style={labelStyle}>पूर्ण नाव</label><input style={inputStyle} value={farmerForm.name} onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })} placeholder="तुमचे नाव" onFocus={focusIn} onBlur={focusOut} /></div>
                    <div><label style={labelStyle}>फोन नंबर</label><input style={inputStyle} value={farmerForm.phone} onChange={e => setFarmerForm({ ...farmerForm, phone: e.target.value })} placeholder="9XXXXXXXXX" onFocus={focusIn} onBlur={focusOut} /></div>
                  </div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>गाव / पत्ता</label><input style={inputStyle} value={farmerForm.village} onChange={e => setFarmerForm({ ...farmerForm, village: e.target.value })} placeholder="गाव, तालुका, जिल्हा" onFocus={focusIn} onBlur={focusOut} /></div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>पिके (स्वल्पविरामाने वेगळे करा)</label><textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={farmerForm.crops} onChange={e => setFarmerForm({ ...farmerForm, crops: e.target.value })} placeholder="टोमॅटो, कांदा, गहू..." onFocus={focusIn} onBlur={focusOut} /></div>
                  <div style={{ marginBottom: 22 }}><label style={labelStyle}>शेती क्षेत्रफळ (एकर)</label><input style={inputStyle} type="number" value={farmerForm.area} onChange={e => setFarmerForm({ ...farmerForm, area: e.target.value })} placeholder="2" onFocus={focusIn} onBlur={focusOut} /></div>
                  <button onClick={submitFarmer} style={{
                    width: "100%", background: "linear-gradient(135deg,#15803d,#22c55e)",
                    color: "white", border: "none", borderRadius: 40, padding: 15,
                    fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 6px 22px rgba(21,128,61,0.4)", transition: "transform 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >✅ शेतकरी म्हणून नोंदणी करा</button>
                </>
              ) : (
                <>
                  <h3 style={{ color: C.g1, fontSize: "1.3rem", fontWeight: 800, marginBottom: 24, textAlign: "center" }}>🛒 ग्राहक नोंदणी</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div><label style={labelStyle}>पूर्ण नाव</label><input style={inputStyle} value={customerForm.name} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} placeholder="तुमचे नाव" onFocus={focusIn} onBlur={focusOut} /></div>
                    <div><label style={labelStyle}>फोन नंबर</label><input style={inputStyle} value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} placeholder="9XXXXXXXXX" onFocus={focusIn} onBlur={focusOut} /></div>
                  </div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>पूर्ण पत्ता</label><textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} placeholder="घर नं, रस्ता, गाव, जिल्हा..." onFocus={focusIn} onBlur={focusOut} /></div>
                  <div style={{ marginBottom: 22 }}><label style={labelStyle}>कोणते अन्नपदार्थ हवेत?</label><input style={inputStyle} value={customerForm.needs} onChange={e => setCustomerForm({ ...customerForm, needs: e.target.value })} placeholder="भाज्या, फळे, धान्य..." onFocus={focusIn} onBlur={focusOut} /></div>
                  <button onClick={submitCustomer} style={{
                    width: "100%", background: "linear-gradient(135deg,#ea580c,#f97316)",
                    color: "white", border: "none", borderRadius: 40, padding: 15,
                    fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 6px 22px rgba(234,88,12,0.4)", transition: "transform 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >✅ ग्राहक म्हणून नोंदणी करा</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {page === "orders" && (
          <div style={{ padding: "56px 24px", maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: C.g1, marginBottom: 6, textAlign: "center" }}>ऑर्डर यादी 📦</h2>
            <p style={{ textAlign: "center", color: C.muted, marginBottom: 36 }}>सर्व ऑर्डर</p>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
                <div style={{ fontSize: "4rem", marginBottom: 16 }}>📭</div>
                <p style={{ fontSize: "1.1rem", marginBottom: 20 }}>अजून कोणतीही ऑर्डर नाही</p>
                <button onClick={() => setPage("products")} style={{
                  background: "linear-gradient(135deg,#15803d,#22c55e)",
                  color: "white", border: "none", borderRadius: 40, padding: "12px 30px",
                  fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "1rem",
                }}>🛒 उत्पादने पहा</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {orders.map((o, i) => (
                  <div key={o.id} style={{
                    background: "white", borderRadius: 18, padding: "22px 24px",
                    boxShadow: C.shadow, display: "flex",
                    alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: 12,
                    borderLeft: "5px solid #22c55e",
                    animation: `slideIn 0.4s ${i * 0.08}s both`,
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.1rem", color: C.g1 }}>#{o.id} — {o.product}</div>
                      <div style={{ color: C.muted, fontSize: "0.88rem", marginTop: 4 }}>👨‍🌾 {o.farmer} | 👤 {o.customerName} | 📞 {o.customerPhone}</div>
                      <div style={{ color: C.muted, fontSize: "0.83rem" }}>📍 {o.address} | ⏰ {o.time}</div>
                    </div>
                    <Badge
                      text={o.status === "pending" ? "⏳ Pending" : "✅ Done"}
                      bg={o.status === "pending" ? "#fef3c7" : "#dcfce7"}
                      color={o.status === "pending" ? "#92400e" : C.g1}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CONTACT ===== */}
        {page === "contact" && (
          <div style={{ padding: "56px 24px", maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: C.g1, marginBottom: 6, textAlign: "center" }}>संपर्क करा 📞</h2>
            <p style={{ textAlign: "center", color: C.muted, marginBottom: 44 }}>Shivam Pravin Mundhe</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24, marginBottom: 44 }}>
              {[
                { icon: "📞", title: "फोन कॉल", sub: "9270441850", desc: "सोमवार–रविवार, सकाळी ७–रात्री ९", href: "tel:9270441850", btn: "📞 आत्ता कॉल करा", color: C.g3 },
                { icon: "💬", title: "WhatsApp", sub: "9270441850", desc: "WhatsApp वर लवकर उत्तर मिळेल", href: "https://wa.me/919270441850", btn: "💬 WhatsApp करा", color: C.o1 },
                { icon: "📍", title: "सेवा क्षेत्र", sub: "महाराष्ट्र, भारत", desc: "संपूर्ण महाराष्ट्रभर सेवा उपलब्ध", href: null, btn: "📍 सर्व जिल्हे", color: "#7c3aed" },
              ].map((c, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: 22, padding: "36px 28px",
                  textAlign: "center", boxShadow: C.shadow,
                  borderBottom: `5px solid ${c.color}`,
                  animation: `fadeUp 0.7s ${i * 0.1}s both`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = C.shadowLg; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = C.shadow; }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: 12 }}>{c.icon}</div>
                  <h3 style={{ fontWeight: 800, color: C.g1, fontSize: "1.2rem", marginBottom: 6 }}>{c.title}</h3>
                  <div style={{ fontWeight: 800, color: c.color, fontSize: "1.22rem", marginBottom: 6 }}>{c.sub}</div>
                  <p style={{ color: C.muted, fontSize: "0.9rem", marginBottom: 20, lineHeight: 1.6 }}>{c.desc}</p>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{
                      background: c.color, color: "white", padding: "12px 26px",
                      borderRadius: 40, fontWeight: 700, textDecoration: "none",
                      fontSize: "0.95rem", display: "inline-block",
                      transition: "transform 0.18s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >{c.btn}</a>
                  ) : (
                    <button onClick={() => showToast("📍 महाराष्ट्रातील सर्व जिल्ह्यांमध्ये सेवा!")} style={{
                      background: c.color, color: "white", padding: "12px 26px",
                      borderRadius: 40, fontWeight: 700, border: "none",
                      fontSize: "0.95rem", cursor: "pointer", fontFamily: "inherit",
                    }}>{c.btn}</button>
                  )}
                </div>
              ))}
            </div>

            {/* Credit card */}
            <div style={{
              ...heroBg,
              borderRadius: 24, padding: "36px 32px",
              textAlign: "center", color: "white",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🌟</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: 8 }}>Shivam Pravin Mundhe</h3>
              <p style={{ opacity: 0.85, fontSize: "1.05rem", marginBottom: 18 }}>ShivamFarm — शेतकरी ते ग्राहक थेट जोडणी</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="tel:9270441850" style={{
                  background: "rgba(255,255,255,0.15)", color: "white",
                  padding: "10px 24px", borderRadius: 30, textDecoration: "none",
                  fontWeight: 700, border: "1.5px solid rgba(255,255,255,0.4)",
                }}>📞 9270441850</a>
                <a href="https://wa.me/919270441850" target="_blank" rel="noreferrer" style={{
                  background: "rgba(255,255,255,0.15)", color: "white",
                  padding: "10px 24px", borderRadius: 30, textDecoration: "none",
                  fontWeight: 700, border: "1.5px solid rgba(255,255,255,0.4)",
                }}>💬 WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        background: "linear-gradient(135deg,#14532d,#166534)",
        color: "rgba(255,255,255,0.88)", textAlign: "center", padding: "36px 24px 24px",
      }}>
        <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "white", marginBottom: 8 }}>🌿 ShivamFarm</div>
        <p style={{ fontSize: "0.95rem", marginBottom: 4 }}>शेतकरी ते ग्राहक — थेट जोडणी | बाजाराशिवाय ताजे अन्न</p>
        <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>© 2025 ShivamFarm | महाराष्ट्र, भारत</p>
        <div style={{ color: "#86efac", fontWeight: 800, marginTop: 14, fontSize: "1rem" }}>
          🌟 Designed & Built by Shivam Pravin Mundhe | 📞 9270441850
        </div>
      </footer>

      {/* ORDER MODAL */}
      <Modal open={modal.open && modal.type === "order"} onClose={() => setModal({ open: false, type: null, data: null })}>
        {modal.data && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 8 }}>{modal.data.product.emoji}</div>
              <h2 style={{ color: C.g1, fontSize: "1.5rem", fontWeight: 900 }}>{modal.data.product.name}</h2>
              <p style={{ color: C.muted }}>👨‍🌾 {modal.data.farmer?.name} | 💰 ₹{modal.data.product.price}/{modal.data.product.unit}</p>
            </div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>तुमचे नाव</label><input style={inputStyle} value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} placeholder="पूर्ण नाव" onFocus={focusIn} onBlur={focusOut} /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>फोन नंबर</label><input style={inputStyle} value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="9XXXXXXXXX" onFocus={focusIn} onBlur={focusOut} /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>डिलिव्हरी पत्ता</label><textarea style={{ ...inputStyle, height: 72, resize: "vertical" }} value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} placeholder="घर नं, गाव, जिल्हा..." onFocus={focusIn} onBlur={focusOut} /></div>
            <div style={{ marginBottom: 22 }}><label style={labelStyle}>प्रमाण ({modal.data.product.unit})</label><input style={inputStyle} type="number" min={1} value={orderForm.qty} onChange={e => setOrderForm({ ...orderForm, qty: e.target.value })} onFocus={focusIn} onBlur={focusOut} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={submitOrder} style={{
                background: "linear-gradient(135deg,#15803d,#22c55e)",
                color: "white", border: "none", borderRadius: 40, padding: 13,
                fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: "0.97rem",
              }}>✅ ऑर्डर द्या</button>
              <a href={`tel:${modal.data.farmer?.phone}`} style={{
                background: "linear-gradient(135deg,#ea580c,#f97316)",
                color: "white", borderRadius: 40, padding: 13,
                fontWeight: 800, textAlign: "center", textDecoration: "none",
                fontSize: "0.97rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}>📞 थेट कॉल</a>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}