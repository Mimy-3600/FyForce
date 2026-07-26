import DotField from '@/reactbits/DotField';
import '../style/MatchMaking.css'
import { useEffect, useRef, useState } from 'react';
import SpotlightCard from '../reactbits/SpotlightCard';
import { animate, createScope, stagger } from 'animejs';
import account from '../assets/account.webp'

function MatchMaking() {
	const [ Artifacts, setArtifatcs] = useState([])
	const root = useRef(null)
	const scope = useRef(null)
	const [ url, setUrl ] = useState("")

	useEffect(() => {
		setArtifatcs([
			{
				codeArtifact: 'ARTIFACTS 001',
				stats: 120,
			},
			{
				codeArtifact: 'ARTIFACTS 001',
				stats: 120,
			},
			{
				codeArtifact: 'ARTIFACTS 001',
				stats: 120,
			},
			{
				codeArtifact: 'ARTIFACTS 001',
				stats: 120,
			},
			{
				codeArtifact: 'ARTIFACTS 001',
				stats: 120,
			}
		])

		setUrl(account)

		if(!root.current) return

		const scope = createScope({ root }).add(self => {
			animate('.floating', {
				y: 30,
				duration: 1500,
				alternate: true,
				loop: true,
				ease: 'inOut(2.38)',
				delay: stagger(300)
			})
		})
	}, [])
	return <div className='match-making' ref={root}>
		<div className='match-making-container'>
			<div className='match-making-container-artifact'>
				<div className='match-making-container-artifact-in'>
					<DotField
					    dotRadius={1.5}
					    dotSpacing={40}
					    bulgeStrength={16}
					    glowRadius={50}
					    sparkle={false}
					    waveAmplitude={0}
					    cursorRadius={500}
					    cursorForce={0.01}
					    bulgeOnly
					    gradientFrom="#e2ffda"
					    gradientTo="#B497CF"
					    glowColor="#120F17"
					/>
				</div>
				<div className='match-making-container-artifact-list'>Artifacts : 
					<div className='match-making-container-artifact-list-i'>
						{Artifacts.map((el, i) => {
							return <SpotlightCard key={i} className="custom-spotlight-card" spotlightColor="#fff2">
								<div className='match-making-container-artifact-item'>
									<div className='match-making-container-artifact-item-code'>{el.codeArtifact}</div>
									<div className='match-making-container-artifact-item-stats'>{el.stats > 0 ? '+' + el.stats : el.stats}</div>
								</div>
							</SpotlightCard>
						})}
					</div>
				</div>
			</div>
			<div className='match-making-container-find'>
				
				<div className='match-making-container-find-account me'>
					<div className='match-making-container-find-side floating'>
						<div className='match-making-container-find-side-picture'>
							<img src={url} alt='' 
								style={{
									width: 160,
									height: 160,
									borderRadius: '50%'
								}}
							/>
						</div>
					</div>
					<div className='platform'></div>
				</div>
				<div className='match-making-container-find-vs'>
					<div className='vs floating'>VS</div>
					<div className='platform'></div>
				</div>
				<div className='match-making-container-find-account other'>
					<div className='match-making-container-find-side floating'>
						<div className='match-making-container-find-side-picture'>
							<img src={account} alt='' 
								style={{
									width: 160,
									height: 160,
									borderRadius: '50%'
								}}
							/>
						</div>
					</div>
					<div className='platform'></div>
				</div>

			</div>
		</div>
	</div>
}

export default MatchMaking;