import React from 'react'
import Turtle from '../lib'

const App = () => (
	<div>
		<Turtle
			style={{
				height: 400,
				width: 400,
			}}
			height={400}
			width={400}
			draw={(turtle) => {
				turtle.forward(100).stroke()
			}}
		/>
	</div>
)

export default App
