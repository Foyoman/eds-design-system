import React, { ReactComponentElement } from "react";
import Link from "next/link";
import Image from "next/image";
import '!style-loader!css-loader!sass-loader!./card.scss'

interface Image {
	[key: string]: string | Object;
	filename: string;
	alt: string;
}

interface Link {
	[key: string]: string | Object;
	linktype: string;
	url: string;
}

interface CardProps {
	image: Image;
	link: Link;
	overline?: string;
	title: string;
	body: string;
	cta?: string;
	date?: string;
}

export default function Card( props: CardProps ) {
	const { 
		image, 
		link, 
		overline, 
		title, 
		body, 
		cta, 
		date 
	} = props;

	const linkTypes = {
		internal: Link,
		external: 'a' as JSX.IntrinsicElements['a']
	}
	const LinkEl = linkTypes.external;

	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		return new Date(date).toLocaleDateString('en-US', options);
	}

	let formattedDate: string | undefined;
	if (date) {
		formattedDate = formatDate(date);
	}

	return (
		<div className="card eds__component">
			<figure className="picture">
				<Image
					// format="webp"
					className="card-img"
					loading="lazy"
					src={image && image.filename}
					alt={image && image.alt}
					width="368"
					height="200"
					sizes="xs:100vw sm:100vw md:400px"
					object-fit="in"
				/>
			</figure>
			<div className="text-container">
				<p className="overline">
					{ overline }
				</p>
				<h5 className="font-weight-600">
					{ title }
				</h5>
				<p className="body text-small">
					{ body }
				</p>
				{ cta &&
				<div className="cta text-small">
					<span>
						{cta}
					</span>
				</div>
				}
				{ date && 
				<div className="date text-small">
					<span>
						{ formattedDate || date }
					</span>
				</div>
				}
			</div>
		</div>
	);
};