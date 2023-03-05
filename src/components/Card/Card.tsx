import React, { ReactComponentElement } from "react";
import Link from "next/link";

interface Link {
	[key: string]: string | Object;
	linktype: string;
}

interface CardProps {
	image?: Object;
	link: Link;
	overline?: string;
	title: string;
	body?: string;
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
	const Linked = linkTypes.external;
	return (
		<div className="card mds__component">
			<Linked href={link.url}>hey</Linked>
			<h2></h2>
			<a href={link.url}>yo</a>
		</div>
	);
};