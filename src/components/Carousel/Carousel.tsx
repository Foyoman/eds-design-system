import React, { useState, useRef, MutableRefObject } from "react";
import '!style-loader!css-loader!sass-loader!./carousel.scss'

interface ComponentProps {
	[key: string]: any;
	name: string;
}

interface ChildrenProps {
	children: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}

interface CarouselProps extends ChildrenProps {
	items: ComponentProps[];
}

interface DefaultWrapperProps extends ChildrenProps {
	opacity?: number;
}

const wrapperStyle: React.CSSProperties = {
	border: "5px solid red",
	padding: `var(--spacer-md)`
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="item">{children}</div>
);

const DefaultWrapper = ({ children, opacity = 0.5 }: DefaultWrapperProps) => (
  <>
    {React.Children.map(children, (child) => (
      <Wrapper>
        {React.cloneElement(child as React.ReactElement, {
          style: { ...child!.props.style, opacity: opacity },
        })}
      </Wrapper>
    ))}
  </>
);

export default function Carousel({ children, ...props }: CarouselProps) {
  const { items } = props;
  const [gradient, setGradient] = useState("right");
  const carouselEl: MutableRefObject<HTMLDivElement | null> = useRef(null);

	const handleLeftClick = () => {
		if (carouselEl.current!.scrollLeft === 0) return;
		if (carouselEl.current!.scrollLeft! - 250 < 0) {
			carouselEl.current!.scrollLeft = 0;
		} else {
			carouselEl.current!.scrollLeft -= 250;
		}
	}

	const handleRightClick = () => {
		const scrollLeft = carouselEl.current!.scrollLeft;
		const fullWidth = carouselEl.current!.scrollWidth - carouselEl.current!.offsetWidth;

		if (scrollLeft === fullWidth) return;
		if (scrollLeft + 250 > fullWidth) {
			carouselEl.current!.scrollLeft += fullWidth - scrollLeft;
		} else {
			carouselEl.current!.scrollLeft += 250;
		}
	}

  const handleScroll = (e: React.BaseSyntheticEvent) => {
    if (e.target === document) return;
    const scrollLeft = e.target.scrollLeft;
    const fullWidth = e.target.scrollWidth - e.target.offsetWidth;

    if (scrollLeft === fullWidth) {
      setGradient("left");
    } else if (scrollLeft === 0) {
      setGradient("right");
    } else {
      setGradient("full");
    }
  };

  return (
    <div className="container mds__component">
      {items.length > 0 && (
			<div className="carousel-container">
				<div
					ref={carouselEl}
					className={`horizontal-scroll ${gradient}`}
					onScroll={handleScroll}
				>
					<DefaultWrapper>{children}</DefaultWrapper>
				</div>
				<div id="left-chevron" className={`chevron ${gradient}`} onClick={handleLeftClick}>
					<svg data-v-d52d46d0="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path data-v-d52d46d0="" fill="currentColor" d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"></path></svg>
				</div>
				<div id="right-chevron" className={`chevron ${gradient}`} onClick={handleRightClick}>
					<svg data-v-d52d46d0="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path data-v-d52d46d0="" fill="currentColor" d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"></path></svg>
				</div>
			</div>
      )}
    </div>
  );
}