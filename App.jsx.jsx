import { useState, useRef } from "react";

/* ─── DATA ───────────────────────────────────────────── */
const CURRENCIES = [
  { code:"GBP", symbol:"£",   name:"British Pound",       flag:"🇬🇧" },
  { code:"USD", symbol:"$",   name:"US Dollar",            flag:"🇺🇸" },
  { code:"EUR", symbol:"€",   name:"Euro",                 flag:"🇪🇺" },
  { code:"NGN", symbol:"₦",   name:"Nigerian Naira",       flag:"🇳🇬" },
  { code:"GHS", symbol:"₵",   name:"Ghanaian Cedi",        flag:"🇬🇭" },
  { code:"KES", symbol:"KSh", name:"Kenyan Shilling",      flag:"🇰🇪" },
  { code:"ZAR", symbol:"R",   name:"South African Rand",   flag:"🇿🇦" },
  { code:"CAD", symbol:"CA$", name:"Canadian Dollar",      flag:"🇨🇦" },
  { code:"AUD", symbol:"A$",  name:"Australian Dollar",    flag:"🇦🇺" },
  { code:"AED", symbol:"د.إ", name:"UAE Dirham",           flag:"🇦🇪" },
  { code:"INR", symbol:"₹",   name:"Indian Rupee",         flag:"🇮🇳" },
  { code:"SGD", symbol:"S$",  name:"Singapore Dollar",     flag:"🇸🇬" },
  { code:"JPY", symbol:"¥",   name:"Japanese Yen",         flag:"🇯🇵" },
  { code:"BRL", symbol:"R$",  name:"Brazilian Real",       flag:"🇧🇷" },
  { code:"MXN", symbol:"MX$", name:"Mexican Peso",         flag:"🇲🇽" },
  { code:"TRY", symbol:"₺",   name:"Turkish Lira",         flag:"🇹🇷" },
  { code:"SEK", symbol:"kr",  name:"Swedish Krona",        flag:"🇸🇪" },
  { code:"NOK", symbol:"kr",  name:"Norwegian Krone",      flag:"🇳🇴" },
  { code:"CHF", symbol:"Fr",  name:"Swiss Franc",          flag:"🇨🇭" },
  { code:"PLN", symbol:"zł",  name:"Polish Zloty",         flag:"🇵🇱" },
];

const THEMES = [
  { name:"rose",     a:"#E8847A", b:"#C4607A", rgb:"232,132,122" },
  { name:"lavender", a:"#A87FD4", b:"#8055B8", rgb:"168,127,212" },
  { name:"gold",     a:"#D4A85A", b:"#B8863A", rgb:"212,168,90"  },
  { name:"sage",     a:"#6BAF95", b:"#4A9075", rgb:"107,175,149" },
  { name:"blush",    a:"#E896B2", b:"#C86090", rgb:"232,150,178" },
  { name:"midnight", a:"#7B8FE8", b:"#5B6FD0", rgb:"123,143,232" },
];

const INIT_SERVICES = [
  { id:1, icon:"💆‍♀️", name:"Full Lash Set",      dur:"90 min",  price:65, on:true },
  { id:2, icon:"💅",   name:"Gel Manicure",        dur:"60 min",  price:35, on:true },
  { id:3, icon:"🎨",   name:"Brow Shape & Tint",   dur:"30 min",  price:22, on:true },
  { id:4, icon:"✨",   name:"Glow Facial",          dur:"60 min",  price:55, on:true },
  { id:5, icon:"💇‍♀️", name:"Brazilian Blow-dry",  dur:"120 min", price:85, on:true },
  { id:6, icon:"🌸",   name:"Mani + Pedi Combo",   dur:"90 min",  price:55, on:true },
];

const EMOJI_OPTS = ["💅","💆‍♀️","💇‍♀️","✨","🌸","💎","🌺","🦋","🧴","💋","👑","🪷"];
const WEEK_DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const INIT_HOURS = [true,true,true,true,true,true,false];
const TIMES_ALL  = ["9:00 AM","10:30 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:30 PM","4:00 PM","5:00 PM","5:30 PM","6:00 PM","7:00 PM"];
const TIMES_BUSY = new Set(["10:30 AM","12:00 PM","4:00 PM","7:00 PM"]);
const CAL_BOOKED = new Set([2,5,8,10,12,14,15,17,19,21,24,26,28]);
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_SHORT   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const GUIDE_DATA = [
  { icon:"🚀", title:"Phase 1: Getting Started", sub:"Set up your GlowBook profile", steps:[
    { t:"Enter your studio details", d:"In the <b>✏️ Customise tab</b>, fill in your studio name, tagline and location. Changes appear live on your booking page instantly." },
    { t:"Add services & set your currency", d:"In Customise → Services & Pricing, tap <b>+ Add Service</b>. Choose your <b>currency</b> — it applies to every price across the whole app.", tip:"List your most popular service first — it's what clients see first." },
    { t:"Set your working hours", d:"In Customise → Working Hours, toggle each day on/off. Clients can only book during your open hours." },
  ]},
  { icon:"🔌", title:"Phase 2: Connect Integrations", sub:"WhatsApp, Calendar & Payments", steps:[
    { t:"Connect WhatsApp Business", d:"Download the <b>WhatsApp Business</b> app (free). Enter your number in Customise → Integrations. Every booking auto-sends a confirmation to clients.", tip:"Set a quick reply '/book' so clients can get your link instantly." },
    { t:"Sync Google Calendar", d:"Enter your Gmail in Integrations. All bookings appear in your phone calendar automatically." },
    { t:"Set up Stripe for payments", d:"Go to <b>stripe.com</b> → sign up free → copy your Publishable Key → paste in Integrations. Enable 20% deposit to eliminate no-shows.", tip:"A 20% deposit reduces no-shows by up to 80%!" },
  ]},
  { icon:"🔗", title:"Phase 3: Share Your Booking Link", sub:"Get clients booking 24/7", steps:[
    { t:"Copy & share your link", d:"Tap <b>📋 Copy</b> on your dashboard. Share the link everywhere — it's your public booking page that works on any phone." },
    { t:"Add to WhatsApp & Instagram bio", d:"Paste your link in WhatsApp Business About and your Instagram/TikTok bio. Add the text <b>'Book your appointment 👇'</b>.", tip:"Post an Instagram Story every Monday: 'Slots open this week — link in bio! 💅'" },
  ]},
  { icon:"📋", title:"Phase 4: Managing Bookings", sub:"Confirm, chat & track revenue", steps:[
    { t:"Review & confirm new bookings", d:"New bookings appear on your <b>Home tab</b> with a New ✨ badge. Tap ✓ Confirm — this auto-sends a WhatsApp message and syncs to your calendar.", tip:"Confirm within 1 hour — quick responses reduce cancellations significantly." },
    { t:"Message clients & send invoices", d:"Tap 💬 on any booking to open WhatsApp. After the appointment, tap 🧾 Invoice to send a Stripe payment link. Tap ⭐ to request a review." },
  ]},
  { icon:"💡", title:"Phase 5: Grow Your Business", sub:"Pro tips for beauticians", steps:[
    { t:"Use deposits to protect your time", d:"Enable 20% deposit in Booking Settings. On a £65 lash set that's £13 upfront — if they no-show, you keep it." },
    { t:"Upsell at booking time", d:"Add services like 'Add brow wax for £15 more!' as add-ons. This can increase your average booking value by 20–30%.", tip:"Add-ons that work great: brow tint with lashes, nail art with manicure, hair mask with blow-dry." },
    { t:"Build client loyalty", d:"Message regular clients: 'Hi [Name]! It's been 6 weeks — time for your fill! Book now for 10% off 💅'. Clients who feel remembered rebook 5x more." },
  ]},
];

