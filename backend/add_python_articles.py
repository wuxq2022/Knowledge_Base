# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from app.core.database import SessionLocal
from app.models import Category, KnowledgeArticle, ArticleStatus
from datetime import datetime

db = SessionLocal()

python_cat = db.query(Category).filter(Category.slug == 'python').first()

articles = [
    {
        'title': 'Python 初学者入门指南',
        'slug': 'python-beginner-guide',
        'content': '''# Python 初学者入门指南

## 为什么学习 Python？

Python 是一门非常适合初学者的编程语言，原因如下：

- **语法简洁**：Python 的语法接近自然语言，易于理解和学习
- **应用广泛**：Web开发、数据分析、人工智能、自动化脚本等
- **社区活跃**：丰富的第三方库和活跃的社区支持
- **就业前景好**：Python 开发者需求量大

## 学习路线图

### 第一阶段：基础语法（2-3周）

1. **变量和数据类型**
   - 数字（int, float）
   - 字符串（str）
   - 布尔值（bool）
   - 列表（list）
   - 字典（dict）
   - 元组（tuple）
   - 集合（set）

2. **控制流程**
   - if/elif/else 条件判断
   - for 循环
   - while 循环
   - break 和 continue

3. **函数**
   - 函数定义和调用
   - 参数传递
   - 返回值
   - 作用域

### 第二阶段：进阶知识（3-4周）

1. **面向对象编程**
   - 类和对象
   - 继承
   - 封装
   - 多态

2. **文件操作**
   - 文件读写
   - JSON 处理
   - CSV 处理

3. **异常处理**
   - try/except
   - 自定义异常

### 第三阶段：实战项目（4-6周）

1. **Web 爬虫**
2. **数据分析**
3. **Web 开发**
4. **自动化脚本**

## 推荐学习资源

- 官方文档：https://docs.python.org/zh-cn/3/
- 菜鸟教程：https://www.runoob.com/python3/
- 廖雪峰 Python 教程

## 学习建议

1. **多动手实践**：编程是实践性技能，光看不练是学不会的
2. **循序渐进**：不要急于求成，打好基础很重要
3. **阅读优秀代码**：学习别人的代码风格和技巧
4. **参与社区**：遇到问题多问多交流
''',
        'summary': 'Python 初学者完整学习路线，从基础语法到实战项目，帮助你快速入门 Python 编程',
        'is_featured': True,
    },
    {
        'title': 'Python 数据类型详解',
        'slug': 'python-data-types',
        'content': '''# Python 数据类型详解

## 基本数据类型

### 1. 数字类型

```python
# 整数
age = 25
count = -10

# 浮点数
price = 19.99
pi = 3.14159

# 复数
c = 3 + 4j
```

### 2. 字符串（str）

```python
name = "Python"
message = 'Hello, World!'

# 字符串操作
print(name.upper())      # PYTHON
print(name.lower())      # python
print(len(name))         # 6
print(name[0])           # P
print(name[1:4])         # yth
```

### 3. 布尔值（bool）

```python
is_true = True
is_false = False

# 比较运算符返回布尔值
print(5 > 3)   # True
print(5 == 3)  # False
```

## 容器数据类型

### 1. 列表（list）

```python
fruits = ['apple', 'banana', 'orange']

# 添加元素
fruits.append('grape')

# 删除元素
fruits.remove('banana')

# 列表推导式
squares = [x**2 for x in range(10)]
```

### 2. 字典（dict）

```python
person = {
    'name': '张三',
    'age': 25,
    'city': '北京'
}

# 访问值
print(person['name'])
print(person.get('job', '未设置'))
```

### 3. 元组（tuple）

```python
coordinates = (10, 20)
x, y = coordinates  # 解包
```

### 4. 集合（set）

```python
unique_numbers = {1, 2, 3, 4, 5}
a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # 并集
print(a & b)  # 交集
```
''',
        'summary': '详细介绍 Python 的数据类型：数字、字符串、列表、字典、元组、集合',
        'is_featured': True,
    },
    {
        'title': 'Python 函数与模块',
        'slug': 'python-functions-modules',
        'content': '''# Python 函数与模块

## 函数基础

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Python")
print(message)  # Hello, Python!
```

## 参数类型

```python
# 默认参数
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# 可变参数
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

# 关键字可变参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="张三", age=25)
```

## Lambda 函数

```python
square = lambda x: x ** 2
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
```

## 常用内置模块

| 模块 | 用途 |
|------|------|
| os | 操作系统接口 |
| sys | 系统相关参数 |
| json | JSON 数据处理 |
| datetime | 日期时间处理 |
| re | 正则表达式 |
| random | 随机数生成 |
''',
        'summary': '学习 Python 函数定义、参数传递、Lambda 表达式和模块使用',
        'is_featured': False,
    },
    {
        'title': 'Python 面向对象编程',
        'slug': 'python-oop',
        'content': '''# Python 面向对象编程

## 类与对象

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我是{self.name}，今年{self.age}岁"

person = Person("张三", 25)
print(person.introduce())
```

## 继承

```python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def speak(self):
        return f"{self.name}说：汪汪汪！"

dog = Dog("小黑")
print(dog.speak())
```

## 封装

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.__balance = balance  # 私有属性
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

account = BankAccount("张三", 1000)
account.deposit(500)
```
''',
        'summary': '深入理解 Python 面向对象编程：类、对象、继承、封装',
        'is_featured': False,
    },
    {
        'title': 'Python 常用第三方库推荐',
        'slug': 'python-popular-libraries',
        'content': '''# Python 常用第三方库推荐

## 数据处理

### NumPy - 数值计算
```python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr * 2)  # [2 4 6 8 10]
```

### Pandas - 数据分析
```python
import pandas as pd
df = pd.DataFrame({'name': ['张三', '李四'], 'age': [25, 30]})
print(df.head())
```

## Web 开发

### Flask - 轻量级框架
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'
```

### FastAPI - 现代 API 框架
```python
from fastapi import FastAPI
app = FastAPI()

@app.get('/')
def read_root():
    return {'Hello': 'World'}
```

## 网络爬虫

### Requests - HTTP 请求
```python
import requests
response = requests.get('https://api.github.com')
print(response.json())
```

## 安装第三方库

```bash
pip install numpy pandas flask fastapi requests
```
''',
        'summary': '推荐 Python 常用第三方库：NumPy、Pandas、Flask、FastAPI',
        'is_featured': False,
    },
]

for article_data in articles:
    existing = db.query(KnowledgeArticle).filter(KnowledgeArticle.slug == article_data['slug']).first()
    if not existing:
        article = KnowledgeArticle(
            title=article_data['title'],
            slug=article_data['slug'],
            content=article_data['content'],
            summary=article_data['summary'],
            category_id=python_cat.id if python_cat else None,
            status=ArticleStatus.PUBLISHED,
            is_featured=article_data['is_featured'],
            author_id=1,
            published_at=datetime.utcnow()
        )
        db.add(article)
        print(f'Created: {article_data["title"]}')

db.commit()
print('All articles created!')
db.close()
