import { useState, useEffect, useRef, useCallback } from "react";

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

// =================== UPGRADED GLOBAL CSS ===================
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green: #22c55e;
  --green-dark: #14532d;
  --green-mid: #15803d;
  --gold: #f59e0b;
  --orange: #ea580c;
  --bg-dark: #060d08;
  --bg-card: rgba(255,255,255,0.04);
  --border: rgba(34,197,94,0.18);
  --text: #f0fdf4;
  --muted: rgba(240,253,244,0.55);
  --cursor-size: 14px;
  --cursor-follower-size: 40px;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  overflow-x: hidden;
  cursor: none;
}

/* ===== CUSTOM CURSOR ===== */
#sf-cursor {
  position: fixed;
  width: var(--cursor-size);
  height: var(--cursor-size);
  background: #22c55e;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s;
  mix-blend-mode: difference;
}
#sf-cursor-follower {
  position: fixed;
  width: var(--cursor-follower-size);
  height: var(--cursor-follower-size);
  border: 1.5px solid rgba(34,197,94,0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition: all 0.12s cubic-bezier(0.23, 1, 0.32, 1);
}
body:has(a:hover) #sf-cursor,
body:has(button:hover) #sf-cursor,
body:has(.step-card:hover) #sf-cursor {
  width: 22px; height: 22px;
  background: #f59e0b;
}
body:has(a:hover) #sf-cursor-follower,
body:has(button:hover) #sf-cursor-follower,
body:has(.step-card:hover) #sf-cursor-follower {
  width: 56px; height: 56px;
  border-color: rgba(245,158,11,0.5);
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #060d08; }
::-webkit-scrollbar-thumb { background: linear-gradient(#22c55e, #14532d); border-radius: 2px; }

/* ===== KEYFRAMES ===== */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(6deg); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-12px) scale(1.05); }
}
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideIn { from { transform: translateX(120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.82); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes sway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(34,197,94,0.3), 0 0 40px rgba(34,197,94,0.1); }
  50% { box-shadow: 0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2); }
}
@keyframes textGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(34,197,94,0.4); }
  50% { text-shadow: 0 0 40px rgba(34,197,94,0.8), 0 0 60px rgba(34,197,94,0.3); }
}
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes orb1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(60px, -80px) scale(1.1); }
  66% { transform: translate(-40px, 40px) scale(0.9); }
}
@keyframes orb2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-80px, 60px) scale(0.85); }
  66% { transform: translate(50px, -50px) scale(1.15); }
}
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes borderGlow {
  0%, 100% { border-color: rgba(34,197,94,0.2); }
  50% { border-color: rgba(34,197,94,0.6); }
}
@keyframes slideReveal {
  from { opacity: 0; transform: translateY(60px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes leafFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.3; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
@keyframes wiggle { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }

/* ===== SCROLL REVEAL ===== */
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-left {
  opacity: 0;
  transform: translateX(-60px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right {
  opacity: 0;
  transform: translateX(60px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-right.visible { opacity: 1; transform: translateX(0); }

/* ===== GRADIENT TEXT ===== */
.gradient-text {
  background: linear-gradient(135deg, #22c55e 0%, #86efac 40%, #f59e0b 70%, #22c55e 100%);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}
.gradient-text-warm {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #ef4444 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

/* ===== GLASS CARD ===== */
.glass-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(34,197,94,0.15);
  border-radius: 20px;
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
}
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34,197,94,0.05) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.glass-card:hover::before { opacity: 1; }
.glass-card:hover {
  border-color: rgba(34,197,94,0.4);
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(34,197,94,0.15), 0 0 40px rgba(34,197,94,0.08);
}

/* ===== FOOD CARD (dark version) ===== */
.food-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(34,197,94,0.15);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: none;
  position: relative;
}
.food-card:hover {
  transform: translateY(-16px) scale(1.025);
  border-color: rgba(34,197,94,0.5);
  box-shadow: 0 30px 70px rgba(34,197,94,0.2), 0 0 0 1px rgba(34,197,94,0.3);
}
.food-card:hover .card-emoji { animation: pulse 0.5s infinite; }

/* ===== FARMER CARD ===== */
.farmer-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(34,197,94,0.15);
  border-left: 3px solid #22c55e;
  border-radius: 22px;
  padding: 26px 24px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
}
.farmer-card:hover {
  transform: translateY(-8px);
  border-color: rgba(34,197,94,0.4);
  box-shadow: 0 20px 50px rgba(34,197,94,0.15);
}

/* ===== STEP CARD ===== */
.step-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34,197,94,0.15);
  border-top: 3px solid #22c55e;
  border-radius: 22px;
  padding: 34px 22px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: none;
}
.step-card:hover {
  transform: translateY(-12px);
  border-color: rgba(34,197,94,0.4);
  box-shadow: 0 20px 50px rgba(34,197,94,0.12);
}
.step-card:hover .card-emoji { animation: pulse 0.5s infinite; }

/* ===== ORDER ROW ===== */
.order-row {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34,197,94,0.15);
  border-left: 3px solid #22c55e;
  border-radius: 18px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  transition: all 0.25s ease;
}
.order-row:hover {
  border-color: rgba(34,197,94,0.4);
  box-shadow: 0 10px 30px rgba(34,197,94,0.12);
}

/* ===== MAGNETIC BUTTON ===== */
.mag-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.mag-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.1);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}
.mag-btn:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* ===== HERO BUTTONS ===== */
.hero-btn-primary {
  background: linear-gradient(135deg, #15803d, #22c55e, #86efac);
  background-size: 200% auto;
  color: #060d08;
  border: none;
  border-radius: 50px;
  padding: 16px 42px;
  font-size: 1.08rem;
  font-weight: 900;
  cursor: none;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 28px rgba(34,197,94,0.4);
  animation: gradientShift 3s ease infinite;
  position: relative;
  overflow: hidden;
}
.hero-btn-primary:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 20px 50px rgba(34,197,94,0.5);
}
.hero-btn-secondary {
  background: transparent;
  color: #f0fdf4;
  border: 1.5px solid rgba(34,197,94,0.5);
  border-radius: 50px;
  padding: 14px 40px;
  font-size: 1.08rem;
  font-weight: 800;
  cursor: none;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
}
.hero-btn-secondary:hover {
  background: rgba(34,197,94,0.1);
  border-color: #22c55e;
  transform: translateY(-4px);
  box-shadow: 0 0 30px rgba(34,197,94,0.2);
}

/* ===== NAV ===== */
.nav-btn {
  background: transparent;
  border: 1px solid transparent;
  color: rgba(240,253,244,0.8);
  border-radius: 30px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 0.87rem;
  cursor: none;
  font-family: inherit;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}
.nav-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05));
  border-radius: 30px;
  opacity: 0;
  transition: opacity 0.2s;
}
.nav-btn:hover::before, .nav-btn.active::before { opacity: 1; }
.nav-btn.active {
  border-color: rgba(34,197,94,0.4);
  color: #22c55e;
}
.nav-btn:hover { color: #22c55e; border-color: rgba(34,197,94,0.3); }

/* ===== FILTER BUTTONS ===== */
.filter-btn {
  border-radius: 40px;
  padding: 9px 24px;
  font-weight: 700;
  cursor: none;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1.5px solid rgba(34,197,94,0.3);
  background: transparent;
  color: rgba(240,253,244,0.7);
  position: relative;
  overflow: hidden;
}
.filter-btn.active {
  background: linear-gradient(135deg, #15803d, #22c55e);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(34,197,94,0.4);
}
.filter-btn:hover { transform: translateY(-2px); color: #22c55e; border-color: #22c55e; }

/* ===== REG TAB ===== */
.reg-tab-btn {
  border-radius: 40px;
  padding: 12px 36px;
  font-weight: 800;
  font-size: 1rem;
  cursor: none;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.reg-tab-btn.active {
  background: linear-gradient(135deg, #22c55e, #86efac);
  color: #060d08;
  border: 2px solid transparent;
  box-shadow: 0 6px 24px rgba(34,197,94,0.4);
}
.reg-tab-btn:not(.active) {
  background: rgba(255,255,255,0.06);
  color: rgba(240,253,244,0.8);
  border: 1.5px solid rgba(34,197,94,0.25);
}
.reg-tab-btn:hover { transform: scale(1.05); }

/* ===== FLOATING BUTTON ===== */
.floating-btn {
  width: 54px; height: 54px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: none;
}
.floating-btn:hover { transform: scale(1.2) rotate(-5deg); }

/* ===== SUBMIT BUTTON ===== */
.submit-btn {
  width: 100%; border: none;
  border-radius: 40px; padding: 15px;
  font-size: 1.05rem; font-weight: 800;
  cursor: none; font-family: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.submit-btn:hover { transform: scale(1.03); }

/* ===== INPUTS ===== */
input, textarea, select {
  font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif !important;
}
.input-field {
  width: 100%;
  border: 1.5px solid rgba(34,197,94,0.2);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.95rem;
  font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif;
  background: rgba(255,255,255,0.05);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  color: var(--text);
  cursor: none;
}
.input-field:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
  background: rgba(255,255,255,0.07);
}
.input-field::placeholder { color: rgba(240,253,244,0.35); }

/* ===== MARQUEE ===== */
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }

/* ===== SECTION DIVIDER ===== */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent);
  margin: 0;
}

/* ===== VIDEO BG ===== */
.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(6,13,8,0.88) 0%, rgba(20,83,45,0.75) 50%, rgba(6,13,8,0.92) 100%);
  z-index: 1;
}

