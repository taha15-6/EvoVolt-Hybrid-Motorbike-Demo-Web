const BIKE_PRICE = 579999;

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

function initCalculator() {
  const planState = {
    months: 12,
    downPayment: 0,
  };

  const downPaymentInput = document.querySelector("#downPayment");
  const downPaymentValue = document.querySelector("#downPaymentValue");
  const monthlyAmount = document.querySelector("#monthlyAmount");
  const remainingAmount = document.querySelector("#remainingAmount");
  const monthButtons = document.querySelectorAll(".month-button");

  if (!downPaymentInput || !downPaymentValue || !monthlyAmount || !remainingAmount) {
    return;
  }

  function updateCalculator() {
    const balance = Math.max(BIKE_PRICE - planState.downPayment, 0);
    const monthly = balance / planState.months;

    downPaymentValue.textContent = formatPKR(planState.downPayment);
    monthlyAmount.textContent = formatPKR(monthly);
    remainingAmount.textContent = formatPKR(balance);
  }

  downPaymentInput.addEventListener("input", (event) => {
    planState.downPayment = Number(event.target.value);
    updateCalculator();
  });

  monthButtons.forEach((button) => {
    button.addEventListener("click", () => {
      monthButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      planState.months = Number(button.dataset.months);
      updateCalculator();
    });
  });

  updateCalculator();
}

const focusCopy = {
  urban: {
    title: "Urban stance",
    detail:
      "Compact red trellis frame, upright bars, dual disc presence, and a low battery bay for balanced handling.",
  },
  power: {
    title: "Hybrid powertrain",
    detail:
      "A 125cc engine works with 48V electric assist for cleaner launches, smarter energy use, and better city response.",
  },
  battery: {
    title: "48V battery layout",
    detail:
      "The Li-ion battery pack sits inside a protected central compartment to keep mass low and improve stability.",
  },
  safety: {
    title: "Safer control",
    detail:
      "Dual-channel ABS, front and rear discs, LED lighting, and a rigid frame support confident daily riding.",
  },
};

const prototypeFocus = document.querySelector("#prototypeFocus");
const prototypeDetail = document.querySelector("#prototypeDetail");
const viewButtons = document.querySelectorAll(".view-button");

let activeView = "urban";
let viewRotationTarget = 0.28;
let viewHeightTarget = 0.04;

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    activeView = button.dataset.view || "urban";
    prototypeFocus.textContent = focusCopy[activeView].title;
    prototypeDetail.textContent = focusCopy[activeView].detail;

    viewRotationTarget = {
      urban: 0.28,
      power: -0.48,
      battery: 0.86,
      safety: -0.98,
    }[activeView];

    viewHeightTarget = {
      urban: 0.04,
      power: -0.02,
      battery: 0.13,
      safety: 0.08,
    }[activeView];
  });
});

