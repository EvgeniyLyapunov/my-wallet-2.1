export const elementHeight_Relative_PreviousSiblingAndWindowHeight = (
	prevElemSelector: string
): number => {
	const prevElem = document.querySelector(prevElemSelector) as HTMLElement;

	const prevElemRect = prevElem.getBoundingClientRect();

	const targetHeight = document.documentElement.clientHeight - prevElemRect.height;

	return targetHeight;
};
