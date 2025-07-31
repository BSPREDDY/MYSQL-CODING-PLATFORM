// Check if the browser is in full-screen mode
export function isInFullScreen(): boolean {
	if (typeof document === "undefined") return false;

	// Check for fullscreen element
	const isFullScreen = !!(
		document.fullscreenElement ||
		(document as any).webkitFullscreenElement ||
		(document as any).mozFullScreenElement ||
		(document as any).msFullscreenElement
	);

	const screenWidth = window.screen.width;
	const screenHeight = window.screen.height;
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	// If window dimensions are very close to screen dimensions, consider it fullscreen

	const dimensionsMatch =
		Math.abs(screenWidth - windowWidth) < 5 &&
		Math.abs(screenHeight - windowHeight) < 5;

	return isFullScreen || dimensionsMatch;
}

// Request full-screen mode with better error handling
export async function requestFullScreen(element: Element): Promise<boolean> {
	try {
		if (element.requestFullscreen) {
			await element.requestFullscreen();
		} else if ((element as any).webkitRequestFullscreen) {
			await (element as any).webkitRequestFullscreen();
		} else if ((element as any).mozRequestFullScreen) {
			await (element as any).mozRequestFullScreen();
		} else if ((element as any).msRequestFullscreen) {
			await (element as any).msRequestFullscreen();
		} else {
			console.error("Fullscreen API not supported in this browser");
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error requesting fullscreen:", error);
		throw error;
	}
}

// Exit full-screen mode with  error handling
export async function exitFullScreen(): Promise<boolean> {
	try {
		const element =
			document.fullscreenElement ||
			(document as any).webkitFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).msFullscreenElement;
		if (document.exitFullscreen) {
			await document.exitFullscreen();
		} else if ((document as any).webkitExitFullscreen) {
			await (document as any).webkitExitFullscreen();
		} else if ((document as any).mozCancelFullScreen) {
			await (document as any).mozCancelFullScreen();
		} else if ((document as any).msExitFullscreen) {
			await (document as any).msExitFullscreen();
		} else {
			console.error("Fullscreen API not supported in this browser");
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error exiting fullscreen:", error);
		return false;
	}
}

// Check if full-screen is supported
export function isFullScreenSupported(): boolean {
	if (typeof document === "undefined") return false;

	return !!(
		document.documentElement.requestFullscreen ||
		(document.documentElement as any).webkitRequestFullscreen ||
		(document.documentElement as any).mozRequestFullScreen ||
		(document.documentElement as any).msRequestFullscreen
	);
}

// Check if the window has focus
export function windowHasFocus(): boolean {
	if (typeof document === "undefined") return false;
	return document.hasFocus();
}
