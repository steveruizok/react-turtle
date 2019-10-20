# React Turtle

**Imagine a turtle with a pen in its mouth, standing in the center of a page**.
You can tell the turtle to move forward or backward, turn left or right, and you
can tell the turtle to either put the pen down or lift the pen up.

Turtle Graphics for React. Made with 🎃 by
[steveruizok](http://twitter.com/steveruizok).

### [🐢 Demo!](https://codesandbox.io/s/focused-villani-u0prx)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

`npm install react-turtle`

or

`yarn add react-turtle`

## Usage

```jsx
import React from 'react'
import Turtle from 'react-turtle'

function App() {
	return <Turtle />
}
```

| Prop         | Type                  | Default   | Notes     |
| ------------ | --------------------- | --------- | --------- |
| `width`      | `number`              | `480`     |           |
| `height`     | `number`              | `320`     |           |
| `animated`   | `boolean`             | `true`    | Optional  |
| `pixelated`  | `boolean`             | `true`    | Optional  |
| `autostroke` | `boolean`             | `true`    | Optional  |
| `style`      | `React.CSSProperties` | `{}`      | Optional  |
| `draw`       | `function`            | See Below | See Below |

## Drawing

The component's `draw` prop accepts a function containing your commands to the
turtle. The function receives the turtle instance as its only argument.

In the body of the function, you can issue commands to the turtle, like this:

```jsx
import React from 'react'
import Turtle from 'react-turtle'

function App() {
	return (
		<Turtle
			draw={(turtle) => {
				turtle
					.forward(32)
					.right()
					.forward(32)
					.left(45)
					.forward(32)
					.stroke()
			}}
		/>
	)
}
```

[🐢 Try it yourself!](https://codesandbox.io/s/react-turtle-basic-tk7yd)

> See below for the full list of turtle commands!

## Walking

If the `draw` function returns a callback function, then the Turtle component
will call this callback over and over until the callback returns false. The
callback receives the iteration index as its only argument.

We call this callback a `walk` function.

Here's an example:

```jsx
function App() {
	return (
		<Turtle
			draw={(turtle) => {
				turtle.setcolor('#41aaf3').setlinewidth(2)

				return function walk(i) {
					turtle
						.circle(i, 90)
						.forward(8)
						.circle(-i, 180)
						.forward(8)
						.stroke()

					return i < 100
				}
			}}
		/>
	)
}
```

In the above example, the `walk` function will run one hundred times.

[🐢 Try it yourself!](https://codesandbox.io/s/react-turtle-walking-wb9ug)

> Be careful of an infinite loop! The component will automatically bail if a
> walk function is called more than 10,000 times.

## API

All `Turtle` methods return the `Turtle` instance, allowing for functional
chains such as those shown in the examples above.

**penup**()

**pendown**()

**forward**( distance: number )

**backward**( distance: number )

**left**( angle?: number = 90 )

**right**( angle?: number = 90 )

**circle**( radius, extent: number = 360, steps?: number )

**goto**( x: number, y: number )

**setx**(x: number)

**sety**(y: number)

**jump**( x: number, y: number )

**setheading**( angle: number )

**setcolor**( color: string )

**transformColor**( callback: (color: Color) => Color )

**setlinewidth**( linewidth: number )

**home**()

**clearPaths**()

**clear**(x: number, y: number, width: number, height: number)

**stroke**()

**fill**()

**save**()

**restore**()

## Prior Art

[Turtle Graphics](https://en.wikipedia.org/wiki/Turtle_graphics) is an old
project, dating back to the 1960s and popularized by inclusion in the
[Python programming language](https://docs.python.org/3.7/library/turtle.html).
It's a great introduction to any programming language.

Thanks to [Turtletoy](https://turtletoy.net) for inspiring this project.

See older projects:

- [js-turtle](https://github.com/bjpop/js-turtle)
- [turtle-js](https://github.com/raimohanska/turtle-js)

## Support

Please [open an issue](https://github.com/steveruizok/react-turtle/issues/new)
for support.

## Contributing

Please contribute using
[Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and
[open a pull request](https://github.com/steveruizok/react-turtle/compare/).
