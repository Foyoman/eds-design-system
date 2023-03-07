import React from "react";
import '!style-loader!css-loader!sass-loader!./markdownparser.scss'

export default function MarkdownParser () {
	return (
		<textarea cols={30} rows={10}>
			hi 
			test
		</textarea>
	)
}