import '../style/Home.css'
import { Model as Artifact } from '../../Artifact.jsx'
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { animate, createScope } from 'animejs'
import TargetCursor from '../reactbits/TargetCursor';
import { useNavigate } from 'react-router-dom';

function Home() {

	const navigate = useNavigate()
	const scope = useRef(null)
	const root = useRef(null)

	const [ actual, setActual ] = useState(0)

	const handleWheel = (e) => {
		if(e.deltaY > 0 && actual === 0) {
			const scrollDownEvent = new CustomEvent("scroll-down-event")
			window.dispatchEvent(scrollDownEvent)
		}
		if(e.deltaY < 0 && actual === 1) {
			const scrollUpEvent = new CustomEvent("scroll-up-event")
			window.dispatchEvent(scrollUpEvent)
		}
	}

	useEffect(() => {

		if(!root.current) return

		const scope = createScope({ root }).add(self => {
			animate('.home-container-3d-artifact', {
				duration: 2000,
				loop: true,
				alternate: true,
				y: -100,
  				ease: 'inOut(2.38)'
			})

			animate('.home-container-action-sign', {
				duration: 0,
				y: '100%',
				x: '230%',
			})
		})

		const scrollDown = () => {
			setActual(1)
			const scope = createScope({ root }).add(self => {
				animate('.home-container-3d-artifact', {
					duration: 1000,
					y: -500,
					x: -500,
					ease: 'inOut(2.38)'
				})

				animate('.home-container-info', {
					duration: 1000,
					background: 'transparent',
					y: '-100%',
					x: '-500px',
					ease: 'inOut(2.38)'
				})

				animate('.home-container-action-sign', {
					duration: 1000,
					y: '0',
					x: '130%',
					ease: 'inOut(2.38)'
				})
				
			})
		}

		const scrollUp = () => {
			setActual(0)
			const scope = createScope({ root }).add(self => {
				animate('.home-container-3d-artifact', {
					duration: 1000,
					y: -100,
					x: 0,
					ease: 'inOut(2.38)'
				})
				animate('.home-container-info', {
					duration: 1000,
					background: 'linear-gradient(90deg, #000000, transparent)',
					y: 0,
					x: 0,
					ease: 'inOut(2.38)'
				})
				animate('.home-container-action-sign', {
					duration: 1000,
					y: '100%',
					x: '230%',
					ease: 'inOut(2.38)'
				})
			})
		}

		window.addEventListener('scroll-down-event', scrollDown)
		window.addEventListener('scroll-up-event', scrollUp)

		return () => {
			window.removeEventListener('scroll-up-event', scrollUp)
			window.removeEventListener('scroll-down-event', scrollDown)
		}
	}, [])

	return <div className='main-container' ref={root} onWheel={handleWheel}>
		<div className='home-container'>

			<div className="home-container-info">
				<div className='home-container-name'>
					
					<div>Lampochka</div>

					<svg fill="#ffffff" height="50px" width="50px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" 
						 viewBox="0 0 32 32">
						<path d="M20,24h-8c-0.6,0-1,0.4-1,1s0.4,1,1,1h0.1c0.2,2,1.9,3.5,3.9,3.5s3.7-1.5,3.9-3.5H20c0.6,0,1-0.4,1-1S20.6,24,20,24z"/>
						<path d="M22,5.3c-1.9-1.7-4.5-2.5-7-2.2C11,3.5,7.7,6.7,7.1,10.6c-0.4,2.8,0.4,5.6,2.4,7.7c1,1,1.5,2.4,1.5,3.8c0,0.6,0.4,1,1,1h4
							c-0.4,0-0.8-0.3-0.9-0.7l-4-11c-0.2-0.4,0-0.9,0.3-1.1c0.4-0.3,0.8-0.3,1.2,0c2,1.5,4.8,1.5,6.8,0c0.4-0.3,1.1-0.2,1.4,0.2
							c0.3,0.4,0.2,1.1-0.2,1.4c-2,1.5-4.5,1.9-6.8,1.2l2.2,6.1l1.6-4.4c0.2-0.5,0.8-0.8,1.3-0.6c0.5,0.2,0.8,0.8,0.6,1.3l-2.5,7
							C16.8,22.7,16.4,23,16,23h4c0.6,0,1-0.4,1-1c0-1.4,0.5-2.8,1.5-3.7c1.6-1.7,2.5-3.9,2.5-6.3C25,9.4,23.9,7,22,5.3z"/>
					</svg>
				</div>
				<div className='home-container-slogan'>
					LEARN & CREATE<br/> & FIGHT<br/>
					<span className='linear-text'>ARTIFACT</span>
				</div>
				<div className='home-container-description'>
					The real problem was giving people a reason to revisit previous work.
					The greatest challenge was not starting or finishing, but ensuring that no effort ever faded into silence - for me or for others
				</div>
				<div className='home-container-action'>
				</div>
				<div style={{flex: 1}}></div>
				<div className='home-container-extra'></div>
			</div>

			<div className="home-container-action-sign">
				<div className='home-container-slogan'>
					START ? <br/> SIGN OR LOGIN<br/>
					<span className='linear-text'>Lampochka</span>
				</div>
				<div className='home-container-description'>
					Log in your account to start a new quest and challenge users ...	
				</div>

				<div>
		    		<TargetCursor 
				        spinDuration={2}
				        hideDefaultCursor
				        parallaxOn
					    hoverDuration={0.2}
					    cursorColor="#ffffff"
					    cursorColorOnTarget="#B497CF"
					/>
			      <button className="cursor-target Login" onClick={()=>navigate("/menu")}>Login</button>
			      <button className="cursor-target Register">Register</button>
			    </div>
			</div>
		</div>

		<div className='home-container-3d-artifact'>
			<Canvas>
		        <ambientLight intensity={1.5} />
		        <pointLight position={[-3, 2, 2]} intensity={20} color="#00d8ff" distance={10} />
		        <pointLight position={[3, -2, 2]} intensity={20} color="#bd00ff" distance={10} />
		        <pointLight position={[0, 0, -4]} intensity={15} color="#ffffff" distance={10} />
		        <Environment resolution={256}>
		          <group rotation={[0, 0, 0]}>
		            <Lightformer form="rect" intensity={4} color="#d946ef" position={[2, 2, 2]} scale={[5, 5, 1]} target={[0, 0, 0]} />
		            <Lightformer form="rect" intensity={3} color="#51BCFF" position={[-2, -1, 2]} scale={[5, 5, 1]} target={[0, 0, 0]} />
		          </group>
		        </Environment>

			      <Suspense fallback={null}>
			        <Artifact position={[0, 0, 0]} scale={1} />
			      </Suspense>

			      <OrbitControls />

			      <EffectComposer>
			        <Bloom 
			          intensity={1.2}             /* Force du halo lumineux */
			          luminanceThreshold={0.8}    /* Ne fait briller QUE les zones très sombres/claires (au-dessus de 80% de luminosité) */
			          luminanceSmoothing={0.2}    /* Transition douce pour l'effet shine */
			          mipmapBlur={true}           /* Rend le flou du halo très fluide */
			        />
			      </EffectComposer>
			    </Canvas>
		</div>
	</div>
}

export default Home;