/* ===== GLOW ORBS ===== */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.35;
}
`;

// =================== CURSOR COMPONENT ===================
function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    const animate = () => {
      followerPos.current.x += (posRef.current.x - followerPos.current.x) * 0.12;
      followerPos.current.y += (posRef.current.y - followerPos.current.y) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = followerPos.current.x + "px";
        followerRef.current.style.top = followerPos.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="sf-cursor" ref={cursorRef} style={{ position:"fixed", pointerEvents:"none", zIndex:99999 }} />
      <div id="sf-cursor-follower" ref={followerRef} style={{ position:"fixed", pointerEvents:"none", zIndex:99998 }} />
    </>
  );
}

// =================== MAGNETIC BUTTON ===================
function MagButton({ children, onClick, style, className, href, target }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  };
  const handleMouseLeave = () => {
    ref.current.style.transform = "translate(0,0)";
    ref.current.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  };
  const handleMouseEnter = () => {
    ref.current.style.transition = "transform 0.15s ease";
  };

  if (href) {
    return (
      <a ref={ref} href={href} target={target} rel="noreferrer"
        onClick={(e) => { if (onClick) onClick(e); }}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}
        className={`mag-btn ${className || ""}`} style={{ ...style, display:"inline-flex", alignItems:"center", justifyContent:"center", textDecoration:"none" }}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} onClick={onClick}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}
      className={`mag-btn ${className || ""}`} style={style}>
      {children}
    </button>
  );
}

// =================== SCROLL REVEAL HOOK ===================
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

// =================== MARQUEE ===================
function MarqueeTicker() {
  const items = ["🍅 ताजे टोमॅटो", "🧅 लाल कांदा", "🥭 हापूस आंबा", "🌾 देशी गहू", "🥦 ताजे फ्लॉवर", "🍇 काळी द्राक्षे", "🥕 गाजर", "🌽 मका", "💰 थेट शेतातून", "🚜 दलालाशिवाय"];
  const doubled = [...items, ...items];
  return (
    <div style={{
      background: "linear-gradient(90deg, #14532d, #15803d, #22c55e, #15803d, #14532d)",
      padding: "12px 0",
      overflow: "hidden",
      borderTop: "1px solid rgba(34,197,94,0.3)",
      borderBottom: "1px solid rgba(34,197,94,0.3)",
    }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{
            padding: "0 32px",
            fontSize: "0.92rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.95)",
            whiteSpace: "nowrap",
            borderRight: i < doubled.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// =================== TOAST ===================
function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: "linear-gradient(135deg,#14532d,#22c55e)",
      color: "white", padding: "14px 24px", borderRadius: 40,
      fontWeight: 700, fontSize: "0.95rem",
      boxShadow: "0 8px 32px rgba(34,197,94,0.5), 0 0 60px rgba(34,197,94,0.2)",
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
      transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
      pointerEvents: "none",
      display: "flex", alignItems: "center", gap: 10,
      maxWidth: 340,
      border: "1px solid rgba(134,239,172,0.3)",
    }}>
      <span style={{ fontSize: "1.3rem" }}>🌿</span> {msg}
    </div>
  );
}

// =================== LOADER ===================
function Loader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"48px 0", color:"#22c55e", fontWeight:600, fontSize:"1.05rem" }}>
      <div style={{ width:22, height:22, border:"3px solid rgba(34,197,94,0.2)", borderTopColor:"#22c55e", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      लोड होत आहे...
    </div>
  );
}

// =================== BADGE ===================
function Badge({ text, color="#22c55e", bg="rgba(34,197,94,0.12)" }) {
  return (
    <span style={{ background:bg, color, fontSize:"0.73rem", fontWeight:700, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap", border:`1px solid ${color}33` }}>
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
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(34,197,94,0.2)",
      borderRadius: 22,
      padding: "20px 28px",
      textAlign: "center",
      animation: `fadeUp 0.7s ${delay}s both`,
      minWidth: 110,
      transition: "all 0.3s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(34,197,94,0.5)"; e.currentTarget.style.boxShadow="0 0 30px rgba(34,197,94,0.2)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(34,197,94,0.2)"; e.currentTarget.style.boxShadow="none"; }}
    >
      <div style={{ fontSize:"2rem", marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:"2.4rem", fontWeight:900, lineHeight:1 }} className="gradient-text">{count}+</div>
      <div style={{ fontSize:"0.82rem", color:"rgba(240,253,244,0.65)", marginTop:3, fontWeight:600 }}>{label}</div>
    </div>
  );
}

// =================== FOOD CARD ===================
function FoodCard({ product, farmer, onOrder, delay=0 }) {
  return (
    <div className="food-card reveal" style={{ animationDelay:`${delay}s` }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(20,83,45,0.8), rgba(34,197,94,0.15))",
        padding: "34px 16px 22px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(34,197,94,0.15)",
      }}>
        {/* Animated bg pattern */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`radial-gradient(circle at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(134,239,172,0.06) 0%, transparent 50%)`,
          pointerEvents:"none",
        }} />
        <div className="card-emoji" style={{ fontSize:"4.8rem", position:"relative", zIndex:1, display:"inline-block", filter:"drop-shadow(0 8px 16px rgba(34,197,94,0.3))" }}>
          {product.emoji}
        </div>
        {product.stock < 70 && (
          <span style={{
            position:"absolute", top:12, right:12,
            background:"linear-gradient(135deg,#dc2626,#ef4444)", color:"white",
            fontSize:"0.7rem", fontWeight:800,
            padding:"4px 10px", borderRadius:20,
            animation:"pulse 1.3s infinite",
          }}>⚡ कमी स्टॉक</span>
        )}
        <span style={{
          position:"absolute", top:12, left:12,
          background:"rgba(20,83,45,0.8)", color:"#86efac",
          border:"1px solid rgba(134,239,172,0.3)",
          fontSize:"0.7rem", fontWeight:700,
          padding:"3px 10px", borderRadius:20,
        }}>{product.category}</span>
      </div>

      <div style={{ padding:"18px 20px 22px" }}>
        <div style={{ fontWeight:800, fontSize:"1.1rem", marginBottom:4, color:"#f0fdf4" }}>{product.name}</div>
        <div style={{ color:"#22c55e", fontSize:"0.85rem", fontWeight:600, marginBottom:2 }}>👨‍🌾 {farmer?.name || "—"}</div>
        <div style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.8rem", marginBottom:12 }}>📍 {farmer?.village || "—"}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <span className="gradient-text-warm" style={{ fontSize:"1.4rem", fontWeight:900 }}>
            ₹{product.price}<span style={{ fontSize:"0.75rem", fontWeight:600, color:"rgba(240,253,244,0.5)" }}>/{product.unit}</span>
          </span>
          <span style={{ fontSize:"0.78rem", color:"#22c55e", fontWeight:600 }}>📦 {product.stock} शिल्लक</span>
        </div>
        <MagButton
          onClick={() => onOrder(product, farmer)}
          style={{
            width:"100%", background:"linear-gradient(135deg,#15803d,#22c55e)",
            color:"#060d08", border:"none", borderRadius:40,
            padding:"12px", fontWeight:900, fontSize:"0.95rem",
            boxShadow:"0 4px 20px rgba(34,197,94,0.4)",
          }}
        >🛒 ऑर्डर करा</MagButton>
      </div>
    </div>
  );
}

// =================== FARMER CARD ===================
function FarmerCard({ farmer, delay=0 }) {
  return (
    <div className="farmer-card reveal" style={{ animationDelay:`${delay}s` }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
        <div style={{
          width:60, height:60, borderRadius:"50%",
          background:"linear-gradient(135deg,#14532d,#22c55e)",
          border:"2px solid rgba(34,197,94,0.3)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"2.1rem", flexShrink:0,
          boxShadow:"0 0 20px rgba(34,197,94,0.2)",
        }}>👨‍🌾</div>
        <div>
          <div style={{ fontWeight:800, fontSize:"1.1rem", color:"#f0fdf4" }}>{farmer.name}</div>
          <div style={{ fontSize:"0.82rem", color:"rgba(240,253,244,0.5)", marginBottom:4 }}>📍 {farmer.village}</div>
          {farmer.verified && <Badge text="✅ सत्यापित शेतकरी" />}
        </div>
      </div>
      <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:"0.87rem", lineHeight:1.8, color:"rgba(240,253,244,0.8)" }}>
        <span style={{ fontWeight:700, color:"#22c55e" }}>🌾 पिके: </span>
        {Array.isArray(farmer.crops) ? farmer.crops.join(", ") : farmer.crops}
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, fontSize:"0.85rem" }}>
        <span style={{ color:"rgba(240,253,244,0.5)" }}>💰 {farmer.priceRange || "—"}</span>
        <span style={{ color:"#f59e0b" }}>⭐ {farmer.rating > 0 ? farmer.rating : "नवीन"}</span>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <MagButton href={`tel:${farmer.phone}`}
          style={{
            flex:1, background:"linear-gradient(135deg,#15803d,#22c55e)",
            color:"#060d08", borderRadius:40, padding:"11px",
            fontWeight:900, fontSize:"0.88rem",
            textAlign:"center",
          }}
        >📞 कॉल</MagButton>
        <MagButton href={`https://wa.me/91${farmer.phone}?text=${encodeURIComponent(`नमस्कार ${farmer.name} जी, मला तुमच्याकडून माल घ्यायचा आहे.`)}`}
          target="_blank"
          style={{
            flex:1, background:"linear-gradient(135deg,#ea580c,#f97316)",
            color:"white", borderRadius:40, padding:"11px",
            fontWeight:900, fontSize:"0.88rem",
            textAlign:"center",
          }}
        >💬 WhatsApp</MagButton>
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
      background:"rgba(6,13,8,0.85)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"rgba(15,25,18,0.95)",
        backdropFilter:"blur(20px)",
        border:"1px solid rgba(34,197,94,0.25)",
        borderRadius:26, padding:"38px 32px",
        maxWidth:468, width:"100%",
        boxShadow:"0 30px 80px rgba(34,197,94,0.2), 0 0 0 1px rgba(34,197,94,0.1)",
        position:"relative",
        animation:"scaleIn 0.28s cubic-bezier(.34,1.56,.64,1) both",
        maxHeight:"90vh", overflowY:"auto",
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:14, right:18,
          background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)",
          borderRadius:"50%", width:34, height:34,
          fontSize:"1.1rem", cursor:"none",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#f87171", transition:"all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.2)"; e.currentTarget.style.transform="scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; e.currentTarget.style.transform="scale(1)"; }}
        >✕</button>
        {children}
      </div>
    </div>
  );
}

