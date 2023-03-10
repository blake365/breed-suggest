import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	render() {
		return (
			<Html lang='en'>
				<Head>
					<link rel='icon' href='/favicon.ico' />
					<meta name='description' content='Dog breeds that suit your needs.' />
					<meta property='og:site_name' content='Breed Suggester' />
					<meta
						property='og:description'
						content='Dog breeds that suit your needs.'
					/>
					<meta property='og:title' content='Dog Breed Recommendations' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
