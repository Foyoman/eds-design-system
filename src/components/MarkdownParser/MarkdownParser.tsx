import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";

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
// import SettingsIcon from '@mui/icons-material/Settings';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);


// Markdown Preview Component

interface MarkdownPreviewProps {
	markdown: string | undefined;
	theme: typeof oneDark | "vs-light" | "vs-dark";
}

function MarkdownPreview({ markdown, theme }: MarkdownPreviewProps) {
	
	// syntax highlighter configuration for react-markdown
	const MemoizedMarkdownComponents = useMemo(() => {
		return {
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
				
				const style = {
					style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
				}
				
				Object.assign(applyHighlights, style);
				
				return match ? (
					<SyntaxHighlighter
						style={theme}
						language={match[1]}
						PreTag="div"
						className="codeStyle"
						showLineNumbers={true}
						wrapLines={hasMeta ? true : false}
						// wrapLines={true}
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
		};
	}, [theme]);
	
	const MemoizedMarkdown = useMemo(() => {
    return (
			<ReactMarkdown
				components={MemoizedMarkdownComponents}
				className="markdown-body"
			>
				{ markdown || "" }
			</ReactMarkdown>
		)
  }, [MemoizedMarkdownComponents, markdown]);

	return MemoizedMarkdown;
}

// Editor Component

interface EditorProps {
	content: string | undefined;
	theme: "vs-dark" | "vs-light" | undefined;
	onChange: (value: string) => void;
}

function EditorComponent({ content, theme, onChange }: EditorProps) {
	const monaco = useMonaco();

	// no clue what this does
	useEffect(() => {
		monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
	}, [monaco]);

	const debouncedSetMarkdown = debounce((value: string) => {
		onChange(value);
	}, 500);

	// handle monaco editor changes
	const handleInputChange = useMemo(() => { 
		return (value: string | undefined) => {
			if (value) {
				if (value.length > 5000) {
					debouncedSetMarkdown(value);
				} else {
					onChange(value);
				}
			}
		};
	}, [debouncedSetMarkdown, onChange]);

	const MemoizedEditor = useMemo(() => {
		return (
			<Editor 
				height="100%"
				width="100%"
				defaultLanguage="markdown"
				defaultValue=""
				theme={theme}
				value={content}
				onChange={handleInputChange}
				options={{
					selectOnLineNumbers: true,
					wordWrap: true,
				}}
				className="md-editor"
			/>
		)
	}, [content, handleInputChange, theme]);

	return MemoizedEditor;
}


// Full Parent Component

interface MarkdownParserProps {
	content: string | undefined;
	theme: "light" | "dark" | undefined;
	splitDirection: "vertical" | "horizontal" | undefined;
}

const MarkdownParser = ({ splitDirection = 'vertical', ...props }: MarkdownParserProps) => {
	const { content, theme } = props;
	const [markdown, setMarkdown] = useState(content);
	const [componentEl, setComponentEl] = useState<HTMLElement | null>(null);
	const markdownEl = useRef<HTMLDivElement>(null);

	const handleEditorChange = (value: string) => {
		setMarkdown(value);
	}

	// markdown and editor theming
	let markdownTheme: typeof oneDark;
	let editorTheme: "vs-dark" | "vs-light";
	if (theme === "dark") {
		markdownTheme = oneDark;
		editorTheme = 'vs-dark';
	} else {
		markdownTheme = oneLight;
		editorTheme = 'vs-light';
	}

	// adjust the resize bar's classes according to split direction
	useEffect(() => {
		if (!componentEl) {
			const component = document.getElementById('md-parser');
			setComponentEl(component);
		} else {
			const gutter = componentEl.querySelector('.gutter');
			if (splitDirection === "horizontal") {
				gutter?.classList.remove('gutter-vertical');
				gutter?.classList.add('gutter-horizontal');
			} else {
				gutter?.classList.remove('gutter-horizontal');
				gutter?.classList.add('gutter-vertical');
			}
		}
	}, [componentEl, splitDirection]);
	
	return (
		<Split 
			direction={splitDirection} 
			className={`md-parser ${theme}`}
			id="md-parser"
			sizes={[50, 50]}
			minSize={[0, 0]}
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
				<MarkdownPreview markdown={markdown} theme={markdownTheme} />
			</div>
			<div 
				className="editor-container" 
				style={{ 
					height: splitDirection === 'horizontal' ? '100%' : '',
					width: splitDirection === 'horizontal' ? '' : '100%'
				}}
			>
				<EditorComponent content={content} theme={editorTheme} onChange={handleEditorChange} />
			</div>
		</Split>
	)
}

export default React.memo(MarkdownParser);