import { Switch } from '@headlessui/react'
import { useState } from 'react'

type Props = {
	title: string
	true: string
	false: string
	handleSwitchChange: Function
	switchState: boolean
}

const SwitchControl = (props: Props) => {
	const handleChange = (event: any) => {
		props.handleSwitchChange(!props.switchState)
	}

	return (
		<div className='p-2 mx-2'>
			<div className='text-xl font-bold'>{props.title}</div>
			<div className='py-2'>
				<span className='h-[28px] text-xl pr-2'>{props.true}</span>
				<Switch
					checked={props.switchState}
					onChange={handleChange}
					className={`${props.switchState ? 'bg-orange-900' : 'bg-orange-700'}
          relative inline-flex h-[28px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
				>
					<span className='sr-only'>Use setting</span>
					<span
						aria-hidden='true'
						className={`${props.switchState ? 'translate-x-7' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
					/>
				</Switch>
				<span className='h-[28px] text-xl pl-2'>{props.false}</span>
			</div>
		</div>
	)
}

export default SwitchControl
