import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ProblemStatement({ description }: { description: string }) {
	return (
		<div className="prose prose-zinc lg:prose-lg dark:prose-invert max-w-none">
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					table: ({ children }) => (
						<div className="overflow-x-auto my-8">
							<table className="border-collapse w-full rounded-lg shadow-sm">
								{children}
							</table>
						</div>
					),

					thead: ({ children }) => (
						<thead className="bg-zinc-50 dark:bg-zinc-800">{children}</thead>
					),

					th: ({ children }) => (
						<th className="border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-left font-semibold">
							{children}
						</th>
					),

					td: ({ children }) => (
						<td className="border border-zinc-200 dark:border-zinc-700 px-4 py-3 font-mono text-sm">
							{children}
						</td>
					),

					code: ({ children }) => (
						<code className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 font-mono text-sm">
							{children}
						</code>
					),

					pre: ({ children }) => (
						<pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg shadow-sm overflow-x-auto">
							{children}
						</pre>
					),

					h1: ({ children }) => (
						<h1 className="text-2xl font-bold text-zinc-900 dark:text-white mt-6 mb-4">
							{children}
						</h1>
					),

					h2: ({ children }) => (
						<h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-5 mb-3">
							{children}
						</h2>
					),

					h3: ({ children }) => (
						<h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mt-4 mb-2">
							{children}
						</h3>
					),

					p: ({ children }) => (
						<p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
							{children}
						</p>
					),

					ul: ({ children }) => (
						<ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300">
							{children}
						</ul>
					),

					ol: ({ children }) => (
						<ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300">
							{children}
						</ol>
					),
				}}
			>
				{description}
			</Markdown>
		</div>
	);
}
