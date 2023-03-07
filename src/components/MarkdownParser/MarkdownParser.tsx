import React, { useEffect, useState } from "react";

import "!style-loader!css-loader!sass-loader!./markdownparser.scss"
import '!style-loader!css-loader!sass-loader!./github.scss';

import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import rangeParser from "parse-numeric-range";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import Editor, { useMonaco } from "@monaco-editor/react";

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);

interface MarkdownParserProps {
	content: string;
	theme: string;
}

export default function MarkdownParser (props: MarkdownParserProps) {
	const { content, theme } = props;
	const [markdown, setMarkdown] = useState(content);
	const monaco = useMonaco();

	useEffect(() => {
		monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
		if (monaco) {
			console.log("here is the monaco instance:", monaco);
		}
	}, [monaco]);

	let syntaxTheme: typeof oneDark;
	let editorTheme: string;
	if (theme === "dark") {
		syntaxTheme = oneDark;
		editorTheme = 'vs-dark';
	} else {
		syntaxTheme = oneLight;
		editorTheme = 'vs-light';
	}
	
	const MarkdownComponents: object = {

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

	const handleChange = (value: string | undefined, e: React.SyntheticEvent) => {
		console.log(value);
		console.log(e);
		if (value) setMarkdown(value);
	}

	const options: object = {
		selectOnLineNumbers: true,
	}
	
	return (
		<div className={`md-parser ${theme}`}>
			<ReactMarkdown
				components={MarkdownComponents}
				className="markdown-body"
			>
				{ markdown }
			</ReactMarkdown>
			{/* <textarea cols={30} rows={10} onChange={handleChange} value={markdown} /> */}
			<Editor 
				height="90vh"
				width="100%"
				defaultLanguage="markdown"
				defaultValue="// some comment"
				theme={editorTheme}
				value={markdown}
				onChange={handleChange}
				options={options}
			/>
		</div>
	)
}