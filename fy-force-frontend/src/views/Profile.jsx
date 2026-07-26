import '../style/Profile.css'
import account from '../assets/account.jpeg'
import { useEffect, useRef, useState } from 'react'
import { items, artifact } from '../variable/profile'
import { animate, createScope, cubicBezier } from 'animejs'

export default function Profile() {

	const [ xp, setXp ] = useState(1000)

	const scope = useRef(null)
	const root = useRef(null)

	const lessons = [
		{
			title: "lessons 1",
		}
	]

	useEffect(() => {
		if(root.current) {
			scope.current = createScope({ root }).add(self => {

				animate('.profile-container-item-button', {
					x: '10rem',
					duration: 0
				})

				animate('.profile-container-item-button-artifact', {
					x: '-10rem',
					duration: 0
				})

				animate('.profile-container-item-button', {
					y: '0.5rem',
					alternate: true,
					duration: 1000,
					loop: true,
					ease: cubicBezier(0.7, 0.1,0.5,0.9)
				})

				animate('.profile-container-item-button-artifact', {
					y: '0.5rem',
					alternate: true,
					duration: 1000,
					loop: true,
					ease: cubicBezier(0.7, 0.1,0.5,0.9),
					delay: 500
				})

				animate('.profile-xp-bar-fill', {
					width: '50%',
					duration: 1000,
					ease: 'outExpo',
					delay: 500,
				})

			})
		}
	}, [])

	return <div className="profile" ref={root}>
		<div className='profile-container'>
			<div className='profile-container-account'>
				<div className='profile-container-account-image'>
					<div className='profile-container-account-image-img'>
						<img src={account} alt='account'/>
					</div>
				</div>

				<div className='profile-container-item-button'>
					{items.svg}
				</div>

				<div className='profile-container-item-button-artifact'>
					{artifact.svg}
				</div>

				<div className='profile-container-item-name'>
					<span className='name'>Fy</span><br/>
					<span className='firstname'>Hasin'ala</span>
				</div>

				<div className='profile-container-xp'>
					<div className='profile-container-prev'>
						Lv. 0
					</div>
					<div className='profile-xp-bar'>
						<div className='profile-xp-bar-void'>
							<div className='profile-xp-bar-fill'></div>
						</div>
					</div>
					<div className='profile-container-next'>
						Lv. 1
					</div>
				</div>

				<div className='profile-container-stats'>
					<div className='profile-container-stats-match'>
						<span className='title'>Match</span><br/>
						<span className='count'>1</span>
					</div>
					<div className='profile-container-stats-victory'>
						<span className='title'>Victory</span><br/>
						<span className='count'>1</span>
					</div>
					<div className='profile-container-stats-defaite'>
						<span className='title'>Defeat</span><br/>
						<span className='count'>0</span>
					</div>
				</div>
			</div>
			<div className='profile-container-hall'>
				
			</div>
		</div>
	</div>
}