/* ─── STYLE HELPERS ──────────────────────────────────── */
function themeVars(themeName) {
  const t = THEMES.find(x => x.name === themeName) || THEMES[0];
  return {
    "--accent":     t.a,
    "--accent2":    t.b,
    "--accent-rgb": t.rgb,
    "--bg":         "#0F0A1A",
    "--surf":       "#1A1328",
    "--surf2":      "#231B35",
    "--surf3":      "#2D2445",
    "--txt":        "#F0EBF8",
    "--txt2":       "#B8A8D0",
    "--muted":      "#6B5A85",
    "--bdr":        "rgba(255,255,255,0.07)",
    "--sage":       "#6BAF95",
    "--gold":       "#D4A85A",
  };
}

const cardStyle = {
  background:"var(--surf)", border:"1px solid var(--bdr)",
  borderRadius:20, padding:16, marginBottom:10,
};
const inpStyle = {
  width:"100%", background:"var(--surf2)",
  border:"1.5px solid var(--bdr)", borderRadius:12,
  padding:"12px 14px", fontFamily:"Georgia,serif",
  fontSize:14, color:"var(--txt)", outline:"none",
};
const fieldLabelStyle = {
  fontSize:10, fontWeight:700, color:"var(--muted)",
  textTransform:"uppercase", letterSpacing:"0.7px",
  marginBottom:7, display:"block",
};
function solidBtn(bg, color = "#fff", extra = {}) {
  return {
    background: bg, border:"none", borderRadius:12,
    padding:"10px 0", fontFamily:"Georgia,serif",
    fontSize:11, fontWeight:700, cursor:"pointer",
    color, width:"100%", transition:"opacity 0.2s", ...extra,
  };
}

