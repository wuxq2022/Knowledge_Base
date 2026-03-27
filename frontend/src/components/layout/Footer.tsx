import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KB</span>
              </div>
              <span className="text-xl font-bold text-white">知识库</span>
            </div>
            <p className="text-sm">
              收集整理各类软件技术知识，构建可扩展的知识库平台
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/knowledge" className="hover:text-white">
                  知识库
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white">
                  分类
                </Link>
              </li>
              <li>
                <Link href="/tags" className="hover:text-white">
                  标签
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">热门分类</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/frontend" className="hover:text-white">
                  前端技术
                </Link>
              </li>
              <li>
                <Link href="/categories/backend" className="hover:text-white">
                  后端技术
                </Link>
              </li>
              <li>
                <Link href="/categories/devops" className="hover:text-white">
                  DevOps
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">关于</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  联系方式
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 知识库. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
