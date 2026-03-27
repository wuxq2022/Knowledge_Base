'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return <code className="bg-gray-100 text-primary-600 px-1.5 py-0.5 rounded text-sm">{children}</code>
            }
            return <code className={className}>{children}</code>
          },
          pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-primary-500 bg-primary-50 p-4 rounded-r-lg mb-4">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} className="text-primary-600 hover:text-primary-700 underline">{children}</a>,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          th: ({ children }) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
