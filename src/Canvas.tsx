import React, { useImperativeHandle, useRef } from 'react';
import { useAnimationFrame, UseTimedCallbackEventI } from '@smujdev/react-timing-hooks'

export interface OnFrameEventI extends UseTimedCallbackEventI {
	canvas: HTMLCanvasElement;
}

export type OnFrame = (event: OnFrameEventI) => void;

export interface CanvasPropsI extends React.ComponentProps<'canvas'> {
	onFrame?: OnFrame;
}

/**
 * Cavnas component with automatic sizing
 */
export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasPropsI>((props, canvasRef) => {
	const { width, height, onFrame, ...canvasProps } = props;

	const ref = useRef<HTMLCanvasElement>(null!);
	useImperativeHandle(canvasRef, () => ref.current);

	useAnimationFrame((event) => {
		const canvas = ref.current;
		if (typeof width === 'number' && typeof height === 'number') {
			canvas.width = width;
			canvas.height = height;
		} else {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}

		if (!onFrame) throw new Error();
		onFrame({ ...event, canvas });
	});

	return <canvas {...canvasProps} ref={ref} />
});

export default Canvas;