/**
 * MAIN CONTROLLER (JAVASCRIPT)
 * Simulates Frontend <-> Backend Logic
 */

// Imports from CDN (Works in CodePen)
import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

// ==========================================
// 1. INIT SYSTEM & CONFIG
// ==========================================
const views = ['view-landing', 'app', 'view-role', 'view-login-tourist', 'view-register-tourist', 'view-dash-tourist', 'view-login-officer', 'view-dash-officer'];
let officerTimer = null;

// Initialize Clock
setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB');
    document.getElementById('sys-clock').innerText = timeString;
}, 1000);


// ==========================================
// 2. VIEW CONTROLLER (Router)
// ==========================================
window.switchView = (target) => {
    // Hide all views
    views.forEach(v => {
        const el = document.getElementById(v);
        if(el) el.classList.add('hidden');
    });

    // Logic for specific views
    if(target === 'landing') {
        document.getElementById('view-landing').classList.remove('hidden');
    } else {
        document.getElementById('app').classList.remove('hidden');
        document.getElementById(`view-${target}`).classList.remove('hidden');
    }

    // Start/Stop Backend polling for Officer view
    if(target === 'dash-officer') startOfficerChaos();
    else stopChaos();
};


// ==========================================
// 3. AUTHENTICATION & VALIDATION
// ==========================================
window.validateAndLogin = (type) => {
    let isValid = true;
    let idField, passField;

    if(type === 'tourist') {
        idField = document.getElementById('t-user');
        passField = document.getElementById('t-pass');
    } else {
        idField = document.getElementById('o-user');
        passField = document.getElementById('o-pass');
    }

    // Check Empty Fields
    if(!idField.value.trim()) { 
        idField.classList.add('error'); 
        isValid = false; 
    }
    if(!passField.value.trim()) { 
        passField.classList.add('error'); 
        isValid = false; 
    }

    // Clear error animation
    setTimeout(() => {
        idField.classList.remove('error');
        passField.classList.remove('error');
    }, 500);

    if(isValid) {
        // Simulate Network Request
        const btn = document.querySelector(type === 'tourist' ? '#view-login-tourist button' : '#view-login-officer button');
        const originalText = btn.innerText;
        btn.innerText = "Authenticating...";
        btn.style.opacity = "0.7";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.opacity = "1";
            switchView(`dash-${type}`);
            
            // Add "Java" log if officer
            if(type === 'officer') {
                addLog("[AUTH] SecurityContext: User 'TN-COP-007' granted ROLE_ADMIN", "java");
            }
        }, 1000);
    }
}


// ==========================================
// 4. FEATURE LOGIC
// ==========================================

// DigiLocker Simulation
window.verifyDigi = (btn) => {
    const icon = document.getElementById('digi-icon');
    const text = document.getElementById('digi-text');
    
    text.innerText = "Connecting to UIDAI...";
    btn.style.opacity = "0.7";
    
    setTimeout(() => {
        btn.classList.add('verified');
        btn.style.opacity = "1";
        icon.innerText = "✅";
        text.innerText = "Aadhaar Verified";
        showToast("DigiLocker API: Identity Confirmed", "green");
    }, 1500);
};

// SOS Trigger Logic
window.triggerSOS = () => {
    const lat = 13.0827;
    const lng = 80.2707;
    alert(`🚨 SOS SIGNAL TRANSMITTED\n\nGPS: ${lat}° N, ${lng}° E\nLocation: Chennai\n\nTN Police Control Room Notified.`);
    showToast("SOS Uplink Established (High Priority)", "crit");
};


// ==========================================
// 5. BACKEND SIMULATION (Officer View)
// ==========================================
function startOfficerChaos() {
    if(officerTimer) return;
    
    // Initial Java Logs
    addLog("[INFO] SpringBootApp: Started in 1.45s", "java");
    addLog("[INFO] KafkaConsumer: Listening to topic 'sos-alerts'", "java");
    addLog("[INFO] GeoFencingService: 4 Active Zones loaded", "java");

    officerTimer = setInterval(() => {
        const locations = ["Madurai", "Coimbatore", "Salem", "Kanyakumari", "Trichy", "Vellore", "Tirunelveli"];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        
        const events = [
            { msg: `Zone Violation: ${loc} Forest`, type: 'crit' },
            { msg: `SOS Alert: ID-882 (${loc})`, type: 'crit' },
            { msg: `Density Warning: ${loc} Temple`, type: 'warn' },
            { msg: `Drone Link Active: ${loc}`, type: 'green' },
            { msg: `Weather Alert: ${loc}`, type: 'warn' }
        ];
        const evt = events[Math.floor(Math.random() * events.length)];
        
        // Log to Terminal
        addLog(`[ALERT] ${evt.msg}`);
        
        // Show Visual Toast
        showToast(evt.msg, evt.type);
        
    }, 6000); // 6 Second Cycle
}

window.stopChaos = () => {
    clearInterval(officerTimer);
    officerTimer = null;
    const container = document.getElementById('toast-container');
    if(container) container.innerHTML = "";
};

// Helper: Add Line to Terminal
function addLog(msg, className="") {
    const div = document.getElementById('sys-log');
    if(!div) return;
    const time = new Date().toLocaleTimeString('en-GB');
    div.innerHTML += `<div class="term-line ${className}"><span>[${time}]</span> ${msg}</div>`;
    div.scrollTop = div.scrollHeight;
}

// Helper: Show Notification
function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const el = document.createElement('div');
    el.className = `toast ${type || ''}`;
    el.innerHTML = `<span>${msg}</span><span class="toast-meta">Now</span>`;
    container.appendChild(el);
    
    requestAnimationFrame(() => el.classList.add('show'));
    
    setTimeout(() => { 
        el.classList.remove('show'); 
        setTimeout(()=>el.remove(), 300); 
    }, 4000);
}


// ==========================================
// 6. THREE.JS BACKGROUND & CARD EFFECTS
// ==========================================

// Initialize Tubes
const canvas = document.getElementById('canvas');
TubesCursor(canvas, {
    tubes: {
        colors: ["#00f3ff", "#bc13fe", "#ffffff"],
        lights: { intensity: 30, colors: ["#00f3ff", "#bc13fe", "#0000ff"] } 
    }
});

// Handle Window Resize
window.addEventListener('resize', () => { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
});

// Handle Touch Input
window.addEventListener("touchmove", (e) => {
    if(e.touches.length > 0) {
        window.dispatchEvent(new MouseEvent("mousemove", { 
            clientX: e.touches[0].clientX, 
            clientY: e.touches[0].clientY 
        }));
    }
}, { passive: false });

// Card Glow Interaction
const $card = document.querySelector(".card");
document.addEventListener("pointermove", (e) => {
    if(!$card || $card.offsetParent === null) return;
    
    const rect = $card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    
    // Update CSS Variables
    $card.style.setProperty('--pointer-x', `${x}px`);
    $card.style.setProperty('--pointer-y', `${y}px`);
});