/* ─── SMALL COMPONENTS ───────────────────────────────── */
function Toast({ msg, visible }) {
  return (
    <div style={{
      position:"fixed", bottom:88, left:"50%",
      transform:`translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      background:"var(--surf2)", border:"1px solid var(--bdr)",
      borderRadius:14, padding:"11px 18px",
      fontSize:13, fontWeight:600, color:"var(--txt)",
      zIndex:9999, opacity: visible ? 1 : 0,
      transition:"all 0.3s", whiteSpace:"nowrap",
      boxShadow:"0 12px 40px rgba(0,0,0,0.5)",
      pointerEvents:"none", maxWidth:"90vw",
    }}>{msg}</div>
  );
}

function Tog({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width:42, height:24, borderRadius:12, flexShrink:0,
      background: on ? "var(--accent)" : "var(--surf3)",
      transition:"background 0.2s", position:"relative", cursor:"pointer",
    }}>
      <div style={{
        position:"absolute", width:18, height:18, borderRadius:"50%",
        background:"white", top:3, left: on ? 21 : 3,
        transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)",
      }}/>
    </div>
  );
}

function SwRow({ lbl, sub, on, onChange }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"12px 0", borderBottom:"1px solid var(--bdr)"}}>
      <div>
        <div style={{fontSize:13,fontWeight:600,color:"var(--txt)"}}>{lbl}</div>
        {sub && <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{sub}</div>}
      </div>
      <Tog on={on} onChange={onChange}/>
    </div>
  );
}

function Accordion({ icon, title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{...cardStyle, padding:0, overflow:"hidden"}}>
      <div onClick={() => setOpen(o => !o)}
        style={{display:"flex",alignItems:"center",gap:12,padding:"16px 18px",cursor:"pointer"}}>
        <span style={{fontSize:19,width:22,textAlign:"center"}}>{icon}</span>
        <span style={{fontSize:14,fontWeight:700,color:"var(--txt)",flex:1}}>{title}</span>
        <span style={{color:"var(--muted)",fontSize:14,
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition:"transform 0.2s"}}>›</span>
      </div>
      {open && (
        <div style={{padding:"0 18px 18px",borderTop:"1px solid var(--bdr)",paddingTop:16}}>
          {children}
        </div>
      )}
    </div>
  );
}

function FieldInput({ lbl, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      {lbl && <span style={fieldLabelStyle}>{lbl}</span>}
      <input {...props} style={{...inpStyle, ...props.style}}/>
    </div>
  );
}

function ThemeDots({ active, onChange }) {
  return (
    <div style={{display:"flex",gap:9,flexWrap:"wrap",marginTop:6}}>
      {THEMES.map(t => (
        <div key={t.name} onClick={() => onChange(t.name)} style={{
          width:34, height:34, borderRadius:"50%", cursor:"pointer",
          background:`linear-gradient(135deg,${t.a},${t.b})`,
          border:`3px solid ${active === t.name ? "white" : "transparent"}`,
          transform: active === t.name ? "scale(1.15)" : "scale(1)",
          transition:"all 0.2s", flexShrink:0,
        }}/>
      ))}
    </div>
  );
}

function CurrencyPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const cur = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];
  return (
    <div style={{position:"relative"}}>
      <div onClick={() => setOpen(o => !o)} style={{
        display:"flex", alignItems:"center", gap:10,
        ...inpStyle, cursor:"pointer", userSelect:"none",
      }}>
        <span style={{fontSize:18}}>{cur.flag}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--txt)"}}>{cur.code} — {cur.symbol}</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{cur.name}</div>
        </div>
        <span style={{color:"var(--muted)",fontSize:12,
          transform: open ? "rotate(180deg)" : "none",
          transition:"transform 0.2s"}}>▾</span>
      </div>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
          zIndex:300, background:"var(--surf2)",
          border:"1px solid var(--bdr)", borderRadius:14,
          maxHeight:240, overflowY:"auto",
          boxShadow:"0 12px 40px rgba(0,0,0,0.55)",
        }}>
          {CURRENCIES.map(c => (
            <div key={c.code} onClick={() => { onChange(c.code); setOpen(false); }} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"11px 14px", cursor:"pointer",
              borderBottom:"1px solid var(--bdr)",
              background: c.code === value ? "rgba(var(--accent-rgb),0.12)" : "transparent",
            }}>
              <span style={{fontSize:18,flexShrink:0}}>{c.flag}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--txt)"}}>
                  {c.code} <span style={{color:"var(--accent)",fontWeight:800}}>{c.symbol}</span>
                </div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────── */
export default function GlowBookPro() {
  /* ── toast ── */
  const [toastMsg,  setToastMsg]  = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);
  function toast(msg) {
    clearTimeout(toastTimer.current);
    setToastMsg(msg); setToastShow(true);
    toastTimer.current = setTimeout(() => setToastShow(false), 2600);
  }

  /* ── global state ── */
  const [launched,   setLaunched]   = useState(false);
  const [activeTab,  setActiveTab]  = useState("dash");
  const [themeName,  setThemeName]  = useState("rose");
  const [currency,   setCurrency]   = useState("GBP");

  /* ── profile ── */
  const [bizName,  setBizName]  = useState("Sophie's Beauty Studio");
  const [tagline,  setTagline]  = useState("Lashes · Nails · Brows · Facials");
  const [location, setLocation] = useState("East London");
  const [profEmoji,setProfEmoji]= useState("💅");

  /* ── services ── */
  const [services,    setServices]    = useState(INIT_SERVICES);
  const [showAddSvc,  setShowAddSvc]  = useState(false);
  const [newSvcName,  setNewSvcName]  = useState("");
  const [newSvcPrice, setNewSvcPrice] = useState("");
  const [newSvcDur,   setNewSvcDur]   = useState("60 min");
  const [newSvcIcon,  setNewSvcIcon]  = useState("💅");

  /* ── booking page ── */
  const [pickedSvc,   setPickedSvc]   = useState(null);
  const [pickedDate,  setPickedDate]  = useState(0);
  const [pickedTime,  setPickedTime]  = useState(null);
  const [clientName,  setClientName]  = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── settings ── */
  const [instantBook, setInstantBook] = useState(true);
  const [waRemind,    setWaRemind]    = useState(true);
  const [calSync,     setCalSync]     = useState(true);
  const [autoReview,  setAutoReview]  = useState(true);
  const [workHours,   setWorkHours]   = useState(
    INIT_HOURS.map((on, i) => ({ day: WEEK_DAYS[i], on }))
  );

  /* ── integrations ── */
  const [waNum,     setWaNum]     = useState("");
  const [calId,     setCalId]     = useState("");
  const [stripeKey, setStripeKey] = useState("");
  const [waOk,      setWaOk]      = useState(false);
  const [calOk,     setCalOk]     = useState(false);
  const [stripeOk,  setStripeOk]  = useState(false);

  /* ── calendar ── */
  const [calViewDate, setCalViewDate] = useState(new Date());

  /* ── derived ── */
  const sym     = CURRENCIES.find(c => c.code === currency)?.symbol ?? "£";
  const curFlag = CURRENCIES.find(c => c.code === currency)?.flag   ?? "🇬🇧";
  const slug    = bizName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  const bookUrl = `glowbook.app/${slug}`;

  /* ── date strip ── */
  const dateStrip = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return {
      short: DAY_SHORT[d.getDay()],
      num:   d.getDate(),
      lbl:   `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${d.toLocaleString("default",{month:"short"})}`,
    };
  });

  /* ── calendar grid ── */
  function buildCalGrid() {
    const first = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), 1);
    const daysInMonth = new Date(calViewDate.getFullYear(), calViewDate.getMonth() + 1, 0).getDate();
    const today = new Date();
    const cells = [];
    for (let i = 0; i < first.getDay(); i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        d,
        isToday: d === today.getDate() &&
                 calViewDate.getMonth() === today.getMonth() &&
                 calViewDate.getFullYear() === today.getFullYear(),
        hasBooking: CAL_BOOKED.has(d),
      });
    }
    return {
      calLabel: `${MONTH_NAMES[calViewDate.getMonth()]} ${calViewDate.getFullYear()}`,
      cells,
    };
  }
  const { calLabel, cells: calCells } = buildCalGrid();

  function submitBooking() {
    if (!pickedSvc)          return toast("⚠️ Please select a service");
    if (pickedTime === null)  return toast("⚠️ Please choose a time");
    if (!clientName.trim())  return toast("⚠️ Please enter your name");
    if (!clientPhone.trim()) return toast("⚠️ Please enter your WhatsApp number");
    setShowSuccess(true);
  }
  function closeSuccess() {
    setShowSuccess(false);
    setPickedSvc(null); setPickedTime(null);
    setClientName(""); setClientPhone("");
  }
  function addNewService() {
    if (!newSvcName.trim()) return toast("⚠️ Please enter a service name");
    setServices(prev => [...prev, {
      id: Date.now(),
      icon: newSvcIcon,
      name: newSvcName,
      dur:  newSvcDur || "60 min",
      price: parseFloat(newSvcPrice) || 0,
      on: true,
    }]);
    setNewSvcName(""); setNewSvcPrice(""); setNewSvcDur("60 min"); setNewSvcIcon("💅");
    setShowAddSvc(false);
    toast("✅ Service added!");
  }

  /* ─── ONBOARDING ─── */
  if (!launched) {
    return (
      <div style={{ ...themeVars(themeName), minHeight:"100vh", background:"var(--bg)",
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"flex-end", fontFamily:"Georgia,serif",
        position:"relative", overflow:"hidden" }}>
        <div style={{position:"absolute",top:-100,right:-80,width:280,height:280,
          borderRadius:"50%",background:"var(--accent)",filter:"blur(80px)",opacity:0.15,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"52%",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:70,marginBottom:14,animation:"float 4s ease-in-out infinite"}}>💅</div>
          <div style={{fontSize:36,fontWeight:700,color:"var(--txt)",letterSpacing:1}}>
            Glow<span style={{color:"var(--accent)",fontStyle:"italic"}}>Book</span> Pro
          </div>
          <div style={{fontSize:13,color:"var(--txt2)",marginTop:6,textAlign:"center",padding:"0 28px"}}>
            The all-in-one booking app for independent beauticians
          </div>
        </div>
        <div style={{background:"var(--surf)",borderRadius:"26px 26px 0 0",
          padding:"26px 22px 44px",width:"100%",maxWidth:430,position:"relative",zIndex:2}}>
          <div style={{fontSize:22,fontWeight:700,color:"var(--txt)",marginBottom:4}}>Set Up Your Studio ✨</div>
          <div style={{fontSize:12,color:"var(--muted)",marginBottom:18,lineHeight:1.6}}>
            Customise everything — brand, services and pricing.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            <input value={bizName} onChange={e=>setBizName(e.target.value)}
              placeholder="Studio Name e.g. Sophie's Beauty" style={inpStyle}/>
            <input value={tagline} onChange={e=>setTagline(e.target.value)}
              placeholder="Tagline e.g. Lashes · Nails · Brows" style={inpStyle}/>
            <input value={location} onChange={e=>setLocation(e.target.value)}
              placeholder="Location e.g. East London" style={inpStyle}/>
          </div>
          <div style={{marginBottom:14}}>
            <span style={fieldLabelStyle}>Currency</span>
            <CurrencyPicker value={currency} onChange={setCurrency}/>
          </div>
          <div style={{marginBottom:20}}>
            <span style={fieldLabelStyle}>Brand Colour</span>
            <ThemeDots active={themeName} onChange={setThemeName}/>
          </div>
          <button onClick={() => setLaunched(true)} style={{
            ...solidBtn(`linear-gradient(135deg,var(--accent),var(--accent2))`),
            borderRadius:16, padding:17, fontSize:15,
            boxShadow:"0 8px 24px rgba(var(--accent-rgb),0.4)",
          }}>✨ Launch My GlowBook</button>
        </div>
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      </div>
    );
  }

  /* ─── MAIN APP ─── */
  const TABS = [
    { id:"dash",    icon:"🏠", lbl:"Home"     },
    { id:"booking", icon:"🔗", lbl:"Book"     },
    { id:"cal",     icon:"📅", lbl:"Calendar" },
    { id:"editor",  icon:"✏️", lbl:"Customise"},
    { id:"guide",   icon:"📖", lbl:"Guide"    },
    { id:"publish", icon:"📱", lbl:"Publish"  },
  ];

  return (
    <div style={{ ...themeVars(themeName), height:"100vh", display:"flex",
      flexDirection:"column", background:"var(--bg)",
      fontFamily:"Georgia,serif", position:"relative", overflow:"hidden",
      maxWidth:430, margin:"0 auto" }}>

      {/* ambient glow */}
      <div style={{position:"fixed",top:-100,right:-80,width:260,height:260,
        borderRadius:"50%",background:"var(--accent)",filter:"blur(80px)",
        opacity:0.09,pointerEvents:"none",zIndex:0}}/>

      {/* ── top tab bar ── */}
      <div style={{background:"rgba(15,10,26,0.97)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid var(--bdr)",overflowX:"auto",
        flexShrink:0,position:"relative",zIndex:10,
        scrollbarWidth:"none"}}>
        <div style={{display:"flex",minWidth:"max-content"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:"10px 13px", border:"none", background:"transparent",
              color: activeTab===t.id ? "var(--accent)" : "var(--muted)",
              fontFamily:"Georgia,serif", fontSize:11.5, fontWeight:600,
              cursor:"pointer", whiteSpace:"nowrap",
              borderBottom:`2.5px solid ${activeTab===t.id ? "var(--accent)" : "transparent"}`,
              transition:"all 0.2s",
            }}>{t.icon} {t.lbl}</button>
          ))}
        </div>
      </div>

      {/* ── screen area ── */}
      <div style={{flex:1,overflow:"hidden",position:"relative",zIndex:1}}>

        {/* ════ DASHBOARD ════ */}
        {activeTab === "dash" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            {/* header */}
            <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bdr)",
              padding:"14px 18px 18px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:"var(--muted)",fontWeight:500}}>Good morning ✨</div>
                  <div style={{fontSize:20,fontWeight:700,color:"var(--txt)",marginTop:2}}>
                    {bizName.split(" ")[0]}'s{" "}
                    <em style={{color:"var(--accent)"}}>{bizName.split(" ").slice(1).join(" ")}</em>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {[["🔔","🔔 3 new requests!"],["✏️",null]].map(([ic,msg])=>(
                    <div key={ic} onClick={() => msg ? toast(msg) : setActiveTab("editor")}
                      style={{width:40,height:40,borderRadius:12,background:"var(--surf2)",
                        border:"1px solid var(--bdr)",display:"flex",alignItems:"center",
                        justifyContent:"center",fontSize:17,cursor:"pointer",position:"relative"}}>
                      {ic}
                      {ic==="🔔" && <div style={{position:"absolute",top:7,right:7,width:7,height:7,
                        borderRadius:"50%",background:"var(--accent)",border:"2px solid var(--surf)"}}/>}
                    </div>
                  ))}
                </div>
              </div>
              {/* link banner */}
              <div style={{background:`linear-gradient(135deg,rgba(var(--accent-rgb),0.15),rgba(var(--accent-rgb),0.05))`,
                border:`1px solid rgba(var(--accent-rgb),0.25)`,borderRadius:18,padding:"13px 15px",
                display:"flex",gap:12}}>
                <div style={{width:38,height:38,borderRadius:11,
                  background:`linear-gradient(135deg,var(--accent),var(--accent2))`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔗</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",
                    textTransform:"uppercase",letterSpacing:"0.8px"}}>
                    Your Booking Link {curFlag}
                  </div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--txt)",margin:"3px 0 8px",wordBreak:"break-all"}}>
                    {bookUrl}
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["📋 Copy","var(--accent)"],["💬 WhatsApp","#25D366"],["↑ Share","var(--surf3)"]].map(([lbl,bg])=>(
                      <button key={lbl} onClick={() => toast(lbl.includes("Copy") ? "📋 Link copied!" : "💬 Opening WhatsApp…")}
                        style={{padding:"5px 11px",borderRadius:8,fontSize:11,fontWeight:700,
                          border:"none",cursor:"pointer",background:bg,color:"white",fontFamily:"inherit"}}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* body */}
            <div style={{flex:1,overflowY:"auto",padding:"16px 16px 100px",scrollbarWidth:"none"}}>
              {/* integration chips */}
              <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:18,scrollbarWidth:"none"}}>
                {[
                  { lbl:"✅ WhatsApp", ok:true  },
                  { lbl:"✅ Google Cal", ok:true },
                  { lbl:"⚡ Stripe – Setup", ok:false },
                  { lbl:`${curFlag} ${currency}`, ok:true },
                ].map((chip,i) => (
                  <div key={i} onClick={() => chip.lbl.includes("Stripe") ? setActiveTab("editor") : chip.lbl.includes(curFlag) ? setActiveTab("editor") : toast("✅ Connected!")}
                    style={{flexShrink:0,padding:"7px 12px",borderRadius:20,fontSize:11,fontWeight:700,
                      cursor:"pointer",
                      background: chip.ok ? "rgba(107,175,149,0.1)" : "rgba(212,168,90,0.1)",
                      border:`1.5px solid ${chip.ok ? "rgba(107,175,149,0.3)" : "rgba(212,168,90,0.3)"}`,
                      color: chip.ok ? "var(--sage)" : "var(--gold)"}}>
                    {chip.lbl}
                  </div>
                ))}
              </div>
              {/* stats */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                {[
                  { e:"📋", v:"8",       lbl:"Bookings Today",  c:"var(--accent)", ch:"↑ 3 from yesterday", up:true  },
                  { e:"💰", v:`${sym}342`, lbl:"Today's Revenue", c:"var(--gold)",   ch:"↑ 20% vs last week", up:true  },
                  { e:"⏳", v:"3",       lbl:"Pending Confirm", c:"var(--gold)",   ch:"Action needed",      up:false },
                  { e:"⭐", v:"4.9",     lbl:"Avg Rating",      c:"var(--sage)",   ch:"42 reviews",         up:true  },
                ].map((s,i) => (
                  <div key={i} style={{...cardStyle,padding:15}}>
                    <div style={{fontSize:19,marginBottom:7}}>{s.e}</div>
                    <div style={{fontSize:24,fontWeight:700,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{s.lbl}</div>
                    <div style={{fontSize:10,fontWeight:700,marginTop:4,color:s.up?"var(--sage)":"var(--accent)"}}>{s.ch}</div>
                  </div>
                ))}
              </div>
              {/* chart */}
              <div style={{...cardStyle,padding:18,marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:17,fontWeight:700}}>Weekly Revenue</div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--accent)"}}>{sym}1,840</div>
                </div>
                <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60,marginTop:14}}>
                  {[180,240,160,310,400,280,270].map((v,i) => (
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{width:"100%",borderRadius:"5px 5px 0 0",
                        height:(v/400*55)+"px",
                        background:`rgba(var(--accent-rgb),${v===400?1:0.5})`}}/>
                      <div style={{fontSize:10,color:"var(--muted)"}}>
                        {["M","T","W","T","F","S","S"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* booking cards */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:18,fontWeight:700}}>New Requests</div>
                <div onClick={()=>setActiveTab("cal")} style={{fontSize:12,color:"var(--accent)",fontWeight:600,cursor:"pointer"}}>All</div>
              </div>
              {[
                { name:"Amara Johnson",  when:"📱 Via booking link · 10 mins ago", svc:"Full Lash Set + Brow Wax", price:65 },
                { name:"Priya Sharma",   when:"📱 Via booking link · 42 mins ago", svc:"Gel Mani + Pedicure",     price:55 },
              ].map((bk,i) => (
                <div key={i} style={{...cardStyle,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,
                    background:"var(--accent)",borderRadius:"3px 0 0 3px"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
                    marginBottom:9,paddingLeft:8}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700}}>{bk.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{bk.when}</div>
                    </div>
                    <div style={{fontSize:10,fontWeight:700,padding:"4px 9px",borderRadius:20,
                      background:"rgba(var(--accent-rgb),0.15)",color:"var(--accent)"}}>New ✨</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--surf2)",
                    borderRadius:10,padding:"9px 12px",marginBottom:10,marginLeft:8}}>
                    <span style={{fontSize:13,fontWeight:600,flex:1}}>{bk.svc}</span>
                    <span style={{fontSize:13,fontWeight:700,color:"var(--accent)"}}>{sym}{bk.price}</span>
                  </div>
                  <div style={{display:"flex",gap:5,marginBottom:10,marginLeft:8,flexWrap:"wrap"}}>
                    {["💬 WA Sent","📅 Cal Synced","🔔 Reminders"].map(tg => (
                      <span key={tg} style={{fontSize:10,fontWeight:700,padding:"3px 8px",
                        borderRadius:20,background:"rgba(37,211,102,0.1)",color:"#25D366"}}>{tg}</span>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:7,marginLeft:8}}>
                    <button onClick={() => toast(`✅ ${bk.name.split(" ")[0]} confirmed!`)}
                      style={{...solidBtn("var(--sage)"),flex:1}}>✓ Confirm</button>
                    <button onClick={() => toast("💬 WhatsApp opened!")}
                      style={{...solidBtn("#25D366"),flex:1}}>💬 Chat</button>
                    <button onClick={() => toast("❌ Booking declined")}
                      style={{...solidBtn("rgba(var(--accent-rgb),0.12)","var(--accent)"),flex:1}}>✕</button>
                  </div>
                </div>
              ))}
              {/* completed card */}
              <div style={{...cardStyle,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,
                  background:"var(--muted)",borderRadius:"3px 0 0 3px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
                  marginBottom:9,paddingLeft:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700}}>Kezia Williams</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>✅ Today 9:30 AM · Complete</div>
                  </div>
                  <div style={{fontSize:10,fontWeight:700,padding:"4px 9px",borderRadius:20,
                    background:"var(--surf2)",color:"var(--muted)"}}>Done ✓</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--surf2)",
                  borderRadius:10,padding:"9px 12px",marginBottom:10,marginLeft:8}}>
                  <span style={{fontSize:13,fontWeight:600,flex:1}}>Brazilian Blow-dry</span>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--accent)"}}>{sym}85</span>
                </div>
                <div style={{display:"flex",gap:7,marginLeft:8}}>
                  <button onClick={()=>toast("⭐ Review request sent!")}
                    style={{...solidBtn("var(--surf3)","var(--txt)"),flex:1}}>⭐ Ask Review</button>
                  <button onClick={()=>toast("🧾 Invoice sent via Stripe!")}
                    style={{...solidBtn("#635BFF"),flex:1}}>🧾 Invoice</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ BOOKING PAGE ════ */}
        {activeTab === "booking" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bdr)",
              padding:"24px 20px 30px",textAlign:"center",flexShrink:0,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,
                background:"radial-gradient(ellipse 80% 60% at 50% 120%,rgba(var(--accent-rgb),0.25),transparent 70%)",
                pointerEvents:"none"}}/>
              <div style={{width:70,height:70,borderRadius:20,
                background:`linear-gradient(135deg,var(--accent),var(--accent2))`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:30,margin:"0 auto 10px",
                boxShadow:"0 12px 32px rgba(var(--accent-rgb),0.4)"}}>{profEmoji}</div>
              <div style={{fontSize:22,fontWeight:700}}>{bizName}</div>
              <div style={{fontSize:12,color:"var(--txt2)",marginTop:3}}>{tagline}</div>
              <div style={{display:"flex",justifyContent:"center",gap:7,marginTop:10,flexWrap:"wrap"}}>
                {[`⭐ 4.9`,`📍 ${location}`,`${curFlag} ${currency}`].map(b => (
                  <div key={b} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:20,padding:"4px 10px",fontSize:10,fontWeight:600,color:"var(--txt2)"}}>{b}</div>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"18px 16px 40px",scrollbarWidth:"none"}}>
              <div style={{fontSize:17,fontWeight:700,marginBottom:12}}>1. Choose a Service</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                {services.filter(s=>s.on).map(s => (
                  <div key={s.id} onClick={() => setPickedSvc(s)} style={{
                    background: pickedSvc?.id===s.id ? "rgba(var(--accent-rgb),0.1)" : "var(--surf)",
                    border:`2px solid ${pickedSvc?.id===s.id ? "var(--accent)" : "transparent"}`,
                    borderRadius:18,padding:"14px 12px",cursor:"pointer",
                    transition:"all 0.18s",position:"relative",overflow:"hidden",
                  }}>
                    {pickedSvc?.id===s.id && (
                      <span style={{position:"absolute",top:7,right:9,fontSize:11,fontWeight:800,color:"var(--accent)"}}>✓</span>
                    )}
                    <div style={{fontSize:22,marginBottom:7}}>{s.icon}</div>
                    <div style={{fontSize:13,fontWeight:700}}>{s.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>⏱ {s.dur}</div>
                    <div style={{fontSize:14,fontWeight:700,color:"var(--accent)",marginTop:6}}>{sym}{s.price}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:17,fontWeight:700,marginBottom:12}}>2. Pick a Date</div>
              <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:18,scrollbarWidth:"none"}}>
                {dateStrip.map((d,i) => (
                  <div key={i} onClick={() => setPickedDate(i)} style={{
                    flexShrink:0, minWidth:54,
                    background: pickedDate===i ? "var(--accent)" : "var(--surf)",
                    border:`2px solid ${pickedDate===i ? "var(--accent)" : "transparent"}`,
                    borderRadius:13,padding:"9px 13px",textAlign:"center",cursor:"pointer",
                    transition:"all 0.18s",
                    boxShadow: pickedDate===i ? "0 4px 16px rgba(var(--accent-rgb),0.4)" : "none",
                  }}>
                    <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",
                      color: pickedDate===i ? "rgba(255,255,255,0.7)" : "var(--muted)"}}>{d.short}</div>
                    <div style={{fontSize:19,fontWeight:700,marginTop:2,
                      color: pickedDate===i ? "white" : "var(--txt)"}}>{d.num}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:17,fontWeight:700,marginBottom:12}}>3. Choose a Time</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:20}}>
                {TIMES_ALL.map(t => {
                  const busy = TIMES_BUSY.has(t);
                  const sel  = pickedTime === t;
                  return (
                    <div key={t} onClick={() => !busy && setPickedTime(t)} style={{
                      background: sel ? "var(--accent)" : busy ? "var(--surf2)" : "var(--surf)",
                      border:`2px solid ${sel ? "var(--accent)" : "transparent"}`,
                      borderRadius:12,padding:"11px 5px",textAlign:"center",
                      fontSize:12,fontWeight:600,cursor: busy ? "not-allowed" : "pointer",
                      color: busy ? "var(--muted)" : sel ? "white" : "var(--txt)",
                      textDecoration: busy ? "line-through" : "none",
                      transition:"all 0.18s",
                    }}>{t}</div>
                  );
                })}
              </div>
              {/* details form */}
              <div style={{...cardStyle,marginBottom:16}}>
                <div style={{fontSize:17,fontWeight:700,marginBottom:14}}>4. Your Details</div>
                {[
                  ["Full Name","text","e.g. Amara Johnson",clientName,setClientName],
                  ["WhatsApp Number","tel","+44 7700 000000",clientPhone,setClientPhone],
                  ["Email (optional)","email","you@email.com","",()=>{}],
                ].map(([lbl,type,ph,val,setter]) => (
                  <div key={lbl} style={{marginBottom:12}}>
                    <span style={fieldLabelStyle}>{lbl}</span>
                    <input value={val} onChange={e=>setter(e.target.value)}
                      type={type} placeholder={ph} style={inpStyle}/>
                  </div>
                ))}
                <span style={fieldLabelStyle}>Auto-Sync Options</span>
                {[
                  ["💬","WhatsApp Confirmation","Booking details sent to your WhatsApp"],
                  ["📅","Phone Calendar","Appointment added automatically"],
                  ["🔔","Reminders (24hr + 1hr)","Never miss your appointment"],
                ].map(([ic,nm,sub]) => (
                  <div key={nm} style={{display:"flex",alignItems:"center",gap:12,
                    padding:"11px 13px",background:"rgba(var(--accent-rgb),0.08)",
                    border:"1.5px solid var(--accent)",borderRadius:12,marginBottom:8}}>
                    <span style={{fontSize:18}}>{ic}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{nm}</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>{sub}</div>
                    </div>
                    <div style={{width:22,height:22,borderRadius:7,background:"var(--accent)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:11,fontWeight:800,color:"white"}}>✓</div>
                  </div>
                ))}
              </div>
              {/* summary */}
              <div style={{...cardStyle,marginBottom:14}}>
                {[
                  ["Service",     pickedSvc?.name ?? "— Select service"],
                  ["Date & Time", pickedSvc && pickedTime ? `${dateStrip[pickedDate].lbl}, ${pickedTime}` : "— Pick date & time"],
                  ["Duration",    pickedSvc?.dur ?? "—"],
                ].map(([lbl,val]) => (
                  <div key={lbl} style={{display:"flex",justifyContent:"space-between",
                    alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
                    <span style={{fontSize:12,color:"var(--muted)"}}>{lbl}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{val}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--accent)"}}>Total</span>
                  <span style={{fontSize:20,fontWeight:700,color:"var(--gold)"}}>
                    {pickedSvc ? `${sym}${pickedSvc.price}` : "—"}
                  </span>
                </div>
              </div>
              <button onClick={submitBooking} style={{
                ...solidBtn(`linear-gradient(135deg,var(--accent),var(--accent2))`),
                borderRadius:18,padding:17,fontSize:15,
                boxShadow:"0 8px 24px rgba(var(--accent-rgb),0.4)",
              }}>{profEmoji} Confirm & Book Now</button>
              <div style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:12,lineHeight:1.7}}>
                🔒 Secure booking · Free cancellation 24hrs before<br/>
                Powered by <strong style={{color:"var(--accent)"}}>GlowBook Pro</strong>
              </div>
            </div>
          </div>
        )}

        {/* ════ CALENDAR ════ */}
        {activeTab === "cal" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bdr)",
              padding:"16px 18px 18px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:22,fontWeight:700}}>Schedule</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {["‹","›"].map((ch,i)=>(
                    <button key={ch} onClick={()=>{
                      const d=new Date(calViewDate);
                      d.setMonth(d.getMonth()+(i===0?-1:1));
                      setCalViewDate(d);
                    }} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",
                      borderRadius:8,width:30,height:30,color:"var(--txt)",cursor:"pointer",fontSize:13}}>{ch}</button>
                  ))}
                  <span style={{fontSize:13,fontWeight:600,minWidth:90,textAlign:"center"}}>{calLabel}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",marginBottom:6}}>
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
                  <span key={d} style={{fontSize:10,fontWeight:700,color:"var(--muted)",
                    padding:"4px 0",textTransform:"uppercase"}}>{d}</span>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                {calCells.map((cell,i) => (
                  <div key={i}
                    onClick={() => cell && toast(`📅 ${calLabel.split(" ")[0]} ${cell.d} — ${cell.hasBooking?"Has bookings":"Open"}`)}
                    style={{aspectRatio:"1",borderRadius:8,display:"flex",
                      alignItems:"center",justifyContent:"center",
                      fontSize:12,fontWeight:500,
                      cursor: cell ? "pointer" : "default",
                      color: cell?.isToday ? "white" : cell?.hasBooking ? "var(--txt)" : "var(--muted)",
                      background: cell?.isToday ? "var(--accent)" : "transparent",
                      boxShadow: cell?.isToday ? "0 2px 10px rgba(var(--accent-rgb),0.4)" : "none",
                      position:"relative"}}>
                    {cell?.d}
                    {cell?.hasBooking && !cell.isToday && (
                      <div style={{position:"absolute",bottom:3,width:4,height:4,
                        borderRadius:"50%",background:"var(--accent)"}}/>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px",scrollbarWidth:"none"}}>
              {[
                { t:"9:00",  name:"Kezia Williams", svc:`Brazilian Blow-dry · ${sym}85`, color:"var(--accent)", tags:["wa","cal","p"] },
                { t:"11:00", empty:true },
                { t:"12:30", name:"Priya Sharma",   svc:`Gel Mani + Pedi · ${sym}55`,  color:"var(--sage)",   tags:["wa","cal"] },
                { t:"2:00",  name:"Amara Johnson",  svc:`Full Lash Set · ${sym}65`,    color:"var(--accent)", tags:["wa","cal"] },
                { t:"3:30",  empty:true },
                { t:"5:00",  name:"Leila Hassan",   svc:`Glow Facial · ${sym}55`,      color:"var(--gold)",   tags:["wa"] },
              ].map((a,i) => (
                <div key={i} style={{display:"flex",gap:10,marginBottom:9,alignItems:"flex-start"}}>
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:600,minWidth:38,paddingTop:11}}>{a.t}</div>
                  {a.empty ? (
                    <div onClick={()=>toast("📅 Tap to add a booking or block this slot")}
                      style={{flex:1,border:"1.5px dashed rgba(var(--accent-rgb),0.25)",
                        borderRadius:14,padding:13,textAlign:"center",fontSize:12,
                        color:"var(--muted)",cursor:"pointer"}}>
                      + Available — tap to manage
                    </div>
                  ) : (
                    <div onClick={()=>toast(`👤 ${a.name}`)}
                      style={{flex:1,background:"var(--surf)",borderRadius:14,
                        padding:"12px 13px",borderLeft:`3px solid ${a.color}`,cursor:"pointer"}}>
                      <div style={{fontSize:13,fontWeight:700}}>{a.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{a.svc}</div>
                      <div style={{display:"flex",gap:5,marginTop:7,flexWrap:"wrap"}}>
                        {a.tags.map(tg => (
                          <span key={tg} style={{fontSize:10,fontWeight:700,padding:"2px 7px",
                            borderRadius:20,
                            background: tg==="wa"?"rgba(37,211,102,0.1)":tg==="cal"?"rgba(66,133,244,0.1)":"rgba(99,91,255,0.1)",
                            color: tg==="wa"?"#25D366":tg==="cal"?"#4285F4":"#635BFF"}}>
                            {tg==="wa"?"💬 WA":tg==="cal"?"📅 Cal":"💳 Paid"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ EDITOR ════ */}
        {activeTab === "editor" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bdr)",
              padding:"14px 18px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:22,fontWeight:700}}>Customise</div>
                <button onClick={()=>toast("💾 All changes saved & live!")}
                  style={{padding:"9px 18px",background:"var(--accent)",border:"none",
                    borderRadius:12,color:"white",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  💾 Save All
                </button>
              </div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>
                Changes appear live on your booking page
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px",scrollbarWidth:"none"}}>

              <Accordion icon="🎨" title="Brand & Profile" defaultOpen={true}>
                <FieldInput lbl="Studio Name"    value={bizName}  onChange={e=>setBizName(e.target.value)}  placeholder="e.g. Sophie's Beauty"/>
                <FieldInput lbl="Tagline"        value={tagline}  onChange={e=>setTagline(e.target.value)}  placeholder="Lashes · Nails · Brows"/>
                <FieldInput lbl="Location"       value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. East London"/>
                <div style={{marginBottom:14}}>
                  <span style={fieldLabelStyle}>Profile Emoji</span>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                    {EMOJI_OPTS.map(e => (
                      <span key={e} onClick={()=>setProfEmoji(e)} style={{
                        fontSize:26,cursor:"pointer",padding:6,borderRadius:10,
                        background: profEmoji===e ? "var(--surf2)" : "transparent",
                        border:`2px solid ${profEmoji===e ? "var(--accent)" : "transparent"}`,
                        transition:"all 0.2s",
                      }}>{e}</span>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <span style={fieldLabelStyle}>Brand Colour</span>
                  <ThemeDots active={themeName} onChange={n=>{setThemeName(n);toast("🎨 Theme updated!");}}/>
                </div>
              </Accordion>

              <Accordion icon="✂️" title="Services & Pricing">
                {/* Currency row */}
                <div style={{background:"rgba(var(--accent-rgb),0.06)",border:"1px solid rgba(var(--accent-rgb),0.2)",
                  borderRadius:14,padding:14,marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>Currency</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>Applies to all services & payments</div>
                    </div>
                    <span style={{fontSize:22}}>{curFlag}</span>
                  </div>
                  <CurrencyPicker value={currency} onChange={c=>{setCurrency(c);toast(`${CURRENCIES.find(x=>x.code===c)?.flag} Currency set to ${c}!`);}}/>
                </div>
                {/* services list */}
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {services.map((s,i) => (
                    <div key={s.id} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",
                      borderRadius:14,padding:"13px 14px",display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:22,flexShrink:0}}>{s.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700}}>{s.name}</div>
                        <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.dur}</div>
                      </div>
                      <div style={{fontSize:14,fontWeight:700,color:"var(--accent)",marginRight:10,flexShrink:0}}>
                        {sym}{s.price}
                      </div>
                      <Tog on={s.on} onChange={on=>{
                        setServices(prev=>prev.map((x,j)=>j===i?{...x,on}:x));
                        toast(on?"✅ Service enabled":"⭕ Hidden from booking page");
                      }}/>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowAddSvc(true)} style={{
                  width:"100%",marginTop:10,padding:13,
                  background:"rgba(var(--accent-rgb),0.08)",
                  border:"1.5px dashed rgba(var(--accent-rgb),0.4)",
                  borderRadius:14,color:"var(--accent)",
                  fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",
                }}>＋ Add New Service</button>
              </Accordion>

              <Accordion icon="🕐" title="Working Hours">
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {workHours.map((h,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                      background:"var(--surf2)",border:"1px solid var(--bdr)",
                      borderRadius:12,padding:"11px 13px"}}>
                      <div style={{fontSize:13,fontWeight:600,minWidth:34}}>{h.day}</div>
                      <div style={{flex:1,fontSize:12,color:"var(--muted)"}}>
                        {h.on?"9:00 AM – 7:00 PM":"Closed"}
                      </div>
                      <Tog on={h.on} onChange={on=>{
                        setWorkHours(prev=>prev.map((x,j)=>j===i?{...x,on}:x));
                        toast(`📅 ${WEEK_DAYS[i]} ${on?"opened":"closed"}`);
                      }}/>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion icon="⚙️" title="Booking Settings">
                <div style={{marginBottom:14}}>
                  <span style={fieldLabelStyle}>Deposit</span>
                  <select style={{...inpStyle,appearance:"none"}}>
                    {["No deposit","10% deposit","20% deposit (recommended)","50% deposit","Full payment upfront"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:14}}>
                  <span style={fieldLabelStyle}>Cancellation Policy</span>
                  <select style={{...inpStyle,appearance:"none"}}>
                    {["Free cancellation anytime","Free cancellation 24hrs before","Free cancellation 48hrs before","No refunds"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <SwRow lbl="Instant Booking"      sub="Auto-confirm without approval"    on={instantBook} onChange={setInstantBook}/>
                <SwRow lbl="WhatsApp Reminders"   sub="Auto-send 24hr & 1hr before"      on={waRemind}    onChange={setWaRemind}/>
                <SwRow lbl="Calendar Sync"        sub="All bookings → your calendar"     on={calSync}     onChange={setCalSync}/>
                <SwRow lbl="Review Requests"      sub="Auto-ask after each appointment"  on={autoReview}  onChange={setAutoReview}/>
              </Accordion>

              <Accordion icon="🔌" title="Integrations">
                {[
                  { icon:"💬", title:"WhatsApp Business", color:"#25D366", bg:"rgba(37,211,102,0.12)", ph:"Your WhatsApp Business number", val:waNum,     set:setWaNum,     ok:waOk,      connect:()=>{setWaOk(true);    toast("✅ WhatsApp connected!");} },
                  { icon:"📅", title:"Google Calendar",   color:"#4285F4", bg:"rgba(66,133,244,0.1)",  ph:"your.email@gmail.com",          val:calId,    set:setCalId,     ok:calOk,     connect:()=>{setCalOk(true);   toast("✅ Calendar synced!");} },
                  { icon:"💳", title:"Stripe Payments",   color:"#635BFF", bg:"rgba(99,91,255,0.1)",   ph:"pk_live_... (Publishable Key)", val:stripeKey, set:setStripeKey, ok:stripeOk,  connect:()=>{setStripeOk(true);toast("✅ Stripe connected!");} },
                ].map(int => (
                  <div key={int.title} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",
                    borderRadius:14,padding:15,marginBottom:9}}>
                    <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
                      <div style={{width:36,height:36,borderRadius:10,background:int.bg,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>
                        {int.icon}
                      </div>
                      <div style={{fontSize:14,fontWeight:700,flex:1}}>{int.title}</div>
                      <div style={{fontSize:10,fontWeight:700,padding:"4px 9px",borderRadius:20,
                        background: int.ok?"rgba(107,175,149,0.15)":"rgba(var(--accent-rgb),0.1)",
                        color: int.ok?"var(--sage)":"var(--accent)"}}>
                        {int.ok?"✅ Connected":"Not Connected"}
                      </div>
                    </div>
                    <input value={int.val} onChange={e=>int.set(e.target.value)}
                      placeholder={int.ph} style={{...inpStyle,marginBottom:10}}/>
                    <button onClick={int.connect}
                      style={{...solidBtn(int.color),borderRadius:12,padding:12}}>
                      Connect {int.title.split(" ")[0]}
                    </button>
                  </div>
                ))}
              </Accordion>

            </div>
          </div>
        )}

        {/* ════ GUIDE ════ */}
        {activeTab === "guide" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bdr)",
              padding:"16px 18px",flexShrink:0}}>
              <div style={{fontSize:22,fontWeight:700}}>How to Use GlowBook</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>
                Tap any section to expand · Built for beauticians
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px",scrollbarWidth:"none"}}>
              {GUIDE_DATA.map((ph,pi) => (
                <Accordion key={pi} icon={ph.icon} title={ph.title} defaultOpen={pi===0}>
                  <div style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>{ph.sub}</div>
                  {ph.steps.map((step,si) => (
                    <div key={si} style={{display:"flex",gap:12,marginBottom:16}}>
                      <div style={{width:26,height:26,borderRadius:8,
                        background:"rgba(var(--accent-rgb),0.12)",color:"var(--accent)",
                        fontSize:11,fontWeight:800,display:"flex",alignItems:"center",
                        justifyContent:"center",flexShrink:0,marginTop:1}}>{si+1}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{step.t}</div>
                        <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6}}
                          dangerouslySetInnerHTML={{__html:step.d}}/>
                        {step.tip && (
                          <div style={{background:"rgba(var(--accent-rgb),0.08)",
                            borderLeft:"3px solid var(--accent)",borderRadius:"0 8px 8px 0",
                            padding:"8px 12px",fontSize:11,color:"var(--txt2)",
                            marginTop:7,lineHeight:1.6}}>
                            💡 <strong>Pro Tip:</strong> {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Accordion>
              ))}
            </div>
          </div>
        )}

        {/* ════ PUBLISH ════ */}
        {activeTab === "publish" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bdr)",
              padding:"16px 18px",flexShrink:0}}>
              <div style={{fontSize:22,fontWeight:700}}>Publish Your App 🚀</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>
                Go live on iOS, Android or as a web app
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px",scrollbarWidth:"none"}}>
              {[
                { icon:"🍎", title:"Apple App Store (iOS)",    sub:"iPhone & iPad · £79/year developer fee",   bg:"rgba(255,255,255,0.06)" },
                { icon:"🤖", title:"Google Play (Android)",    sub:"Android devices · $25 one-time fee",       bg:"rgba(66,133,244,0.08)" },
                { icon:"🌐", title:"PWA — Instant, No Stores", sub:"Works on all devices now · Recommended",  bg:"rgba(var(--accent-rgb),0.08)" },
              ].map(s => (
                <div key={s.title} onClick={()=>toast(`📲 Opening ${s.title} guide…`)}
                  style={{...cardStyle,display:"flex",alignItems:"center",gap:13,cursor:"pointer"}}>
                  <div style={{width:48,height:48,borderRadius:14,background:s.bg,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{s.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:700}}>{s.title}</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{s.sub}</div>
                  </div>
                  <span style={{color:"var(--muted)",fontSize:16}}>›</span>
                </div>
              ))}
              <div style={{fontSize:18,fontWeight:700,margin:"20px 0 12px"}}>Pricing Plans</div>
              {[
                { name:"Free",     price:"£0",    per:"/month", feat:["20 bookings/month","1 service","Basic WhatsApp","GlowBook branding"],                                                                                              featured:false },
                { name:"Pro",      price:"£9.99", per:"/month", feat:["Unlimited bookings","Unlimited services","WhatsApp + Calendar + Stripe","Custom brand & colours","Automated reminders","Revenue analytics","Remove branding"],  featured:true  },
                { name:"Business", price:"£24.99",per:"/month", feat:["Everything in Pro","Multiple staff","Multiple locations","Loyalty programme","White-label app name","Priority support"],                                          featured:false },
              ].map(pl => (
                <div key={pl.name} style={{...cardStyle,position:"relative",overflow:"hidden",
                  border:`1px solid ${pl.featured?"var(--accent)":"var(--bdr)"}`,marginBottom:12}}>
                  {pl.featured && (
                    <div style={{position:"absolute",top:12,right:-28,background:"var(--accent)",
                      color:"white",fontSize:10,fontWeight:700,padding:"4px 36px",
                      transform:"rotate(45deg)"}}>Popular</div>
                  )}
                  <div style={{fontSize:20,fontWeight:700}}>{pl.name}</div>
                  <div style={{fontSize:30,fontWeight:700,color:"var(--accent)",margin:"6px 0 10px"}}>
                    {pl.price} <span style={{fontSize:14,color:"var(--muted)",fontWeight:400}}>{pl.per}</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                    {pl.feat.map(f=>(
                      <div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--txt2)"}}>
                        <span style={{color:"var(--sage)",fontWeight:800}}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>toast(pl.featured?"🎉 14-day Pro trial started!":pl.name==="Free"?"✅ Free plan selected!":"📞 We'll be in touch!")}
                    style={{...solidBtn(pl.featured?"var(--accent)":"transparent","var(--txt)"),
                      border:pl.featured?"none":"1.5px solid var(--bdr)",
                      borderRadius:13,padding:13,fontSize:14}}>
                    {pl.featured?"Start 14-Day Free Trial":pl.name==="Free"?"Get Started Free":"Contact Us"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>{/* end screen area */}

      {/* ── bottom nav ── */}
      <div style={{background:"rgba(15,10,26,0.97)",backdropFilter:"blur(24px)",
        borderTop:"1px solid var(--bdr)",display:"flex",
        padding:"10px 0 16px",flexShrink:0,position:"relative",zIndex:10}}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"5px 0"}}>
            <span style={{fontSize:20,lineHeight:1,
              filter: activeTab===t.id ? `drop-shadow(0 0 6px rgba(var(--accent-rgb),0.6))` : "none"}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:600,
              color: activeTab===t.id ? "var(--accent)" : "var(--muted)"}}>{t.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── add service modal ── */}
      {showAddSvc && (
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAddSvc(false);}}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,
            display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)"}}>
          <div style={{background:"var(--surf)",borderRadius:"26px 26px 0 0",
            width:"100%",maxWidth:430,margin:"0 auto",
            padding:"20px 20px 44px",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{width:36,height:4,background:"var(--bdr)",borderRadius:2,margin:"0 auto 18px"}}/>
            <div style={{fontSize:21,fontWeight:700,marginBottom:16}}>Add New Service</div>
            <FieldInput lbl="Service Name" value={newSvcName} onChange={e=>setNewSvcName(e.target.value)} placeholder="e.g. Gel Manicure"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div>
                <span style={fieldLabelStyle}>Price ({sym})</span>
                <input value={newSvcPrice} onChange={e=>setNewSvcPrice(e.target.value)}
                  type="number" placeholder="35" style={inpStyle}/>
              </div>
              <div>
                <span style={fieldLabelStyle}>Duration</span>
                <input value={newSvcDur} onChange={e=>setNewSvcDur(e.target.value)}
                  placeholder="60 min" style={inpStyle}/>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <span style={fieldLabelStyle}>Icon</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                {EMOJI_OPTS.map(e=>(
                  <span key={e} onClick={()=>setNewSvcIcon(e)} style={{
                    fontSize:26,cursor:"pointer",padding:6,borderRadius:10,
                    background: newSvcIcon===e?"var(--surf2)":"transparent",
                    border:`2px solid ${newSvcIcon===e?"var(--accent)":"transparent"}`,
                    transition:"all 0.2s",
                  }}>{e}</span>
                ))}
              </div>
            </div>
            <button onClick={addNewService} style={{
              ...solidBtn(`linear-gradient(135deg,var(--accent),var(--accent2))`),
              borderRadius:16,padding:16,fontSize:15,
              boxShadow:"0 6px 20px rgba(var(--accent-rgb),0.35)",
            }}>＋ Add Service</button>
          </div>
        </div>
      )}

      {/* ── booking success ── */}
      {showSuccess && (
        <div style={{position:"fixed",inset:0,zIndex:300,background:"var(--bg)",
          display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",padding:"36px 24px",textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",
            background:"linear-gradient(135deg,var(--sage),#4A9075)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:34,marginBottom:20,
            boxShadow:"0 12px 32px rgba(107,175,149,0.4)"}}>✓</div>
          <div style={{fontSize:28,fontWeight:700,marginBottom:8}}>You're Booked! 🎉</div>
          <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.6,marginBottom:24}}>
            {clientName}, your {pickedSvc?.name} is confirmed for {dateStrip[pickedDate].lbl} at {pickedTime} with {bizName}.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9,width:"100%",marginBottom:24}}>
            {[
              { bg:"rgba(37,211,102,0.1)",  color:"#1a9a45", icon:"💬", txt:"WhatsApp confirmation sent"    },
              { bg:"rgba(66,133,244,0.1)",  color:"#2a5db8", icon:"📅", txt:"Added to your phone calendar"  },
              { bg:"rgba(212,168,90,0.1)",  color:"#9a7020", icon:"🔔", txt:"Reminders: 24hrs & 1hr before" },
              { bg:"rgba(99,91,255,0.1)",   color:"#635BFF", icon:"🔒", txt:`Deposit secured (${curFlag} ${currency})` },
            ].map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:11,
                padding:"13px 15px",borderRadius:13,background:p.bg,
                fontSize:13,fontWeight:600,color:p.color}}>
                <span style={{fontSize:18}}>{p.icon}</span><span>{p.txt}</span>
              </div>
            ))}
          </div>
          <button onClick={closeSuccess} style={{width:"100%",padding:16,
            background:"var(--surf)",border:"1px solid var(--bdr)",
            borderRadius:18,color:"var(--txt)",fontFamily:"inherit",
            fontSize:15,fontWeight:700,cursor:"pointer"}}>
            ← Back to Booking Page
          </button>
        </div>
      )}

      {/* ── toast ── */}
      <Toast msg={toastMsg} visible={toastShow}/>

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
        input,select,textarea { font-family:Georgia,serif; }
        input:focus,select:focus { border-color:var(--accent)!important; outline:none; }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}