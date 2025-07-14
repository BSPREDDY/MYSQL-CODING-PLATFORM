// "use client";

// import React, { useEffect, useRef } from "react";
// import { EditorState } from "@codemirror/state";
// import { sql } from "@codemirror/lang-sql";
// import { EditorView, basicSetup } from "codemirror";

// // type  for the editor handle to expose methods
// export type CodeMirrorHandle = {
// 	getValue: () => string;
// };

// type CodeMirrorEditorProps = {
// 	editorRef?: React.RefObject<CodeMirrorHandle | null>;
// };
// const CodeMirrorEditor = ({ editorRef }: CodeMirrorEditorProps) => {
// 	//ref for container div to mount the editor
// 	const containerRef = useRef<HTMLDivElement>(null);

// 	// holds the editors user interface instance
// 	const viewRef = useRef<EditorView>(null);

// 	useEffect(() => {
// 		if (!containerRef.current) return;

// 		const startState = EditorState.create({
// 			doc: "create Table users(id int, name varchar(255));\ninsert into users values(1, 'test_user');\nselect * from users;",
// 			extensions: [
// 				basicSetup, // key bindings and line numbers
// 				sql(), //sql lang
// 				EditorView.theme({
// 					"&": { height: "691px", fontSize: "14px" }, //editor styles
// 					"cm-contet": { fontFamily: "monospace" }, //for editor content
// 				}),
// 			],
// 		});

// 		// Create a new EditorView instance with the initial state and attach it to the container
// 		const view = new EditorView({
// 			state: startState,
// 			parent: containerRef.current,
// 		});

// 		viewRef.current = view; //store the view instance in ref

// 		if (editorRef) {
// 			editorRef.current = {
// 				getValue: () => view.state.doc.toString(),
// 			};
// 		}

// 		// Cleanup function to destroy the editor view when the component unmounts or updates
// 		return () => {
// 			view.destroy();
// 		};
// 	}, []);

// 	return <div ref={containerRef} />; // Render a div that will contain the CodeMirror editor
// };

// export default CodeMirrorEditor;

// -------------------------------------------------------------------------------------------
//Better Styled
"use client";

import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { sql } from "@codemirror/lang-sql";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

// type for the editor handle to expose methods
export type CodeMirrorHandle = {
	getValue: () => string;
	setValue: (value: string) => void;
	focus: () => void;
};

type CodeMirrorEditorProps = {
	editorRef?: React.RefObject<CodeMirrorHandle | null>;
	initialValue?: string;
};

const CodeMirrorEditor = ({
	editorRef,
	initialValue,
}: CodeMirrorEditorProps) => {
	// ref for container div to mount the editor
	const containerRef = useRef<HTMLDivElement>(null);

	// holds the editor's user interface instance
	const viewRef = useRef<EditorView | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Initial SQL code with proper formatting and indentation
		const initialCode =
			initialValue ||
			`-- Example SQL query
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO users (id, name, email) VALUES
  (1, 'John Doe', 'john@example.com'),
  (2, 'Jane Smith', 'jane@example.com');

-- Query the data
SELECT * FROM users WHERE id > 0;`;

		const startState = EditorState.create({
			doc: initialCode,
			extensions: [
				basicSetup, // key bindings and line numbers
				sql(), // sql language support
				keymap.of([indentWithTab]), // Enable tab for indentation
				EditorView.theme({
					"&": {
						height: "100%",
						fontSize: "14px",
						fontFamily:
							"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
						borderRadius: "6px",
					},
					".cm-content": {
						padding: "12px 0",
						lineHeight: "1.6",
					},
					".cm-gutters": {
						backgroundColor: "#f8fafc",
						color: "#64748b",
						border: "none",
						borderRight: "1px solid #e2e8f0",
						paddingRight: "8px",
					},
					".cm-activeLineGutter": {
						backgroundColor: "#f1f5f9",
						color: "#0f172a",
					},
					".cm-activeLine": {
						backgroundColor: "#f1f5f9",
					},
					".cm-selectionMatch": {
						backgroundColor: "rgba(125, 211, 252, 0.2)",
					},
					".cm-cursor": {
						borderLeftColor: "#3b82f6",
						borderLeftWidth: "2px",
					},
					".cm-line": {
						padding: "0 12px",
					},
					// SQL-specific syntax highlighting
					".cm-keyword": {
						color: "#8b5cf6", // purple for keywords (SELECT, FROM, etc.)
						fontWeight: "600",
					},
					".cm-operator": {
						color: "#0ea5e9", // blue for operators
					},
					".cm-number": {
						color: "#10b981", // green for numbers
					},
					".cm-string": {
						color: "#f59e0b", // amber for strings
					},
					".cm-comment": {
						color: "#71717a", // gray for comments
						fontStyle: "italic",
					},
					".cm-def": {
						color: "#06b6d4", // cyan for definitions
					},
				}),
			],
		});

		// Create a new EditorView instance with the initial state and attach it to the container
		const view = new EditorView({
			state: startState,
			parent: containerRef.current,
		});

		viewRef.current = view; // store the view instance in ref

		if (editorRef) {
			editorRef.current = {
				getValue: () => view.state.doc.toString(),
				setValue: (value: string) => {
					view.dispatch({
						changes: { from: 0, to: view.state.doc.length, insert: value },
					});
				},
				focus: () => view.focus(),
			};
		}

		// Auto-focus the editor on mount
		setTimeout(() => {
			view.focus();
		}, 100);

		// Cleanup function to destroy the editor view when the component unmounts
		return () => {
			view.destroy();
		};
	}, [editorRef, initialValue]);

	return (
		<div
			ref={containerRef}
			className="h-full w-full bg-white overflow-hidden rounded-md cursor-text"
		/>
	);
};

export default CodeMirrorEditor;
