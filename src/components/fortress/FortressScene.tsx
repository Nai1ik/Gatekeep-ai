'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FortressSceneProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

export function FortressScene({ containerRef }: FortressSceneProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const progressRef = useRef(0);
    const sceneDataRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        trafficLight: THREE.Group;
        redLens: THREE.Mesh;
        amberLens: THREE.Mesh;
        greenLens: THREE.Mesh;
        redGlow: THREE.PointLight;
        amberGlow: THREE.PointLight;
        greenGlow: THREE.PointLight;
        blueprintLines: THREE.Line[];
        particles: THREE.Points;
        particlePositions: Float32Array;
        particleTargetsGlobe: Float32Array;
        particleTargetsExplode: Float32Array;
        globe: THREE.LineSegments;
        checkmark: THREE.Line;
        gridFloor: THREE.GridHelper;
        gridBg: THREE.GridHelper;
    } | null>(null);

    const initScene = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const W = window.innerWidth;
        const H = window.innerHeight;

        // ===== RENDERER =====
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // ===== SCENE =====
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.008);

        // ===== CAMERA =====
        const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
        camera.position.set(0, 0, 2); // Start VERY close to red lens

        // ===== AMBIENT =====
        const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
        scene.add(ambientLight);

        // ===== 3D GRID FLOOR =====
        const gridFloor = new THREE.GridHelper(200, 100, 0x06b6d4, 0x0a2a33);
        gridFloor.position.y = -8;
        gridFloor.material.opacity = 0.2;
        (gridFloor.material as THREE.Material).transparent = true;
        scene.add(gridFloor);

        // ===== 3D GRID BACKGROUND =====
        const gridBg = new THREE.GridHelper(200, 80, 0x06b6d4, 0x051515);
        gridBg.rotation.x = Math.PI / 2;
        gridBg.position.z = -40;
        gridBg.material.opacity = 0.1;
        (gridBg.material as THREE.Material).transparent = true;
        scene.add(gridBg);

        // ===== TRAFFIC LIGHT =====
        const trafficLight = new THREE.Group();

        // Housing
        const housingGeom = new THREE.BoxGeometry(1.2, 3.5, 0.8);
        const housingMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.3,
        });
        const housing = new THREE.Mesh(housingGeom, housingMat);
        trafficLight.add(housing);

        // Visor hoods
        const visorGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 16, 1, true, Math.PI, Math.PI);
        const visorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.1 });
        [1.0, 0, -1.0].forEach(y => {
            const visor = new THREE.Mesh(visorGeom, visorMat);
            visor.position.set(0, y, 0.45);
            visor.rotation.x = -Math.PI / 2;
            trafficLight.add(visor);
        });

        // Lens helper
        function createLens(color: number, y: number): { mesh: THREE.Mesh; glow: THREE.PointLight } {
            const geom = new THREE.SphereGeometry(0.35, 32, 32);
            const mat = new THREE.MeshPhysicalMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0,
                metalness: 0.1,
                roughness: 0.15,
                transmission: 0.3,
                thickness: 0.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                ior: 1.5,
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(0, y, 0.3);
            trafficLight.add(mesh);

            const glow = new THREE.PointLight(color, 0, 10);
            glow.position.set(0, y, 1.5);
            trafficLight.add(glow);

            return { mesh, glow };
        }

        const red = createLens(0xff0000, 1.0);
        const amber = createLens(0xffbf00, 0);
        const green = createLens(0x00f2ff, -1.0);

        // Pole
        const poleGeom = new THREE.CylinderGeometry(0.08, 0.08, 5, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });
        const pole = new THREE.Mesh(poleGeom, poleMat);
        pole.position.set(0, -4.3, 0);
        trafficLight.add(pole);

        scene.add(trafficLight);

        // ===== BLUEPRINT LINES =====
        const blueprintLines: THREE.Line[] = [];
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0 });

        // Wing shapes
        const wingPaths = [
            // Left wing
            [new THREE.Vector3(-0.8, 0, 0.4), new THREE.Vector3(-3, 0.5, 0), new THREE.Vector3(-5, 0.3, -1), new THREE.Vector3(-6, 0, -2)],
            // Right wing
            [new THREE.Vector3(0.8, 0, 0.4), new THREE.Vector3(3, 0.5, 0), new THREE.Vector3(5, 0.3, -1), new THREE.Vector3(6, 0, -2)],
            // Fuselage top line
            [new THREE.Vector3(0, 1.8, 0.4), new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(0, 3, -1), new THREE.Vector3(0, 3.2, -3)],
            // Fuselage bottom line
            [new THREE.Vector3(0, -1.8, 0.4), new THREE.Vector3(0, -2.5, 0), new THREE.Vector3(0, -3, -1), new THREE.Vector3(0, -3.2, -3)],
            // Jet engine left
            [new THREE.Vector3(-1.5, -0.5, 0), new THREE.Vector3(-2, -0.8, -2), new THREE.Vector3(-1.8, -0.5, -4)],
            // Jet engine right
            [new THREE.Vector3(1.5, -0.5, 0), new THREE.Vector3(2, -0.8, -2), new THREE.Vector3(1.8, -0.5, -4)],
            // Cross-braces
            [new THREE.Vector3(-3, 0.5, 0), new THREE.Vector3(3, 0.5, 0)],
            [new THREE.Vector3(-5, 0.3, -1), new THREE.Vector3(5, 0.3, -1)],
        ];

        wingPaths.forEach(points => {
            const curve = new THREE.CatmullRomCurve3(points);
            const lineGeom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
            const line = new THREE.Line(lineGeom, lineMat.clone());
            line.visible = false;
            scene.add(line);
            blueprintLines.push(line);
        });

        // ===== PARTICLES =====
        const PARTICLE_COUNT = 2000;
        const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
        const particleTargetsGlobe = new Float32Array(PARTICLE_COUNT * 3);
        const particleTargetsExplode = new Float32Array(PARTICLE_COUNT * 3);
        const particleColors = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            // Start at traffic light position
            particlePositions[i3] = (Math.random() - 0.5) * 2;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 4;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 2;

            // Explode targets - random sphere burst
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const explodeR = 8 + Math.random() * 12;
            particleTargetsExplode[i3] = explodeR * Math.sin(phi) * Math.cos(theta);
            particleTargetsExplode[i3 + 1] = explodeR * Math.sin(phi) * Math.sin(theta);
            particleTargetsExplode[i3 + 2] = explodeR * Math.cos(phi);

            // Globe targets - sphere surface
            const globeR = 4;
            const gTheta = Math.random() * Math.PI * 2;
            const gPhi = Math.acos(Math.random() * 2 - 1);
            particleTargetsGlobe[i3] = globeR * Math.sin(gPhi) * Math.cos(gTheta);
            particleTargetsGlobe[i3 + 1] = globeR * Math.sin(gPhi) * Math.sin(gTheta);
            particleTargetsGlobe[i3 + 2] = globeR * Math.cos(gPhi);

            // Colors (cyan to blue)
            particleColors[i3] = 0;
            particleColors[i3 + 1] = 0.6 + Math.random() * 0.4;
            particleColors[i3 + 2] = 0.8 + Math.random() * 0.2;
        }

        const particleGeom = new THREE.BufferGeometry();
        particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions.slice(), 3));
        particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(particleGeom, particleMat);
        particles.visible = false;
        scene.add(particles);

        // ===== WIREFRAME GLOBE =====
        const globeGeom = new THREE.IcosahedronGeometry(4, 3);
        const globeMat = new THREE.MeshBasicMaterial({
            color: 0x00f2ff,
            wireframe: true,
            transparent: true,
            opacity: 0,
        });
        const globe = new THREE.LineSegments(
            new THREE.WireframeGeometry(globeGeom),
            new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0 })
        );
        globe.visible = false;
        scene.add(globe);

        // ===== CHECKMARK =====
        const checkPoints = [
            new THREE.Vector3(-1.5, 0, 0),
            new THREE.Vector3(-0.5, -1.2, 0),
            new THREE.Vector3(2, 1.5, 0),
        ];
        const checkGeom = new THREE.BufferGeometry().setFromPoints(checkPoints);
        const checkMat = new THREE.LineBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0,
            linewidth: 2,
        });
        const checkmark = new THREE.Line(checkGeom, checkMat);
        checkmark.visible = false;
        scene.add(checkmark);

        sceneDataRef.current = {
            scene, camera, renderer,
            trafficLight,
            redLens: red.mesh, amberLens: amber.mesh, greenLens: green.mesh,
            redGlow: red.glow, amberGlow: amber.glow, greenGlow: green.glow,
            blueprintLines,
            particles, particlePositions, particleTargetsGlobe, particleTargetsExplode,
            globe, checkmark,
            gridFloor, gridBg,
        };
    }, []);

    const updateScene = useCallback((progress: number, time: number) => {
        const data = sceneDataRef.current;
        if (!data) return;

        const { camera, trafficLight, redLens, amberLens, greenLens,
            redGlow, amberGlow, greenGlow, blueprintLines,
            particles, particlePositions, particleTargetsGlobe, particleTargetsExplode,
            globe, checkmark, gridFloor } = data;

        const mx = mouseRef.current.x * 0.3;
        const my = mouseRef.current.y * 0.15;

        // Grid parallax
        gridFloor.position.x = mx * 2;

        // ===== PHASE 1: RED ALERT (0-25%) =====
        if (progress < 0.25) {
            const p = progress / 0.25; // 0→1 within this phase

            // Camera: start very close, pull back
            camera.position.set(mx * 0.1, my * 0.1 + 0.8, 2 + p * 4);
            camera.lookAt(0, 0.8, 0);

            // Red lens ON, pulsing
            const pulse = Math.sin(time * 4) * 0.3 + 0.7;
            (redLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = pulse * 2;
            redGlow.intensity = pulse * 5;

            // Amber & Green OFF
            (amberLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            amberGlow.intensity = 0;
            (greenLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            greenGlow.intensity = 0;

            // Traffic light visible, centered
            trafficLight.visible = true;
            trafficLight.position.set(0, 0, 0);
            trafficLight.rotation.set(0, 0, 0);

            // Hide others
            blueprintLines.forEach(l => { l.visible = false; });
            particles.visible = false;
            globe.visible = false;
            checkmark.visible = false;
        }

        // ===== PHASE 2: AMBER PIVOT (25-50%) =====
        else if (progress < 0.5) {
            const p = (progress - 0.25) / 0.25;

            // Camera pulls back more
            camera.position.set(mx * 0.5, my * 0.3, 6 + p * 6);
            camera.lookAt(0, 0, -p * 2);

            // Red OFF with flicker
            const flicker = p < 0.1 ? Math.random() : 0;
            (redLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = flicker;
            redGlow.intensity = flicker * 3;

            // Amber ON
            const amberPulse = Math.sin(time * 3) * 0.2 + 0.8;
            (amberLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = amberPulse * 1.5;
            amberGlow.intensity = amberPulse * 4;

            // Green still off
            (greenLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            greenGlow.intensity = 0;

            trafficLight.visible = true;
            trafficLight.position.set(0, 0, 0);

            // Blueprint lines draw in
            blueprintLines.forEach((line, i) => {
                line.visible = true;
                const lineProgress = Math.max(0, Math.min(1, (p - i * 0.08) * 2));
                (line.material as THREE.LineBasicMaterial).opacity = lineProgress * 0.8;

                // Pulse effect
                const pulseBright = Math.sin(time * 5 + i) * 0.2 + 0.8;
                (line.material as THREE.LineBasicMaterial).opacity *= pulseBright;

                // Draw effect via dash
                const geom = line.geometry;
                const totalLength = geom.attributes.position.count;
                const drawCount = Math.floor(lineProgress * totalLength);
                geom.setDrawRange(0, drawCount);
            });

            particles.visible = false;
            globe.visible = false;
            checkmark.visible = false;
        }

        // ===== PHASE 3: SENTINEL TAKEOFF (50-75%) =====
        else if (progress < 0.75) {
            const p = (progress - 0.5) / 0.25;

            // Camera tracking — "flies" away
            camera.position.set(
                mx * 0.5 + Math.sin(p * 0.5) * 3,
                my * 0.3 + 2 + p * 3,
                12 + p * 20
            );
            camera.lookAt(0, p * 5, -p * 30);

            // Red & Amber off
            (redLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            redGlow.intensity = 0;
            (amberLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            amberGlow.intensity = 0;

            // Green beacon ON
            const greenPulse = Math.sin(time * 2) * 0.3 + 0.7;
            (greenLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = greenPulse * 2;
            greenGlow.intensity = greenPulse * 6;
            greenGlow.color.setHex(0x00f2ff);

            // Traffic light banks 45° and flies forward
            trafficLight.visible = true;
            trafficLight.position.set(
                Math.sin(p * 1.5) * 2,
                p * 8,
                -p * 40
            );
            trafficLight.rotation.set(
                -p * 0.3,
                p * 0.5,
                p * Math.PI / 4 // 45° bank
            );

            // Blueprint lines fade and stretch (motion blur effect)
            blueprintLines.forEach((line, i) => {
                line.visible = true;
                (line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 0.6 - p * 0.8);
                line.position.z = -p * 40;
                line.rotation.z = p * Math.PI / 4;
            });

            // Warp speed - stretch grid
            gridFloor.scale.z = 1 + p * 5;

            particles.visible = false;
            globe.visible = false;
            checkmark.visible = false;
        }

        // ===== PHASE 4: FIREWALL HOLOGRAM (75-100%) =====
        else {
            const p = (progress - 0.75) / 0.25;

            // Camera settles into wide shot
            camera.position.set(mx * 1, my * 0.5 + 1, 14 - p * 2);
            camera.lookAt(0, 0, 0);

            // All traffic light lights off, hide it
            trafficLight.visible = p < 0.1;
            (redLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            (amberLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            (greenLens.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0;
            redGlow.intensity = 0;
            amberGlow.intensity = 0;
            greenGlow.intensity = 0;

            // Blueprint lines gone
            blueprintLines.forEach(l => {
                l.visible = false;
            });

            // Reset grid stretch
            gridFloor.scale.z = 1;

            // PARTICLES — explode then reform into globe
            particles.visible = true;
            (particles.material as THREE.PointsMaterial).opacity = Math.min(1, p * 3);

            const positions = particles.geometry.attributes.position.array as Float32Array;
            const PARTICLE_COUNT = particlePositions.length / 3;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;

                if (p < 0.4) {
                    // Explode outward
                    const ep = p / 0.4;
                    positions[i3] = particlePositions[i3] + (particleTargetsExplode[i3] - particlePositions[i3]) * ep;
                    positions[i3 + 1] = particlePositions[i3 + 1] + (particleTargetsExplode[i3 + 1] - particlePositions[i3 + 1]) * ep;
                    positions[i3 + 2] = particlePositions[i3 + 2] + (particleTargetsExplode[i3 + 2] - particlePositions[i3 + 2]) * ep;
                } else {
                    // Reform into globe
                    const gp = (p - 0.4) / 0.6;
                    const smoothGp = gp * gp * (3 - 2 * gp); // smoothstep
                    positions[i3] = particleTargetsExplode[i3] + (particleTargetsGlobe[i3] - particleTargetsExplode[i3]) * smoothGp;
                    positions[i3 + 1] = particleTargetsExplode[i3 + 1] + (particleTargetsGlobe[i3 + 1] - particleTargetsExplode[i3 + 1]) * smoothGp;
                    positions[i3 + 2] = particleTargetsExplode[i3 + 2] + (particleTargetsGlobe[i3 + 2] - particleTargetsExplode[i3 + 2]) * smoothGp;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y = time * 0.2;

            // Globe wireframe fades in
            globe.visible = p > 0.5;
            (globe.material as THREE.LineBasicMaterial).opacity = Math.max(0, (p - 0.5) * 2) * 0.3;
            globe.rotation.y = time * 0.15;

            // Checkmark inside globe
            checkmark.visible = p > 0.7;
            (checkmark.material as THREE.LineBasicMaterial).opacity = Math.max(0, (p - 0.7) / 0.3);
            checkmark.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
        }
    }, []);

    useEffect(() => {
        initScene();

        const data = sceneDataRef.current;
        if (!data) return;

        // Mouse parallax
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // ScrollTrigger
        if (containerRef.current) {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
                onUpdate: (self) => {
                    progressRef.current = self.progress;
                },
            });
        }

        // Animation loop
        let animFrame: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animFrame = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            updateScene(progressRef.current, time);
            data.renderer.render(data.scene, data.camera);
        };
        animate();

        // Resize
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            data.camera.aspect = w / h;
            data.camera.updateProjectionMatrix();
            data.renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(t => t.kill());
            data.renderer.dispose();
        };
    }, [initScene, updateScene, containerRef]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-0"
            style={{ pointerEvents: 'none' }}
        />
    );
}
