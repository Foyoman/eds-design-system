import React, { useEffect, useRef, useState } from "react";

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
import Split from "react-split";
import SettingsIcon from '@mui/icons-material/Settings';

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
	splitDirection: "vertical" | "horizontal" | undefined;
}

export default function MarkdownParser ({ splitDirection = 'vertical', ...props }: MarkdownParserProps) {
	const { content, theme } = props;
	const [markdown, setMarkdown] = useState(content);
	const markdownEl = useRef<HTMLDivElement>(null);
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

		code({ node, inline, className, children, ...props}: any) {
			const code = String(children).replace(/\n$/, "")
			
			const match = /language-(\w+)/.exec(className || '');
			const hasMeta = node?.data?.meta;

			const applyHighlights: object = (applyHighlights: number) => {
				if (hasMeta) {
					const RE = /{([\d,-]+)}/;
					const metadata = node.data.meta?.replace(/\s/g, '');
					const strlineNumbers = RE?.test(metadata) 
						? RE.exec(metadata)![1] 
						: '0';
					const highlightLines = rangeParser(strlineNumbers);
					const highlight = highlightLines;
					const data: string | null = highlight.includes(applyHighlights)
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
				>
					{code}
				</SyntaxHighlighter>
			) : (
				<code className={className} {...props}> 
					{children}
				</code>
			)
		},
	}
	
	const options: object = {
		selectOnLineNumbers: true,
		wordWrap: true,
	}

	const handleChange = (value: string | undefined, e: React.SyntheticEvent) => {
		console.log(value);
		console.log(e);
		if (value) setMarkdown(value);
	}
	
	return (
		<Split 
		direction={splitDirection} 
		className={`md-parser ${theme}`}
		style={{
			flexDirection: splitDirection === 'horizontal' ? 'row' : 'column'
		}}
		>
			<div 
				ref={markdownEl} 
				className="md-container"
				style={{ 
					height: splitDirection === 'horizontal' ? '100%' : '',
					width: splitDirection === 'horizontal' ? '' : '100%'
				}}
			>
				<SettingsIcon className="settings-icon" />
				<ReactMarkdown
					components={MarkdownComponents}
					className="markdown-body"
				>
					{ markdown }
				</ReactMarkdown>
			</div>
			<div 
				className="editor-container" 
				style={{ 
					height: splitDirection === 'horizontal' ? '100%' : '',
					width: splitDirection === 'horizontal' ? '' : '100%'
				}}
			>
				<Editor 
					height="100%"
					width="100%"
					defaultLanguage="markdown"
					defaultValue="// some comment"
					theme={editorTheme}
					value={markdown}
					onChange={handleChange}
					options={options}
					className="md-editor"
				/>
			</div>
		</Split>
	)
}