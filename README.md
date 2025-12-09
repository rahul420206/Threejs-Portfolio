# 🚀 Creative 3D Portfolio

A high-performance, immersive personal portfolio website built with React and Three.js.  
This project features an interactive deep-space 3D environment, warp-speed transitions, and procedurally generated asteroids — all wrapped in a futuristic glassmorphism UI.

🔗 **Live Demo:** https://rahul-nitap-portfolio.netlify.app/

---

## ✨ Features

### 🌌 Immersive 3D Background

A procedurally generated starfield of 5,000+ particles built using Three.js.

### ⚡ Warp Speed Navigation

Clicking navigation links triggers a warp animation, rapidly accelerating stars along the Z-axis to simulate supersonic travel.

### 🪨 Procedural Asteroids

Asteroids are generated using `DodecahedronGeometry` with vertex distortion, producing unique non-repeating shapes every time.

### 🎯 Interactive Physics

Clicking an asteroid applies a velocity vector and rotational force, sending it spinning into deep space.

### 📱 Responsive Design

Tailwind CSS powers a modern and mobile-friendly layout.

### 🎞 Smooth Animations

Framer Motion brings sections and elements to life with subtle scroll-based animations.

---

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **Language:** TypeScript
- **3D Engine:** Three.js
- **Renderer:** React Three Fiber & Drei
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 📂 Project Structure

src/
├── components/
│ ├── Background3D.tsx # Core 3D logic (Stars, Asteroids, Warp)
│ ├── WarpContext.tsx # Global warp state manager
│ ├── Navbar.tsx # Navigation that triggers warp effect
│ ├── Hero.tsx # Landing section + 3D Resume button
│ ├── Projects.tsx # Project showcase
│ ├── Experience.tsx # Work experience timeline
│ └── Contact.tsx # Contact section + footer
├── constants/
│ └── index.ts # Config for text, links, and data
└── App.tsx # Main entry point

---

## 🔧 How It Works

### ⭐ Starfield

- Generated mathematically using random XYZ positions
- Idle: Slow rotation simulating a drifting galaxy
- Warp mode: Rapid Z-movement triggers warp-speed visuals
- Stars crossing the camera are recycled behind the scene

### 🪨 Procedural Asteroid System

Asteroids use custom geometry logic:

```ts
const geometry = new THREE.DodecahedronGeometry(1, 1);
// Modify vertices to create irregular rock-like shapes

⚙️ Physics Interactions

Each asteroid stores velocity in a useRef object

Clicking applies force + angular momentum

Movement decays naturally over time

💻 Run Locally
Prerequisites

Node.js 16+

npm or yarn

Steps
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev

Visit in browser: http://localhost:5173

🎨 Customization

Update personal details & project info: src/constants/index.ts

Modify starfield speed, warp duration, asteroid spawn rate: src/components/Background3D.tsx

🚀 Deployment

This project is optimized for Netlify, Vercel, and similar hosting providers.

Build for production:

npm run build


Upload the dist directory or connect your GitHub repo for auto-deploy.

📄 License

Distributed under the MIT License.

Built with ❤️ by Rahul Matta


---

If you want, I can also:

✅ generate badges (Tech stack, License, Build)
✅ add screenshots / GIF previews
✅ create a polished GitHub profile-style README

Just tell me!


```
