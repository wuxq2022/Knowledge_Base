import Link from 'next/link'
import { ExternalLink, BookOpen, Package, Code, HelpCircle, Newspaper } from 'lucide-react'

interface ExternalResource {
  title: string
  url: string
  description: string
  source: string
  category: string
}

interface PythonDocItem {
  name: string
  url: string
  description: string
}

interface LearningPath {
  title: string
  stages: Array<{
    stage: number
    title: string
    duration: string
    topics: string[]
    practice: string[]
  }>
  tips: string[]
}

async function getPythonDocs(): Promise<PythonDocItem[]> {
  try {
    const res = await fetch('http://localhost:8000/api/v1/external/python-docs', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getResources(): Promise<ExternalResource[]> {
  try {
    const res = await fetch('http://localhost:8000/api/v1/external/python-resources', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getLearningPath(): Promise<LearningPath | null> {
  try {
    const res = await fetch('http://localhost:8000/api/v1/external/learning-path', {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const categoryIcons: Record<string, any> = {
  tutorial: BookOpen,
  package: Package,
  code: Code,
  qa: HelpCircle,
  newsletter: Newspaper,
  resource: ExternalLink,
}

export default async function PythonLearningPage() {
  const [docs, resources, learningPath] = await Promise.all([
    getPythonDocs(),
    getResources(),
    getLearningPath(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Python 学习资源</h1>
        <p className="text-gray-600 mt-2">动态获取的 Python 学习资源和推荐路线</p>
      </div>

      {learningPath && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{learningPath.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPath.stages.map((stage) => (
              <div key={stage.stage} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {stage.stage}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                    <p className="text-sm text-gray-500">{stage.duration}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {stage.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      {topic}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 mb-2">推荐练习：</p>
                  <div className="space-y-1">
                    {stage.practice.map((p, i) => (
                      <div key={i} className="text-sm text-gray-600">• {p}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-primary-50 rounded-xl p-6">
            <h3 className="font-semibold text-primary-900 mb-3">学习建议</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {learningPath.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-primary-800">
                  <span className="text-primary-500">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Python 官方文档</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc, i) => (
            <a
              key={i}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary-500" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">推荐学习资源</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, i) => {
            const Icon = categoryIcons[resource.category] || ExternalLink
            return (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 truncate">
                        {resource.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{resource.source}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">开始你的 Python 之旅</h2>
          <p className="text-primary-100 mb-6">
            查看我们的 Python 知识库文章，从基础到进阶，一步步掌握 Python 编程
          </p>
          <Link
            href="/categories/python"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            查看 Python 知识库
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
