import React, { useImperativeHandle, useRef } from 'react';
import { useAnimationFrame, UseTimedCallbackEventI } from '@smujdev/react-timing-hooks'

export interface OnCanvasFrameEventI<T> extends UseTimedCallbackEventI<T> {
	canvas: HTMLCanvasElement;
}

export type OnCanvasFrame<T> = (event: OnCanvasFrameEventI<T>) => void;

export interface CanvasPropsI<T> extends React.ComponentProps<'canvas'> {
	canvasRef?: React.MutableRefObject<HTMLCanvasElement>;
	userData?: T;
	onFrame?: OnCanvasFrame<T>;
}

/**
 * Cavnas component with automatic sizing
 */
export function Canvas<T = unknown>(props: CanvasPropsI<T>): JSX.Element {
	const { width, height, canvasRef, userData, onFrame, ...canvasProps } = props;

	const ref = useRef<HTMLCanvasElement>(null!);
	useImperativeHandle(canvasRef, () => ref.current);

	useAnimationFrame((event: UseTimedCallbackEventI<T>) => {
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
	}, userData);

	return React.createElement('canvas', { ...canvasProps, ref }, null);
}

export default Canvas;
