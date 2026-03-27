# 项目迁移指南

本文档说明如何将此项目移动到其他位置运行。

## 可移植性分析

### ✅ 无需修改的部分

| 配置项 | 说明 |
|--------|------|
| 数据库 | 使用 SQLite (`./knowledge_base.db`)，相对路径，数据库文件在项目内 |
| 环境变量 | `.env` 文件没有硬编码绝对路径 |
| API 地址 | 前端配置使用 `localhost:8000`，后端 CORS 使用 `localhost:3000` |
| 密钥配置 | 都在 `.env` 文件中，无硬编码路径 |

### ⚠️ 移动后需要重建的部分

#### 1. Python 虚拟环境 (`.venv`)
虚拟环境包含绝对路径，移动后会失效。

#### 2. Node.js 依赖 (`node_modules`)
同样包含绝对路径引用，移动后需重新安装。

## 迁移步骤

### 第一步：打包源代码

移动时排除以下目录：

```
要排除的目录：
├── .venv/              # Python 虚拟环境
├── __pycache__/        # Python 缓存
├── node_modules/       # Node.js 依赖
├── .next/              # Next.js 构建缓存
└── *.pyc               # Python 编译文件
```

### 第二步：在新位置重建环境

#### 后端 (Python)

```powershell
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
.\.venv\Scripts\activate

# 安装依赖
pip install -r backend\requirements.txt
```

#### 前端 (Node.js)

```powershell
cd frontend

# 安装依赖
npm install
```

### 第三步：启动项目

#### 启动后端

```powershell
cd backend
..\..venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 启动前端

```powershell
cd frontend
npm run dev
```

## 注意事项

1. 确保 Python 版本兼容（建议 3.9+）
2. 确保 Node.js 版本兼容（建议 18+）
3. 如果使用 MySQL 数据库，需修改 `backend\.env` 中的 `DATABASE_URL`
4. 生产环境请修改 `SECRET_KEY` 为安全的随机字符串