// =================== VIDEO HERO BG ===================
function HeroBg({ style, children }) {
  return (
    <div style={{ position:"relative", overflow:"hidden", ...style }}>
      {/* Video background */}
      <video
        autoPlay muted loop playsInline
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", zIndex:0, opacity:0.25,
        }}
        onError={e => e.target.style.display="none"}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="video-overlay" />
      {/* Animated orbs */}
      <div className="orb" style={{ width:600, height:600, background:"radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)", top:"-200px", left:"-200px", animation:"orb1 12s ease-in-out infinite" }} />
      <div className="orb" style={{ width:400, height:400, background:"radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)", bottom:"-100px", right:"-100px", animation:"orb2 15s ease-in-out infinite" }} />
      <div style={{ position:"relative", zIndex:2 }}>{children}</div>
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

  useScrollReveal();

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
    setOrderName(""); setOrderPhone(""); setOrderAddress(""); setOrderQty("1");
    setModal({ open:true, type:"order", data:{ product, farmer } });
  };

  const submitOrder = async () => {
    const name = orderName.trim(), phone = orderPhone.trim(), address = orderAddress.trim();
    if (!name || !phone || !address) { showToast("⚠️ सर्व माहिती भरा!"); return; }
    const nameRegex = /^[A-Za-z\u0900-\u097F\s]+$/;
    if (!nameRegex.test(name)) { showToast("⚠️ नावात फक्त अक्षरे असावीत!"); return; }
    if (!/^\d{10}$/.test(phone)) { showToast("⚠️ फोन नंबर १० अंकी असावा!"); return; }
    const { product, farmer } = modal.data;
    await api.placeOrder({ product: product.name, productEmoji: product.emoji, farmer: farmer?.name, farmerPhone: farmer?.phone, qty: orderQty, customerName: name, customerPhone: phone, address });
    await refreshData();
    setModal({ open:false, type:null, data:null });
    setOrderName(""); setOrderPhone(""); setOrderAddress(""); setOrderQty("1");
    showToast(`✅ ऑर्डर यशस्वी! ${farmer?.name} यांना लवकरच संपर्क होईल.`);
    setTimeout(() => setPage("orders"), 1500);
  };

  const submitFarmer = async () => {
    const name = farmerName.trim(), phone = farmerPhone.trim(), village = farmerVillage.trim(), crops = farmerCrops.trim();
    if (!name || !phone || !village || !crops) { showToast("⚠️ सर्व माहिती भरा!"); return; }
    const nameRegex = /^[A-Za-z\u0900-\u097F\s]+$/;
    if (!nameRegex.test(name)) { showToast("⚠️ नावात फक्त अक्षरे असावीत!"); return; }
    if (!/^\d{10}$/.test(phone)) { showToast("⚠️ फोन नंबर १० अंकी असावा!"); return; }
    await api.registerFarmer({ name, phone, village, crops: crops.split(",").map(s=>s.trim()).filter(Boolean), priceRange:"—", rating:0, verified:false });
    await refreshData();
    setFarmerName(""); setFarmerPhone(""); setFarmerVillage(""); setFarmerCrops(""); setFarmerArea("");
    showToast(`🌾 ${name} — शेतकरी यशस्वी नोंदणी झाली!`);
  };

  const submitCustomer = async () => {
    const name = custName.trim(), phone = custPhone.trim(), address = custAddress.trim();
    if (!name || !phone || !address) { showToast("⚠️ सर्व माहिती भरा!"); return; }
    const nameRegex = /^[A-Za-z\u0900-\u097F\s]+$/;
    if (!nameRegex.test(name)) { showToast("⚠️ नावात फक्त अक्षरे असावीत!"); return; }
    if (!/^\d{10}$/.test(phone)) { showToast("⚠️ फोन नंबर १० अंकी असावा!"); return; }
    await api.registerCustomer({ name, phone, address, needs: custNeeds });
    setCustName(""); setCustPhone(""); setCustAddress(""); setCustNeeds("");
    showToast(`🛒 ${name} — ग्राहक म्हणून नोंदणी झाली!`);
  };

  const cats = ["सर्व","भाज्या","फळे","धान्य"];
  const filteredProducts = filterCat === "सर्व" ? products : products.filter(p => p.category === filterCat);

  const labelStyle = { display:"block", fontWeight:700, color:"#22c55e", marginBottom:6, fontSize:"0.88rem" };

  const C = { muted:"rgba(240,253,244,0.5)", text:"#f0fdf4", g3:"#22c55e", g1:"#14532d", o1:"#ea580c" };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <CustomCursor />
      <Toast msg={toast.msg} show={toast.show} />

      {/* FLOATING CONTACT */}
      <div style={{ position:"fixed", bottom:90, left:18, zIndex:900, display:"flex", flexDirection:"column", gap:10 }}>
        <MagButton href="tel:9270441850" onClick={() => showToast("📞 कॉल करा: 9270441850")} className="floating-btn" style={{
          background:"linear-gradient(135deg,#15803d,#22c55e)",
          boxShadow:"0 6px 20px rgba(34,197,94,0.5)",
        }}>📞</MagButton>
        <MagButton href="https://wa.me/919270441850" target="_blank" className="floating-btn" style={{
          background:"linear-gradient(135deg,#ea580c,#f97316)",
          boxShadow:"0 6px 20px rgba(234,88,12,0.5)",
        }}>💬</MagButton>
      </div>

      {/* HEADER */}
      <header style={{
        background:"rgba(6,13,8,0.85)",
        backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(34,197,94,0.15)",
        position:"sticky", top:0, zIndex:100,
        boxShadow:"0 4px 30px rgba(34,197,94,0.08)",
      }}>
        <div style={{
          maxWidth:1200, margin:"0 auto", padding:"0 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          minHeight:68, flexWrap:"wrap", gap:8,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"none" }} onClick={() => setPage("home")}>
            <span style={{ fontSize:"2rem", animation:"sway 2.5s ease-in-out infinite", display:"inline-block", filter:"drop-shadow(0 0 8px rgba(34,197,94,0.5))" }}>🌿</span>
            <div>
              <span className="gradient-text" style={{ fontSize:"1.55rem", fontWeight:900, letterSpacing:"-0.5px" }}>ShivamFarm</span>
              <div style={{ fontSize:"0.65rem", color:"rgba(134,239,172,0.7)", fontWeight:700, marginTop:-3 }}>Shivam Pravin Mundhe</div>
            </div>
          </div>
          <nav style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[
              {id:"home", icon:"🏠", label:"मुख्यपान"},
              {id:"products", icon:"🛒", label:"उत्पादने"},
              {id:"farmers", icon:"👨‍🌾", label:"शेतकरी"},
              {id:"register", icon:"📝", label:"नोंदणी"},
              {id:"orders", icon:"📦", label:`ऑर्डर${orders.length > 0 ? ` (${orders.length})` : ""}`},
              {id:"contact", icon:"📞", label:"संपर्क"},
            ].map(n => (
              <button key={n.id} className={`nav-btn ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
                <span style={{position:"relative", zIndex:1}}>{n.icon} {n.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* ===== HOME ===== */}
        {page === "home" && (
          <div>
            {/* HERO */}
            <HeroBg style={{ color:"#f0fdf4", textAlign:"center", padding:"100px 24px 110px", minHeight:"92vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div>
                <div style={{ display:"inline-block", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:40, padding:"6px 20px", marginBottom:24, backdropFilter:"blur(8px)" }}>
                  <span style={{ fontSize:"0.82rem", fontWeight:700, color:"#86efac", letterSpacing:"1px" }}>🌿 SHIVAM PRAVIN MUNDHE — MAHALAADIVI, AKOLE</span>
                </div>
                <div style={{ fontSize:"5.5rem", animation:"floatSlow 2.8s ease-in-out infinite", display:"inline-block", marginBottom:18, filter:"drop-shadow(0 0 30px rgba(34,197,94,0.5))" }}>🌾</div>
                <h1 style={{
                  fontSize:"clamp(2.2rem,5.5vw,4.2rem)", fontWeight:900, lineHeight:1.15,
                  animation:"fadeUp 0.8s both", marginBottom:14,
                  letterSpacing:"-1px",
                }}>
                  <span className="gradient-text">ShivamFarm</span><br />
                  <span style={{ color:"rgba(240,253,244,0.9)", fontSize:"70%" }}>शेतकरी ते ग्राहक थेट जोडणी</span>
                </h1>
                <p style={{
                  fontSize:"clamp(1rem,2vw,1.18rem)", maxWidth:540, margin:"0 auto 16px",
                  color:"rgba(240,253,244,0.75)", animation:"fadeUp 0.9s 0.12s both", lineHeight:1.8,
                }}>बाजाराशिवाय! दलालाशिवाय!</p>
                <p style={{
                  fontSize:"clamp(0.9rem,1.6vw,1rem)", maxWidth:500, margin:"0 auto 44px",
                  animation:"fadeUp 0.9s 0.2s both",
                  background:"rgba(34,197,94,0.08)", backdropFilter:"blur(8px)",
                  padding:"10px 24px", borderRadius:40,
                  border:"1px solid rgba(34,197,94,0.2)",
                  color:"rgba(240,253,244,0.75)",
                }}>
                  🥦 ताजे भाज्या • 🍅 टोमॅटो • 🥭 आंबा • 🌾 धान्य — थेट शेतातून!
                </p>
                <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 1s 0.28s both" }}>
                  <MagButton className="hero-btn-primary" onClick={() => setPage("products")}>🛒 उत्पादने पहा</MagButton>
                  <MagButton className="hero-btn-secondary" onClick={() => setPage("register")}>👨‍🌾 शेतकरी म्हणून जोडा</MagButton>
                </div>
                <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:62, flexWrap:"wrap" }}>
                  <StatCard icon="👨‍🌾" num={farmers.length} label="शेतकरी" delay={0.3} />
                  <StatCard icon="🛒" num={12} label="ग्राहक" delay={0.42} />
                  <StatCard icon="🥦" num={products.length} label="उत्पादने" delay={0.54} />
                  <StatCard icon="📦" num={orders.length + 120} label="ऑर्डर" delay={0.66} />
                </div>
              </div>
            </HeroBg>

            {/* MARQUEE TICKER */}
            <MarqueeTicker />

            {/* HOW IT WORKS */}
            <div style={{ padding:"90px 24px", maxWidth:1100, margin:"0 auto" }}>
              <div className="reveal" style={{ textAlign:"center", marginBottom:52 }}>
                <span style={{ display:"inline-block", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:40, padding:"5px 18px", fontSize:"0.8rem", fontWeight:700, color:"#86efac", letterSpacing:"1px", marginBottom:14 }}>HOW IT WORKS</span>
                <h2 style={{ fontSize:"2.3rem", fontWeight:900, color:"#f0fdf4", marginBottom:8 }}>कसे काम करते? 🤔</h2>
                <p style={{ color:"rgba(240,253,244,0.5)", fontSize:"1.05rem" }}>फक्त ४ सोपे पावले</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:24 }}>
                {[
                  {num:"01", icon:"👨‍🌾", title:"शेतकरी नोंदणी", desc:"नाव, पत्ता, फोन, पिके नोंदवा", action: () => { setPage("register"); setRegTab("farmer"); }},
                  {num:"02", icon:"📋", title:"उत्पादन लिस्ट", desc:"उपलब्ध माल, किंमत थेट टाका", action: () => setPage("products")},
                  {num:"03", icon:"📱", title:"ग्राहक निवड", desc:"ऑनलाईन पाहा, थेट कॉल करा", action: () => setPage("farmers")},
                  {num:"04", icon:"🚚", title:"थेट डिलिव्हरी", desc:"शेतातून घरापर्यंत ताजे!", action: () => setPage("orders")},
                ].map((s,i) => (
                  <div key={i} className="step-card reveal" style={{ animationDelay:`${i*0.1}s` }} onClick={s.action}>
                    <div style={{
                      fontFamily:"'Baloo 2', monospace",
                      fontSize:"2.8rem", fontWeight:900,
                      background:"linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                      marginBottom:10, lineHeight:1,
                    }}>{s.num}</div>
                    <div className="card-emoji" style={{ fontSize:"3.2rem", margin:"10px 0 12px", filter:"drop-shadow(0 0 10px rgba(34,197,94,0.3))" }}>{s.icon}</div>
                    <h3 style={{ fontWeight:800, color:"#f0fdf4", fontSize:"1.08rem", marginBottom:8 }}>{s.title}</h3>
                    <p style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.9rem", lineHeight:1.7 }}>{s.desc}</p>
                    <div style={{ marginTop:14 }}>
                      <span style={{ fontSize:"0.8rem", color:"rgba(34,197,94,0.8)", fontWeight:700, paddingBottom:2 }}>पुढे जा →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-divider" />

            {/* FEATURED PRODUCTS */}
            <div style={{ padding:"90px 24px", maxWidth:1100, margin:"0 auto" }}>
              <div className="reveal" style={{ textAlign:"center", marginBottom:52 }}>
                <span style={{ display:"inline-block", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:40, padding:"5px 18px", fontSize:"0.8rem", fontWeight:700, color:"#86efac", letterSpacing:"1px", marginBottom:14 }}>FRESH TODAY</span>
                <h2 style={{ fontSize:"2.2rem", fontWeight:900, color:"#f0fdf4", marginBottom:8 }}>ताजी उत्पादने 🥦</h2>
                <p style={{ color:"rgba(240,253,244,0.5)" }}>आज उपलब्ध — शेतातून थेट</p>
              </div>
              {loading ? <Loader /> : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:24 }}>
                  {products.slice(0,4).map((p,i) => (
                    <FoodCard key={p.id} product={p} farmer={getFarmer(p.farmerId)} onOrder={handleOrder} delay={i*0.08} />
                  ))}
                </div>
              )}
              <div style={{ textAlign:"center", marginTop:44 }}>
                <MagButton onClick={() => setPage("products")} style={{
                  background:"transparent",
                  color:"#22c55e", border:"1.5px solid rgba(34,197,94,0.4)", borderRadius:40, padding:"14px 40px",
                  fontWeight:800, fontSize:"1rem", boxShadow:"0 0 20px rgba(34,197,94,0.1)",
                }}>सर्व उत्पादने पहा →</MagButton>
              </div>
            </div>

            <div className="section-divider" />

            {/* MAP SECTION */}
            <div style={{ padding:"90px 24px", maxWidth:1100, margin:"0 auto" }}>
              <div className="reveal" style={{ textAlign:"center", marginBottom:44 }}>
                <span style={{ display:"inline-block", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:40, padding:"5px 18px", fontSize:"0.8rem", fontWeight:700, color:"#86efac", letterSpacing:"1px", marginBottom:14 }}>LOCATION</span>
                <h2 style={{ fontSize:"2.2rem", fontWeight:900, color:"#f0fdf4", marginBottom:8 }}>आमचे ठिकाण 📍</h2>
                <p style={{ color:"rgba(240,253,244,0.5)", fontSize:"1.05rem" }}>महालादिवी गाव, अकोले तालुका, अहिल्यानगर</p>
              </div>
              <div className="reveal" style={{
                borderRadius:26, overflow:"hidden",
                border:"1px solid rgba(34,197,94,0.2)",
                boxShadow:"0 0 60px rgba(34,197,94,0.1)",
                position:"relative",
              }}>
                <div style={{
                  position:"absolute", top:18, left:18, zIndex:10,
                  background:"rgba(6,13,8,0.9)", backdropFilter:"blur(16px)",
                  border:"1px solid rgba(34,197,94,0.25)",
                  borderRadius:16, padding:"12px 18px",
                  display:"flex", alignItems:"center", gap:10,
                }}>
                  <span style={{ fontSize:"1.8rem", filter:"drop-shadow(0 0 8px rgba(34,197,94,0.5))" }}>🌿</span>
                  <div>
                    <div className="gradient-text" style={{ fontWeight:800, fontSize:"0.95rem" }}>ShivamFarm</div>
                    <div style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.78rem" }}>महालादिवी, अकोले, अहिल्यानगर</div>
                  </div>
                </div>
                <iframe
                  title="ShivamFarm Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15054!2d73.9238426!3d19.5480678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd0bd259555555%3A0x442fe86bd7c22fc9!2sMhaladevi%2C%20Akole%2C%20Maharashtra!5e0!3m2!1smr!2sin!4v1700000000000"
                  width="100%" height="420" style={{ border:"none", display:"block", filter:"invert(0.9) hue-rotate(145deg) brightness(0.85)" }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20, marginTop:24 }}>
                {[
                  {icon:"📍", title:"गाव", desc:"महालादिवी, अकोले तालुका"},
                  {icon:"🏛️", title:"जिल्हा", desc:"अहिल्यानगर, महाराष्ट्र"},
                  {icon:"📞", title:"संपर्क", desc:"9270441850"},
                  {icon:"🕗", title:"वेळ", desc:"सकाळी ७ ते रात्री ९"},
                ].map((item, i) => (
                  <div key={i} className="glass-card reveal" style={{ padding:"22px 20px", textAlign:"center", animationDelay:`${i*0.1}s` }}>
                    <div style={{ fontSize:"2.2rem", marginBottom:8, filter:"drop-shadow(0 0 8px rgba(34,197,94,0.3))" }}>{item.icon}</div>
                    <div style={{ fontWeight:800, color:"#22c55e", marginBottom:4 }}>{item.title}</div>
                    <div style={{ color:"rgba(240,253,244,0.55)", fontSize:"0.9rem" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT ORDERS */}
            {orders.length > 0 && (
              <div style={{ padding:"60px 24px", maxWidth:900, margin:"0 auto" }}>
                <h2 className="reveal" style={{ fontSize:"1.8rem", fontWeight:900, color:"#f0fdf4", marginBottom:8, textAlign:"center" }}>अलीकडील ऑर्डर 📦</h2>
                <p className="reveal" style={{ textAlign:"center", color:"rgba(240,253,244,0.5)", marginBottom:28 }}>ताज्या ऑर्डर</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {orders.slice(-3).reverse().map((o,i) => (
                    <div key={o.id} className="order-row" style={{ animation:`slideIn 0.4s ${i*0.1}s both` }}>
                      <div>
                        <div style={{ fontWeight:800, color:"#f0fdf4" }}>{o.productEmoji || "📦"} #{o.id} — {o.product} × {o.qty}</div>
                        <div style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.85rem", marginTop:3 }}>👤 {o.customerName} | 👨‍🌾 {o.farmer}</div>
                      </div>
                      <Badge text="⏳ Pending" color="#f59e0b" bg="rgba(245,158,11,0.1)" />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign:"center", marginTop:24 }}>
                  <MagButton onClick={() => setPage("orders")} style={{
                    background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#060d08",
                    border:"none", borderRadius:40, padding:"11px 28px", fontWeight:700, fontSize:"0.95rem",
                  }}>सर्व ऑर्डर पहा →</MagButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {page === "products" && (
          <div style={{ padding:"70px 24px", maxWidth:1200, margin:"0 auto" }}>
            <div className="reveal" style={{ textAlign:"center", marginBottom:36 }}>
              <h2 style={{ fontSize:"2.2rem", fontWeight:900, color:"#f0fdf4", marginBottom:6 }}>सर्व उत्पादने 🛒</h2>
              <p style={{ color:"rgba(240,253,244,0.5)" }}>शेतकऱ्यांकडून थेट ताजे</p>
            </div>
            <div className="reveal" style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:44, flexWrap:"wrap" }}>
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
          <div style={{ padding:"70px 24px", maxWidth:1100, margin:"0 auto" }}>
            <div className="reveal" style={{ textAlign:"center", marginBottom:44 }}>
              <h2 style={{ fontSize:"2.2rem", fontWeight:900, color:"#f0fdf4", marginBottom:6 }}>आमचे शेतकरी 👨‍🌾</h2>
              <p style={{ color:"rgba(240,253,244,0.5)" }}>थेट संपर्क करा</p>
            </div>
            {loading ? <Loader /> : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))", gap:24 }}>
                {farmers.map((f,i) => <FarmerCard key={f.id} farmer={f} delay={i*0.09} />)}
              </div>
            )}
          </div>
        )}

        {/* ===== REGISTER ===== */}
        {page === "register" && (
          <HeroBg style={{ minHeight:"85vh", padding:"80px 24px" }}>
            <div className="reveal" style={{ textAlign:"center", marginBottom:36 }}>
              <h2 style={{ color:"#f0fdf4", fontSize:"2.3rem", fontWeight:900, marginBottom:6 }}>नोंदणी करा 📝</h2>
              <p style={{ color:"rgba(240,253,244,0.6)" }}>मोफत नोंदणी — शेतकरी आणि ग्राहक दोन्ही</p>
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:36, flexWrap:"wrap" }}>
              {[["farmer","👨‍🌾 शेतकरी"],["customer","🛒 ग्राहक"]].map(([id,label]) => (
                <button key={id} className={`reg-tab-btn ${regTab===id?"active":""}`} onClick={() => setRegTab(id)}>{label}</button>
              ))}
            </div>
            <div style={{
              background:"rgba(6,13,8,0.8)", backdropFilter:"blur(20px)",
              border:"1px solid rgba(34,197,94,0.2)",
              borderRadius:26, padding:"40px 34px",
              maxWidth:520, margin:"0 auto",
              boxShadow:"0 24px 64px rgba(34,197,94,0.15)",
              animation:"scaleIn 0.3s cubic-bezier(.34,1.56,.64,1) both",
            }}>
              {regTab === "farmer" ? (
                <>
                  <h3 className="gradient-text" style={{ fontSize:"1.3rem", fontWeight:800, marginBottom:24, textAlign:"center" }}>👨‍🌾 शेतकरी नोंदणी</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div><label style={labelStyle}>पूर्ण नाव</label><input className="input-field" value={farmerName} onChange={e=>setFarmerName(e.target.value.replace(/[\d]/g, ''))} onKeyPress={e => { if (/[0-9]/.test(e.key)) e.preventDefault(); }} placeholder="तुमचे नाव" /></div>
                    <div><label style={labelStyle}>फोन नंबर</label><input className="input-field" value={farmerPhone} onChange={e=>setFarmerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} maxLength={10} placeholder="9XXXXXXXXX" type="tel" /></div>
                  </div>
                  <div style={{ marginBottom:14 }}><label style={labelStyle}>गाव / पत्ता</label><input className="input-field" value={farmerVillage} onChange={e=>setFarmerVillage(e.target.value)} placeholder="गाव, तालुका, जिल्हा" /></div>
                  <div style={{ marginBottom:14 }}><label style={labelStyle}>पिके (स्वल्पविरामाने वेगळे करा)</label><textarea className="input-field" style={{ height:80, resize:"vertical" }} value={farmerCrops} onChange={e=>setFarmerCrops(e.target.value)} placeholder="टोमॅटो, कांदा, गहू..." /></div>
                  <div style={{ marginBottom:24 }}><label style={labelStyle}>शेती क्षेत्रफळ (एकर)</label><input className="input-field" type="number" value={farmerArea} onChange={e=>setFarmerArea(e.target.value)} placeholder="2" /></div>
                  <MagButton onClick={submitFarmer} className="submit-btn" style={{ background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#060d08", boxShadow:"0 6px 24px rgba(34,197,94,0.4)" }}>✅ शेतकरी म्हणून नोंदणी करा</MagButton>
                </>
              ) : (
                <>
                  <h3 className="gradient-text" style={{ fontSize:"1.3rem", fontWeight:800, marginBottom:24, textAlign:"center" }}>🛒 ग्राहक नोंदणी</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div><label style={labelStyle}>पूर्ण नाव</label><input className="input-field" value={custName} onChange={e=>setCustName(e.target.value.replace(/[\d]/g, ''))} onKeyPress={e => { if (/[0-9]/.test(e.key)) e.preventDefault(); }} placeholder="तुमचे नाव" /></div>
                    <div><label style={labelStyle}>फोन नंबर</label><input className="input-field" value={custPhone} onChange={e=>setCustPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} maxLength={10} placeholder="9XXXXXXXXX" type="tel" /></div>
                  </div>
                  <div style={{ marginBottom:14 }}><label style={labelStyle}>पूर्ण पत्ता</label><textarea className="input-field" style={{ height:80, resize:"vertical" }} value={custAddress} onChange={e=>setCustAddress(e.target.value)} placeholder="घर नं, रस्ता, गाव..." /></div>
                  <div style={{ marginBottom:24 }}><label style={labelStyle}>कोणते अन्नपदार्थ हवेत?</label><input className="input-field" value={custNeeds} onChange={e=>setCustNeeds(e.target.value)} placeholder="भाज्या, फळे, धान्य..." /></div>
                  <MagButton onClick={submitCustomer} className="submit-btn" style={{ background:"linear-gradient(135deg,#ea580c,#f97316)", color:"white", boxShadow:"0 6px 24px rgba(234,88,12,0.4)" }}>✅ ग्राहक म्हणून नोंदणी करा</MagButton>
                </>
              )}
            </div>
          </HeroBg>
        )}

        {/* ===== ORDERS ===== */}
        {page === "orders" && (
          <div style={{ padding:"70px 24px", maxWidth:920, margin:"0 auto" }}>
            <div className="reveal" style={{ textAlign:"center", marginBottom:36 }}>
              <h2 style={{ fontSize:"2.2rem", fontWeight:900, color:"#f0fdf4", marginBottom:6 }}>ऑर्डर यादी 📦</h2>
              <p style={{ color:"rgba(240,253,244,0.5)" }}>{orders.length > 0 ? `एकूण ${orders.length} ऑर्डर` : "अजून कोणतीही ऑर्डर नाही"}</p>
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign:"center", padding:"70px 0", color:"rgba(240,253,244,0.5)" }}>
                <div style={{ fontSize:"5rem", marginBottom:18, animation:"floatSlow 3s ease-in-out infinite", display:"inline-block" }}>📭</div>
                <p style={{ fontSize:"1.1rem", marginBottom:24 }}>अजून कोणतीही ऑर्डर नाही</p>
                <MagButton onClick={() => setPage("products")} style={{ background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#060d08", border:"none", borderRadius:40, padding:"13px 32px", fontWeight:700, fontSize:"1rem" }}>🛒 उत्पादने पहा</MagButton>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[...orders].reverse().map((o,i) => (
                  <div key={o.id} className="order-row" style={{ animation:`slideIn 0.4s ${i*0.07}s both` }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:"1.08rem", color:"#f0fdf4" }}>
                        {o.productEmoji || "📦"} #{o.id} — {o.product} <span className="gradient-text-warm" style={{ fontWeight:900 }}>× {o.qty}</span>
                      </div>
                      <div style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.86rem", marginTop:5, display:"flex", gap:14, flexWrap:"wrap" }}>
                        <span>👤 {o.customerName}</span><span>📞 {o.customerPhone}</span><span>👨‍🌾 {o.farmer}</span>
                      </div>
                      <div style={{ color:"rgba(240,253,244,0.35)", fontSize:"0.82rem", marginTop:3 }}>📍 {o.address} &nbsp;|&nbsp; ⏰ {o.time}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                      <Badge text={o.status==="pending"?"⏳ Pending":"✅ Done"} color={o.status==="pending"?"#f59e0b":"#22c55e"} bg={o.status==="pending"?"rgba(245,158,11,0.1)":"rgba(34,197,94,0.1)"} />
                      <MagButton href={`tel:${o.farmerPhone}`} style={{ background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#060d08", borderRadius:20, padding:"5px 14px", fontWeight:700, fontSize:"0.78rem" }}>📞 शेतकरी कॉल</MagButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CONTACT ===== */}
        {page === "contact" && (
          <div style={{ padding:"70px 24px", maxWidth:920, margin:"0 auto" }}>
            <div className="reveal" style={{ textAlign:"center", marginBottom:46 }}>
              <h2 style={{ fontSize:"2.2rem", fontWeight:900, color:"#f0fdf4", marginBottom:6 }}>संपर्क करा 📞</h2>
              <p style={{ color:"rgba(240,253,244,0.5)" }}>Shivam Pravin Mundhe — ShivamFarm संस्थापक</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:24, marginBottom:44 }}>
              {[
                { icon:"📞", title:"फोन कॉल", sub:"9270441850", desc:"सोमवार–रविवार, सकाळी ७ ते रात्री ९", href:"tel:9270441850", btn:"📞 आत्ता कॉल करा", color:"#22c55e" },
                { icon:"💬", title:"WhatsApp", sub:"9270441850", desc:"WhatsApp वर लवकर उत्तर मिळेल", href:"https://wa.me/919270441850", btn:"💬 WhatsApp करा", color:"#f97316" },
                { icon:"📍", title:"सेवा क्षेत्र", sub:"महाराष्ट्र, भारत", desc:"संपूर्ण महाराष्ट्रभर सेवा", href:null, btn:"📍 सर्व जिल्हे", color:"#a78bfa" },
              ].map((c,i) => (
                <div key={i} className="glass-card reveal" style={{ padding:"38px 28px", textAlign:"center", animationDelay:`${i*0.12}s`, borderBottom:`3px solid ${c.color}33` }}>
                  <div style={{ fontSize:"3.2rem", marginBottom:12, filter:`drop-shadow(0 0 12px ${c.color}66)` }}>{c.icon}</div>
                  <h3 style={{ fontWeight:800, color:"#f0fdf4", fontSize:"1.2rem", marginBottom:7 }}>{c.title}</h3>
                  <div style={{ fontWeight:800, color:c.color, fontSize:"1.2rem", marginBottom:7 }}>{c.sub}</div>
                  <p style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.9rem", marginBottom:22, lineHeight:1.7 }}>{c.desc}</p>
                  {c.href ? (
                    <MagButton href={c.href} target={c.href.startsWith("http")?"{_blank}":undefined}
                      style={{ background:`linear-gradient(135deg, ${c.color}33, ${c.color}22)`, color:c.color, padding:"12px 28px", borderRadius:40, fontWeight:700, fontSize:"0.95rem", border:`1.5px solid ${c.color}44` }}>
                      {c.btn}
                    </MagButton>
                  ) : (
                    <MagButton onClick={()=>showToast("📍 महाराष्ट्रातील सर्व जिल्ह्यांमध्ये सेवा!")}
                      style={{ background:`linear-gradient(135deg, ${c.color}33, ${c.color}22)`, color:c.color, padding:"12px 28px", borderRadius:40, fontWeight:700, border:"none", fontSize:"0.95rem" }}>
                      {c.btn}
                    </MagButton>
                  )}
                </div>
              ))}
            </div>

            <HeroBg style={{ borderRadius:26, padding:"52px 32px", textAlign:"center" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:14, animation:"floatSlow 3s ease-in-out infinite", display:"inline-block", filter:"drop-shadow(0 0 20px rgba(245,158,11,0.5))" }}>🌟</div>
              <h3 className="gradient-text" style={{ fontSize:"1.7rem", fontWeight:900, marginBottom:8 }}>Shivam Pravin Mundhe</h3>
              <p style={{ color:"rgba(240,253,244,0.7)", fontSize:"1.08rem", marginBottom:22 }}>ShivamFarm — शेतकरी ते ग्राहक थेट जोडणी प्लॅटफॉर्म</p>
              <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                <MagButton href="tel:9270441850" style={{ background:"rgba(34,197,94,0.12)", color:"#86efac", padding:"11px 26px", borderRadius:30, fontWeight:700, border:"1.5px solid rgba(34,197,94,0.3)", fontSize:"0.95rem" }}>📞 9270441850</MagButton>
                <MagButton href="https://wa.me/919270441850" target="_blank" style={{ background:"rgba(249,115,22,0.12)", color:"#fdba74", padding:"11px 26px", borderRadius:30, fontWeight:700, border:"1.5px solid rgba(249,115,22,0.3)", fontSize:"0.95rem" }}>💬 WhatsApp</MagButton>
              </div>
            </HeroBg>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background:"rgba(4,9,5,0.95)", backdropFilter:"blur(16px)", borderTop:"1px solid rgba(34,197,94,0.1)", color:"rgba(240,253,244,0.6)", textAlign:"center", padding:"44px 24px 28px" }}>
        <div className="gradient-text" style={{ fontSize:"1.8rem", fontWeight:900, marginBottom:10 }}>🌿 ShivamFarm</div>
        <p style={{ fontSize:"0.95rem", marginBottom:5, opacity:0.6 }}>शेतकरी ते ग्राहक — थेट जोडणी | बाजाराशिवाय ताजे अन्न</p>
        <p style={{ fontSize:"0.82rem", opacity:0.35, marginBottom:14 }}>© 2025 ShivamFarm | महाराष्ट्र, भारत</p>
        <div className="gradient-text" style={{ fontWeight:800, fontSize:"1rem" }}>
          🌟 Designed & Built by Shivam Pravin Mundhe | 📞 9270441850
        </div>
      </footer>

      {/* ORDER MODAL */}
      <Modal open={modal.open && modal.type==="order"} onClose={() => setModal({ open:false, type:null, data:null })}>
        {modal.data && (
          <>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ fontSize:"4rem", marginBottom:8, animation:"floatSlow 2s ease-in-out infinite", display:"inline-block", filter:"drop-shadow(0 0 20px rgba(34,197,94,0.4))" }}>{modal.data.product.emoji}</div>
              <h2 className="gradient-text" style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:5 }}>{modal.data.product.name}</h2>
              <p style={{ color:"rgba(240,253,244,0.5)", fontSize:"0.9rem" }}>👨‍🌾 {modal.data.farmer?.name} &nbsp;|&nbsp; <span className="gradient-text-warm">₹{modal.data.product.price}/{modal.data.product.unit}</span></p>
            </div>
            <div style={{ marginBottom:13 }}><label style={labelStyle}>तुमचे नाव *</label><input className="input-field" value={orderName} onChange={e=>setOrderName(e.target.value.replace(/[\d]/g, ''))} onKeyPress={e => { if (/[0-9]/.test(e.key)) e.preventDefault(); }} placeholder="पूर्ण नाव टाका" autoComplete="off" /></div>
            <div style={{ marginBottom:13 }}><label style={labelStyle}>फोन नंबर *</label><input className="input-field" value={orderPhone} onChange={e=>setOrderPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} maxLength={10} placeholder="9XXXXXXXXX" type="tel" autoComplete="off" /></div>
            <div style={{ marginBottom:13 }}><label style={labelStyle}>डिलिव्हरी पत्ता *</label><textarea className="input-field" style={{ height:78, resize:"vertical" }} value={orderAddress} onChange={e=>setOrderAddress(e.target.value)} placeholder="घर नं, गाव, जिल्हा..." autoComplete="off" /></div>
            <div style={{ marginBottom:18 }}><label style={labelStyle}>प्रमाण ({modal.data.product.unit}) *</label><input className="input-field" type="number" min="1" value={orderQty} onChange={e=>setOrderQty(e.target.value)} /></div>
            <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:12, padding:"10px 16px", marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#22c55e", fontWeight:700 }}>एकूण रक्कम:</span>
              <span className="gradient-text-warm" style={{ fontWeight:900, fontSize:"1.2rem" }}>₹{(parseInt(orderQty)||1)*modal.data.product.price}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <MagButton onClick={submitOrder} style={{ background:"linear-gradient(135deg,#15803d,#22c55e)", color:"#060d08", border:"none", borderRadius:40, padding:14, fontWeight:900, fontSize:"0.97rem" }}>✅ ऑर्डर द्या</MagButton>
              <MagButton href={`tel:${modal.data.farmer?.phone}`} style={{ background:"linear-gradient(135deg,#ea580c,#f97316)", color:"white", borderRadius:40, padding:14, fontWeight:900, fontSize:"0.97rem" }}>📞 थेट कॉल</MagButton>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}