function initBookingModal() {
  const openButtons = document.querySelectorAll("[data-open-booking]");

  if (!openButtons.length) return;

  const modal = document.createElement("div");
  modal.className = "booking-overlay";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="bookingTitle">
      <button class="modal-close" type="button" data-close-booking aria-label="Close booking form">x</button>
      <p class="eyebrow">Book a test ride</p>
      <h2 id="bookingTitle">Reserve your Evo Volt Hybrid slot.</h2>
      <form class="booking-form" id="bookingForm">
        <label>
          Full name
          <input type="text" name="name" placeholder="Your name" required />
        </label>
        <label>
          Phone number
          <input type="tel" name="phone" placeholder="+92 300 0000000" required />
        </label>
        <label>
          City
          <select name="city" required>
            <option value="">Select city</option>
            <option>Lahore</option>
            <option>Karachi</option>
            <option>Islamabad</option>
            <option>Rawalpindi</option>
            <option>Faisalabad</option>
            <option>Multan</option>
          </select>
        </label>
        <label>
          Interest
          <select name="interest" required>
            <option>Test ride</option>
            <option>0% installment plan</option>
            <option>Dealer information</option>
          </select>
        </label>
        <button class="button primary" type="submit">Send Request</button>
        <p class="form-status" id="bookingStatus" role="status"></p>
      </form>
    </div>
  `;

  document.body.append(modal);

  const closeButton = modal.querySelector("[data-close-booking]");
  const form = modal.querySelector("#bookingForm");
  const status = modal.querySelector("#bookingStatus");

  function openModal() {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => modal.classList.add("is-open"));
    closeButton?.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => {
      modal.hidden = true;
    }, 180);
  }

  openButtons.forEach((button) => button.addEventListener("click", openModal));
  closeButton?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name") || "Rider";
    status.textContent = `${name}, your Evo Volt test ride request has been recorded.`;
    form.reset();
  });
}

async function initPrototype() {
  const canvas = document.querySelector("#bikeCanvas");
  const fallback = document.querySelector("#sceneFallback");

  if (!canvas) return;

  let THREE;
  try {
    THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js");
  } catch (error) {
    fallback?.classList.add("is-visible");
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.2, 7.3);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const bike = new THREE.Group();
  bike.rotation.y = viewRotationTarget;
  bike.rotation.x = 0.04;
  scene.add(bike);

  const red = new THREE.MeshStandardMaterial({
    color: 0xd80f21,
    roughness: 0.34,
    metalness: 0.48,
  });
  const deepRed = new THREE.MeshStandardMaterial({
    color: 0x7c0811,
    roughness: 0.42,
    metalness: 0.3,
  });
  const black = new THREE.MeshStandardMaterial({
    color: 0x060608,
    roughness: 0.62,
    metalness: 0.3,
  });
  const tire = new THREE.MeshStandardMaterial({
    color: 0x050506,
    roughness: 0.88,
    metalness: 0.08,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xa8afb8,
    roughness: 0.26,
    metalness: 0.84,
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x262a31,
    roughness: 0.5,
    metalness: 0.58,
  });
  const battery = new THREE.MeshStandardMaterial({
    color: 0x313a45,
    roughness: 0.36,
    metalness: 0.48,
    emissive: 0x10281b,
    emissiveIntensity: 0.25,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: 0xf5f7ff,
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0xffd0c8,
    emissiveIntensity: 0.7,
  });

  const wheelGroups = [];

  function makeMesh(geometry, material, position, rotation, scale, parent = bike) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    if (scale) mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }

  function cylinderBetween(start, end, radius, material, parent = bike) {
    const startVector = new THREE.Vector3(...start);
    const endVector = new THREE.Vector3(...end);
    const midpoint = new THREE.Vector3().addVectors(startVector, endVector).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(endVector, startVector);
    const length = direction.length();
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 18);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(midpoint);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    parent.add(mesh);
    return mesh;
  }

  function createWheel(x) {
    const group = new THREE.Group();
    group.position.set(x, 0.76, 0);
    bike.add(group);

    makeMesh(new THREE.TorusGeometry(0.61, 0.08, 20, 70), tire, [0, 0, 0], null, null, group);
    makeMesh(new THREE.TorusGeometry(0.38, 0.025, 12, 54), metal, [0, 0, 0.005], null, null, group);
    makeMesh(new THREE.CylinderGeometry(0.13, 0.13, 0.13, 28), darkMetal, [0, 0, 0], [Math.PI / 2, 0, 0], null, group);

    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const rimPoint = [Math.cos(angle) * 0.34, Math.sin(angle) * 0.34, 0.02];
      cylinderBetween([0, 0, 0.02], rimPoint, 0.008, metal, group);
    }

    makeMesh(new THREE.CylinderGeometry(0.29, 0.29, 0.035, 42), metal, [0, 0, 0.075], [Math.PI / 2, 0, 0], null, group);
    wheelGroups.push(group);
    return group;
  }

  createWheel(-2.15);
  createWheel(2.1);

  cylinderBetween([-2.15, 0.76, 0], [-0.55, 1.08, 0], 0.045, darkMetal);
  cylinderBetween([-2.15, 0.76, 0.05], [-0.35, 1.38, 0.05], 0.035, red);
  cylinderBetween([-0.35, 1.38, 0.05], [0.83, 1.55, 0.05], 0.046, red);
  cylinderBetween([-0.55, 1.08, -0.05], [0.83, 1.55, -0.05], 0.04, red);
  cylinderBetween([-0.55, 1.08, 0], [0.25, 2.03, 0], 0.035, red);
  cylinderBetween([0.25, 2.03, 0], [0.83, 1.55, 0], 0.04, red);
  cylinderBetween([2.1, 0.76, 0.07], [1.66, 1.92, 0.07], 0.04, metal);
  cylinderBetween([2.1, 0.76, -0.07], [1.66, 1.92, -0.07], 0.04, metal);
  cylinderBetween([1.66, 1.92, 0], [1.95, 2.05, 0], 0.03, metal);
  cylinderBetween([-2.15, 0.76, -0.08], [-1.68, 1.76, -0.08], 0.035, metal);

  makeMesh(new THREE.BoxGeometry(0.82, 0.62, 0.44), battery, [-0.52, 1.25, 0], [0, 0, 0.08]);
  makeMesh(new THREE.CylinderGeometry(0.34, 0.38, 0.56, 38), black, [0.2, 1.05, 0], [Math.PI / 2, 0, 0.12]);
  makeMesh(new THREE.CylinderGeometry(0.22, 0.24, 0.5, 34), metal, [0.47, 1.02, 0.02], [Math.PI / 2, 0, 0.12]);
  makeMesh(new THREE.BoxGeometry(1.55, 0.2, 0.42), black, [-0.78, 2.05, 0], [0, 0, -0.08]);
  makeMesh(new THREE.SphereGeometry(0.58, 36, 24), red, [0.56, 1.8, 0], [0, 0, -0.12], [1.25, 0.52, 0.58]);
  makeMesh(new THREE.SphereGeometry(0.44, 26, 18), deepRed, [0.34, 1.72, 0.015], [0, 0, 0], [1.22, 0.38, 0.48]);
  makeMesh(new THREE.SphereGeometry(0.22, 26, 16), glass, [1.82, 1.83, 0], [0, 0, 0], [1.25, 0.72, 0.58]);
  makeMesh(new THREE.BoxGeometry(0.22, 0.06, 0.82), black, [1.88, 2.2, 0], [0, 0, 0.08]);
  makeMesh(new THREE.BoxGeometry(0.32, 0.04, 0.1), black, [2.2, 2.22, 0.42], [0, 0, -0.12]);
  makeMesh(new THREE.BoxGeometry(0.32, 0.04, 0.1), black, [1.55, 2.24, -0.42], [0, 0, 0.12]);
  cylinderBetween([-1.1, 0.98, -0.26], [0.63, 0.82, -0.36], 0.07, metal);
  makeMesh(new THREE.CylinderGeometry(0.11, 0.12, 0.48, 22), black, [0.86, 0.82, -0.39], [Math.PI / 2, 0, Math.PI / 2]);
  cylinderBetween([-1.82, 1.44, 0], [-1.95, 2.05, 0], 0.026, metal);
  cylinderBetween([-1.2, 2.08, 0], [-1.88, 1.82, 0], 0.045, black);
  makeMesh(new THREE.BoxGeometry(0.16, 0.32, 0.28), darkMetal, [1.46, 1.98, 0], [0, 0, -0.1]);

  const boltShape = new THREE.Shape();
  boltShape.moveTo(0.0, 0.32);
  boltShape.lineTo(0.2, 0.03);
  boltShape.lineTo(0.06, 0.03);
  boltShape.lineTo(0.18, -0.32);
  boltShape.lineTo(-0.18, -0.02);
  boltShape.lineTo(-0.03, -0.02);
  boltShape.lineTo(-0.16, 0.32);
  boltShape.lineTo(0.0, 0.32);
  const boltGeometry = new THREE.ExtrudeGeometry(boltShape, {
    depth: 0.02,
    bevelEnabled: false,
  });
  makeMesh(boltGeometry, red, [-0.52, 1.26, 0.235], [0, 0, -0.1], [0.72, 0.72, 0.72]);

  const platform = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 4),
    new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.78,
      metalness: 0.12,
      transparent: true,
      opacity: 0.78,
    }),
  );
  platform.rotation.x = -Math.PI / 2;
  platform.position.y = 0.08;
  platform.position.z = 0;
  scene.add(platform);

  const grid = new THREE.GridHelper(9, 18, 0x3a3d45, 0x20232a);
  grid.position.y = 0.09;
  scene.add(grid);

  const ambient = new THREE.AmbientLight(0xffffff, 0.82);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(3.5, 5, 4);
  scene.add(key);

  const redLight = new THREE.PointLight(0xd30d1f, 7.5, 9);
  redLight.position.set(-2.8, 2.8, 2.6);
  scene.add(redLight);

  const whiteLight = new THREE.PointLight(0xffffff, 3.2, 7);
  whiteLight.position.set(2.8, 2.6, 1.7);
  scene.add(whiteLight);

  let dragging = false;
  let lastX = 0;
  let userRotation = viewRotationTarget;

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - lastX;
    userRotation += delta * 0.009;
    viewRotationTarget = userRotation;
    lastX = event.clientX;
  });

  canvas.addEventListener("pointerup", (event) => {
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerleave", () => {
    dragging = false;
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();
    bike.rotation.y += (viewRotationTarget - bike.rotation.y) * 0.055;
    bike.rotation.x += (viewHeightTarget - bike.rotation.x) * 0.045;
    bike.position.y = Math.sin(elapsed * 1.35) * 0.025;

    wheelGroups.forEach((wheel, index) => {
      wheel.rotation.z -= 0.02 + index * 0.002;
    });

    redLight.position.x = Math.sin(elapsed * 0.9) * 3;
    redLight.position.z = Math.cos(elapsed * 0.9) * 2.8;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

initCalculator();
initBookingModal();
initPrototype();
