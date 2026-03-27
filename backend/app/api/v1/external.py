from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import urllib.request
import json

router = APIRouter(prefix="/external", tags=["External Knowledge"])


class ExternalResource(BaseModel):
    title: str
    url: str
    description: str
    source: str
    category: Optional[str] = None


class PythonDocItem(BaseModel):
    name: str
    url: str
    description: str


@router.get("/python-docs", response_model=List[PythonDocItem])
async def get_python_docs():
    return [
        {
            "name": "Python 官方教程",
            "url": "https://docs.python.org/zh-cn/3/tutorial/index.html",
            "description": "Python 官方中文教程，适合初学者入门"
        },
        {
            "name": "Python 标准库",
            "url": "https://docs.python.org/zh-cn/3/library/index.html",
            "description": "Python 标准库参考文档"
        },
        {
            "name": "Python 语言参考",
            "url": "https://docs.python.org/zh-cn/3/reference/index.html",
            "description": "Python 语法和语义的详细说明"
        },
        {
            "name": "Python 安装指南",
            "url": "https://docs.python.org/zh-cn/3/using/index.html",
            "description": "各平台 Python 安装说明"
        },
        {
            "name": "Python HOWTOs",
            "url": "https://docs.python.org/zh-cn/3/howto/index.html",
            "description": "特定主题的深入指南"
        },
    ]


@router.get("/python-resources", response_model=List[ExternalResource])
async def get_python_resources():
    return [
        {
            "title": "菜鸟教程 - Python3 教程",
            "url": "https://www.runoob.com/python3/python3-tutorial.html",
            "description": "适合初学者的 Python3 入门教程",
            "source": "runoob.com",
            "category": "tutorial"
        },
        {
            "title": "廖雪峰 Python 教程",
            "url": "https://www.liaoxuefeng.com/wiki/1016959663602400",
            "description": "通俗易懂的 Python 入门教程",
            "source": "liaoxuefeng.com",
            "category": "tutorial"
        },
        {
            "title": "Real Python",
            "url": "https://realpython.com/",
            "description": "高质量的 Python 教程和文章",
            "source": "realpython.com",
            "category": "tutorial"
        },
        {
            "title": "Python Weekly",
            "url": "https://www.pythonweekly.com/",
            "description": "Python 周刊，每周精选 Python 相关文章和项目",
            "source": "pythonweekly.com",
            "category": "newsletter"
        },
        {
            "title": "PyPI - Python 包索引",
            "url": "https://pypi.org/",
            "description": "Python 官方第三方包仓库",
            "source": "pypi.org",
            "category": "package"
        },
        {
            "title": "Awesome Python",
            "url": "https://awesome-python.com/",
            "description": "精选 Python 框架、库、软件和资源列表",
            "source": "awesome-python.com",
            "category": "resource"
        },
        {
            "title": "Python GitHub Topics",
            "url": "https://github.com/topics/python",
            "description": "GitHub 上热门的 Python 项目",
            "source": "github.com",
            "category": "code"
        },
        {
            "title": "Stack Overflow - Python",
            "url": "https://stackoverflow.com/questions/tagged/python",
            "description": "Python 相关问答",
            "source": "stackoverflow.com",
            "category": "qa"
        },
    ]


@router.get("/learning-path")
async def get_learning_path():
    return {
        "title": "Python 初学者学习路线",
        "stages": [
            {
                "stage": 1,
                "title": "基础入门",
                "duration": "2-3周",
                "topics": [
                    "环境搭建与工具使用",
                    "变量与数据类型",
                    "运算符与表达式",
                    "控制流程（if/for/while）",
                    "函数基础"
                ],
                "practice": [
                    "编写简单计算器",
                    "猜数字游戏",
                    "温度转换器"
                ]
            },
            {
                "stage": 2,
                "title": "进阶提升",
                "duration": "3-4周",
                "topics": [
                    "面向对象编程",
                    "文件操作",
                    "异常处理",
                    "模块与包",
                    "正则表达式"
                ],
                "practice": [
                    "学生管理系统",
                    "文件批量处理工具",
                    "简单爬虫"
                ]
            },
            {
                "stage": 3,
                "title": "实战应用",
                "duration": "4-6周",
                "topics": [
                    "Web 开发基础",
                    "数据库操作",
                    "API 开发",
                    "数据分析入门",
                    "项目部署"
                ],
                "practice": [
                    "个人博客系统",
                    "数据分析报告",
                    "REST API 服务"
                ]
            }
        ],
        "tips": [
            "每天坚持编码至少1小时",
            "遇到问题先尝试自己解决",
            "多阅读优秀的开源项目代码",
            "参与技术社区讨论",
            "建立自己的代码仓库"
        ]
    }


@router.get("/trending-packages")
async def get_trending_packages():
    return [
        {
            "name": "requests",
            "description": "简洁优雅的 HTTP 请求库",
            "url": "https://pypi.org/project/requests/",
            "category": "网络请求"
        },
        {
            "name": "pandas",
            "description": "强大的数据分析和处理库",
            "url": "https://pypi.org/project/pandas/",
            "category": "数据分析"
        },
        {
            "name": "numpy",
            "description": "科学计算基础库",
            "url": "https://pypi.org/project/numpy/",
            "category": "科学计算"
        },
        {
            "name": "flask",
            "description": "轻量级 Web 框架",
            "url": "https://pypi.org/project/flask/",
            "category": "Web开发"
        },
        {
            "name": "fastapi",
            "description": "现代高性能 Web API 框架",
            "url": "https://pypi.org/project/fastapi/",
            "category": "Web开发"
        },
        {
            "name": "django",
            "description": "全功能 Web 框架",
            "url": "https://pypi.org/project/django/",
            "category": "Web开发"
        },
        {
            "name": "scrapy",
            "description": "强大的爬虫框架",
            "url": "https://pypi.org/project/scrapy/",
            "category": "爬虫"
        },
        {
            "name": "matplotlib",
            "description": "数据可视化库",
            "url": "https://pypi.org/project/matplotlib/",
            "category": "数据可视化"
        },
        {
            "name": "pytest",
            "description": "简洁强大的测试框架",
            "url": "https://pypi.org/project/pytest/",
            "category": "测试"
        },
        {
            "name": "sqlalchemy",
            "description": "Python SQL 工具包和 ORM",
            "url": "https://pypi.org/project/sqlalchemy/",
            "category": "数据库"
        },
    ]
