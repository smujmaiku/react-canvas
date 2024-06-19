# React Canvas

Canvas component with helpers

## Usage

### Canvas

```tsx
const handleFrame = ({ canvas, delta }) => {
	const ctx = canvas.getContext('2d');
}

return <Canvas onFrame={handleFrame} />
```
