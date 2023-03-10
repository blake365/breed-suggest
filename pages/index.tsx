import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRef, useState } from 'react'
import { red, orange, brown, grey, yellow } from '@mui/material/colors'
import Footer from '../components/Footer'
import Header from '../components/Header'
import LoadingDots from '../components/LoadingDots'
import {
	Slider,
	Radio,
	FormControl,
	RadioGroup,
	FormControlLabel,
	ToggleButton,
	ToggleButtonGroup,
	Checkbox,
} from '@mui/material'

const sizeLevels = [
	{
		value: 1,
		label: 'Toy',
	},
	{
		value: 33,
		label: 'Small',
	},
	{
		value: 66,
		label: 'Medium',
	},
	{
		value: 100,
		label: 'Large',
	},
]
const energyLevels = [
	{
		value: 1,
		label: 'Low',
	},
	{
		value: 50,
		label: 'Medium',
	},
	{
		value: 100,
		label: 'High',
	},
]
const intelligenceLevels = [
	{
		value: 1,
		label: 'Low',
	},
	{
		value: 50,
		label: 'Medium',
	},
	{
		value: 100,
		label: 'High',
	},
]

const Home: NextPage = () => {
	const [loading, setLoading] = useState(false)
	const [generatedResults, setGeneratedResults] = useState<String>('')
	const [energy, setEnergy] = useState(50)
	const [intelligence, setIntelligence] = useState(50)
	const [size, setSize] = useState(33)
	const [color, setColor] = useState('none')
	const [personality, setPersonality] = useState('Independent')
	const [shed, setShed] = useState(false)
	const [hypo, setHypo] = useState(false)

	const handlePersonalityChange = (
		event: React.MouseEvent<HTMLElement>,
		newPersonality: string
	) => {
		setPersonality(newPersonality)
	}

	const handleShedChange = () => {
		setShed((prevState) => !prevState)
	}

	const handleHypoChange = () => {
		// console.log('hypo')
		setHypo(!hypo)
	}

	const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setColor((event.target as HTMLInputElement).value)
	}

	const bioRef = useRef<null | HTMLDivElement>(null)

	const scrollToBios = () => {
		if (bioRef.current !== null) {
			bioRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}

	const parseState = (
		energy: number,
		intelligence: number,
		size: number,
		personality: string,
		shed: boolean,
		hypo: boolean,
		color: string
	) => {
		let string = ''
		if (energy === 1) {
			string += 'low energy level, '
		} else if (energy === 50) {
			string += 'moderate energy level, '
		} else if (energy === 100) {
			string += 'high energy level, '
		}

		if (intelligence === 1) {
			string += 'low intelligence level, '
		} else if (intelligence === 50) {
			string += 'moderate intelligence level, '
		} else if (intelligence === 100) {
			string += 'high intelligence level, '
		}
		if (size === 1) {
			string += 'toy sized, '
		} else if (size === 33) {
			string += 'small size, '
		} else if (size === 66) {
			string += 'medium size, '
		} else if (size === 100) {
			string += 'large size, '
		}

		if (personality) {
			string += `an ${personality} personality, `
		}

		if (shed) {
			string += 'does not shed, '
		}

		if (hypo) {
			string += 'is hypoallergenic, '
		}

		if (color !== 'none') {
			string += `and has a primary fur color of ${color}`
		}

		// string +=
		// 	'. If there is not a good match for a dog breed with the listed qualities, suggest that the user adopt a dog from the local rescue or humane society.'

		console.log(string)
		return string
	}

	// console.log(
	// 	parseState(energy, intelligence, size, personality, shed, hypo, color)
	// )
	const generateBio = async (e: any) => {
		let prompt = `Suggest 3 dog breeds clearly labeled "1." and "2." and "3.". Format the response with like this: 1. {Breed Name}: {description}. Replace the text in brackets with the generated response. Write a concise description of the breed to sell the benefits. The dog breed should have the following qualities: `
		e.preventDefault()
		setGeneratedResults('')
		setLoading(true)

		let traits = parseState(
			energy,
			intelligence,
			size,
			personality,
			shed,
			hypo,
			color
		)

		prompt = prompt + traits
		const response = await fetch('/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				prompt,
			}),
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		// This data is a ReadableStream
		const data = response.body
		if (!data) {
			return
		}

		const reader = data.getReader()
		const decoder = new TextDecoder()
		let done = false

		while (!done) {
			const { value, done: doneReading } = await reader.read()
			done = doneReading
			const chunkValue = decoder.decode(value)
			setGeneratedResults((prev) => prev + chunkValue)
		}
		scrollToBios()
		setLoading(false)
	}

	return (
		<div className='flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto'>
			<Head>
				<title>Dog Breed Suggester</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Header />
			<main className='flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20'>
				<h1 className='sm:text-6xl text-3xl max-w-[708px] font-bold text-slate-900'>
					Dog breed suggestions based on the traits you desire.
				</h1>
				<div className='w-48 pt-4'>
					<span className='text-xl font-bold'>Size</span>
					<Slider
						onChange={(_, value) => setSize(value as number)}
						aria-label='Restricted values'
						defaultValue={33}
						step={null}
						marks={sizeLevels}
						color='primary'
					/>
					<span className='text-xl font-bold'>Energy Level</span>
					<Slider
						onChange={(_, value) => setEnergy(value as number)}
						aria-label='Restricted values'
						defaultValue={50}
						step={null}
						marks={energyLevels}
						color='primary'
					/>
					<span className='text-xl font-bold'>Intelligence Level</span>
					<Slider
						onChange={(_, value) => setIntelligence(value as number)}
						aria-label='Restricted values'
						defaultValue={50}
						step={null}
						marks={intelligenceLevels}
						color='primary'
					/>
				</div>
				<div className='flex flex-col pt-4'>
					<span className='text-xl font-bold'>Personality</span>
					<ToggleButtonGroup
						value={personality}
						exclusive
						onChange={handlePersonalityChange}
						aria-label='text alignment'
					>
						<ToggleButton value='Independent' aria-label='Independent'>
							Independent
						</ToggleButton>
						<ToggleButton value='Affectionate' aria-label='Affectionate'>
							Affectionate
						</ToggleButton>
					</ToggleButtonGroup>

					<div className='flex flex-col pt-4'>
						<span className='text-xl font-bold'>Doesn't Shed</span>
						<Checkbox
							checked={shed}
							onClick={handleShedChange}
							inputProps={{ 'aria-label': 'shed', id: 'shed-checkbox' }}
						/>
					</div>
					<div className='flex flex-col pt-4'>
						<span className='text-xl font-bold'>Is Hypoallergenic</span>
						<Checkbox
							checked={hypo}
							onClick={handleHypoChange}
							inputProps={{ 'aria-label': 'hypo', id: 'hypo-checkbox' }}
						/>
					</div>
				</div>

				<div>
					<FormControl>
						<span className='text-xl font-bold'>Fur Color</span>
						<RadioGroup
							row
							aria-labelledby='color-labels'
							defaultValue='none'
							name='radio-buttons-group'
							value={color}
							onChange={handleColorChange}
						>
							<FormControlLabel
								value='none'
								control={<Radio color='default' />}
								label='None'
							/>
							<FormControlLabel
								value='white'
								control={
									<Radio
										sx={{
											color: grey[100],
											'&.Mui-checked': {
												color: grey[200],
											},
										}}
									/>
								}
								label='White'
							/>
							<FormControlLabel
								value='black'
								control={
									<Radio
										sx={{
											color: grey[900],
											'&.Mui-checked': {
												color: grey[900],
											},
										}}
									/>
								}
								label='Black'
							/>
							<FormControlLabel
								value='brown'
								control={
									<Radio
										sx={{
											color: brown[800],
											'&.Mui-checked': {
												color: brown[600],
											},
										}}
									/>
								}
								label='Brown'
							/>
							<FormControlLabel
								value='red'
								control={
									<Radio
										sx={{
											color: red[800],
											'&.Mui-checked': {
												color: red[600],
											},
										}}
									/>
								}
								label='Red'
							/>
							<FormControlLabel
								value='yellow'
								control={
									<Radio
										sx={{
											color: yellow[700],
											'&.Mui-checked': {
												color: yellow[600],
											},
										}}
									/>
								}
								label='Yellow'
							/>
						</RadioGroup>
					</FormControl>
				</div>
				<div>
					{!loading && (
						<button
							className='w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80'
							onClick={(e) => generateBio(e)}
						>
							Get Suggestions &rarr;
						</button>
					)}
					{loading && (
						<button
							className='w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80'
							disabled
						>
							<LoadingDots color='white' style='large' />
						</button>
					)}
				</div>
				<hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
				<div className='my-10 space-y-10'>
					{generatedResults && (
						<>
							<div>
								<h2
									className='mx-auto text-3xl font-bold sm:text-4xl text-slate-900'
									ref={bioRef}
								>
									Your Breed Suggestions
								</h2>
							</div>
							<div className='flex flex-col items-center justify-center max-w-xl mx-auto space-y-8'>
								{generatedResults.split('\n').map((generatedBio) => {
									let breed = generatedBio.split(':')[0].split('.')[1]
									let link = ''
									if (breed) {
										link = breed.replace(/^\s+/, '').replace(/\s+/g, '-')
									}

									let description = generatedBio.split(':')[1]
									if (generatedBio) {
										return (
											<div
												className='p-4 transition bg-white border shadow-md rounded-xl hover:bg-gray-100'
												key={generatedBio}
											>
												<p className='text-md'>
													<span className='text-lg font-bold'>{breed}:</span>
													{description}
												</p>
												{link && (
													<Link
														target='_blank'
														href={`https://www.akc.org/dog-breeds/${link}/`}
														className='text-blue-500 underline'
													>
														Learn More
													</Link>
												)}
											</div>
										)
									}
								})}
							</div>
						</>
					)}
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default Home
