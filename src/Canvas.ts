import React, { useImperativeHandle, useRef } from 'react';
import { useAnimationFrame, UseTimedCallbackEventI } from '@smujdev/react-timing-hooks'

// https://stackoverflow.com/a/58473012
declare module "react" {
	function forwardRef<T, P = {}>(
		render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
	): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

export interface OnFrameEventI<T> extends UseTimedCallbackEventI<T> {
	canvas: HTMLCanvasElement;
}

export type OnFrame<T> = (event: OnFrameEventI<T>) => void;

export interface CanvasPropsI<T> extends React.ComponentProps<'canvas'> {
	userData?: T;
	onFrame?: OnFrame<T>;
}

/**
 * Cavnas component with automatic sizing
 */
export function Canvas<T = unknown>(props: CanvasPropsI<T>, canvasRef: React.ForwardedRef<HTMLCanvasElement>): JSX.Element {
	const { width, height, userData, onFrame, ...canvasProps } = props;

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

	return React.createElement('canvas', { ...canvasProps, ref })
}

export default Canvas;
