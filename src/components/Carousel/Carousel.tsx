import React, { useState, useRef, MutableRefObject } from "react";
import '!style-loader!css-loader!sass-loader!./carousel.scss'

interface ComponentProps {
	[key: string]: any;
	name: string;
}

interface CarouselProps {
	heading?: string;
	subheading?: string;
	items: ComponentProps[];
}

export default function Carousel( props: CarouselProps ) {
	const { 
		heading,
		subheading,
		items
	} = props;
	const [gradient, setGradient] = useState('right');
	const carouselEl: HTMLDivElement | MutableRefObject<any> = useRef();
	const handleScroll = (e: React.BaseSyntheticEvent) => {
		if (e.target === document) return;
		const scrollLeft = e.target.scrollLeft;
		const fullWidth = e.target.scrollWidth - e.target.offsetWidth;

		if (scrollLeft === fullWidth) {
			setGradient('left');
			return
		}
		if (scrollLeft === 0) {
			setGradient('right');
		} else {
			setGradient('full');
		} 
	}
	return (
		<div className="container mds__component">
			{ heading && 
				<h2 className="heading">
					{ heading }
				</h2>
			}
			{ subheading && 
				<p className="subheading">
					{ subheading }
				</p>
			}
			{ items.length && 
				<div className="carousel-container">
					<div ref={carouselEl} className={`horizontal-scroll ${gradient}`} onScroll={handleScroll}>
						
					</div>
				</div>
			}
		</div>
	);
};