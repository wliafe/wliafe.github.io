---
title: uv
date: 2025-08-01 09:03:15
categories:
    - 工具
tags:
    - Python
---

uv是Python的包管理工具，它可以用来安装、升级、卸载Python包。使用uv可以大大方便项目的管理，他像npm一样建立了项目环境，但又采用软链接的形式减少了空间占用并加快了安装速度。使用uv是未来管理Python项目的趋势。

[uv官方文档](https://docs.astral.sh/uv/)

<!--more-->

## uv常用命令

初始化项目

```bash
uv init --package
```

安装包

```bash
uv add <package-name>
```

卸载包

```bash
uv remove <package-name>
```

安装项目依赖

```bash
uv sync
```

运行项目

```bash
uv run <command>
```

查看项目依赖树

```bash
uv tree
```

构建项目

```bash
uv build
```

## uv脚本

Python是一个脚本语言，而uv的脚本功能，使我深刻了解到了这一点。

### 编写uv脚本

在`src`目录下创建`utils/__init__.py`文件，在`__init__.py`文件中编写功能脚本，实现与项目相关的功能。

例如，编写一个脚本，从`pyproject.toml`文件中提取依赖并写入`requirements.txt`文件中。

```python utils/__init__.py
def write_requirements():
    """
    从 pyproject.toml 中提取依赖并写入 requirements.txt
    """
    with open(ROOT / "requirements.txt", "w") as f:
        for dep in config["project"]["dependencies"]:
            f.write(dep + "\n")
    with open(ROOT / "docs/requirements.txt", "w") as f:
        for dep in config["dependency-groups"]["docs"]:
            f.write(dep + "\n")
```

`pyproject.toml`文件中的`project.scripts`条目是项目的脚本入口，在其中添加`utils/__init__.py`文件中的函数。

```toml pyproject.toml
[project.scripts]
requires = "utils:write_requirements"
```

执行脚本。

```bash
uv run requires
```

### 几个常用脚本

执行shell命令，并实时显示输出。

```python
import subprocess


def run_command(command):
    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,  # 合并错误输出到标准输出
        text=True,  # 返回字符串而非字节
        bufsize=1,  # 行缓冲模式
        shell=True, # Windows环境下添加，Linux环境删除
    )
    while True:
        line = process.stdout.readline()
        if not line:
            break
        print(line.strip())
```

读取并解析`pyproject.toml`文件，`config`中包含`pyproject.toml`的所有信息。

```python
import sys
from pathlib import Path

FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]  # 项目根目录

if sys.version_info >= (3, 11):
    # Python 3.11 或更高
    import tomllib as tomli
else:
    # Python 3.8 ~ 3.10
    import tomli

with open(ROOT / "pyproject.toml", "rb") as f:
    config = tomli.load(f)
```
