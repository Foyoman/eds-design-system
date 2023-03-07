import React, { useState } from "react";
import '!style-loader!css-loader!sass-loader!./markdownparser.scss'
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import rangeParser from 'parse-numeric-range';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);

interface MarkdownParserProps {
	content: string;
}

export default function MarkdownParser (props: MarkdownParserProps) {
	const { content } = props;
	const [markdown, setMarkdown] = useState(content);

	const syntaxTheme = oneDark;
	
	const MarkdownComponents: object = {

		// const styleMarkdown = css({
		// 	'.codeStyle, pre, code, code span': {
		// 		// Your SyntaxHighlighter override styles here
		// 	},
		// 	code: {
		// 	 // Your general code styles here
		// 	},
		// 	'pre code': {
		// 		// Your code-block styles here
		// 	},
		// 	'h3 code': {
		// 		color: 'inherit'
		// 	},
		// 	'span.linenumber': {
		// 		display: 'none !important'
		// 	},
		// 	'[data="highlight"]': {
		// 		// Your custom line highlight styles here
		// 	},
		// })

		code({ node, inline, className, ...props}) {
			
			const match = /language-(\w+)/.exec(className || '');
			const hasMeta = node?.data?.meta;

			const applyHighlights: object = (applyHighlights: number) => {
				if (hasMeta) {
					const RE = /{([\d,-]+)}/;
					const metadata = node.data.meta?.replace(/\s/g, '');
					const strlineNumbers = RE?.test(metadata) 
						? RE?.exec(metadata)[1] 
						: '0';
					const highlightLines = rangeParser(strlineNumbers);
					const highlight = highlightLines;
					const data: string = highlight.includes(applyHighlights)
						? 'highlight'
						: null;
					return { data };
				} else {
					return {};
				}
			}

			return match ? (
				<SyntaxHighlighter
					style={syntaxTheme}
					language={match[1]}
					PreTag="div"
					className="codeStyle"
					showLineNumbers={true}
					wrapLines={hasMeta ? true : false}
					useInlineStyles={true}
					lineProps={applyHighlights}
					{...props}
				/>
			) : (
				<code className={className} {...props} />
			)
		},
	}

	const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const md = (e.target as HTMLTextAreaElement).value
		console.log(md);
		setMarkdown(md);
	}
	
	return (
		<>
			<ReactMarkdown
				components={MarkdownComponents}
				// css={styleMarkdown}
			>
				{ markdown }
			</ReactMarkdown>
			<textarea cols={30} rows={10} onChange={handleChange} value={markdown} />
		</>
	)
}