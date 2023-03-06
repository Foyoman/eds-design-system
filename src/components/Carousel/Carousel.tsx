import React, { useState, useRef, MutableRefObject } from "react";
import '!style-loader!css-loader!sass-loader!./carousel.scss'
import Card from "../Card/Card";

interface ComponentProps {
	[key: string]: any;
	name: string;
}

interface ChildrenProps {
	children: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}

interface CarouselProps extends ChildrenProps {
	heading?: string;
	subheading?: string;
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
  <div style={wrapperStyle}>{children}</div>
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
  const { heading, subheading, items } = props;
  const [gradient, setGradient] = useState("right");
  const carouselEl: MutableRefObject<HTMLDivElement | null> = useRef(null);

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
      {heading && <h2 className="heading">{heading}</h2>}
      {subheading && <p className="subheading">{subheading}</p>}
      {items.length > 0 && (
        <div className="carousel-container">
          <div
            ref={carouselEl}
            className={`horizontal-scroll ${gradient}`}
            onScroll={handleScroll}
          >
            <DefaultWrapper>{children}</DefaultWrapper>
          </div>
        </div>
      )}
    </div>
  );
}