---
title: uv 项目管理
aliases: []
type: note
created: 2025-08-01
area: Developer Tools
status: active
review: reviewed
tags:
  - python
layout: post
date: 2025-08-01
updated: 2025-08-01
categories:
  - 开发工具
permalink: 工具/uv/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

uv是Python的包管理工具，它可以用来安装、升级、卸载Python包。使用uv可以大大方便项目的管理，他像npm一样建立了项目环境，并通过缓存及写时复制、硬链接等机制减少重复复制；具体策略由平台、文件系统和`link-mode`决定，不能笼统称为软链接。使用uv是未来管理Python项目的趋势。

[uv官方文档](https://docs.astral.sh/uv/)



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

## 无外网使用

当服务器访问海外源受限、但仍能访问国内镜像时，可以配置镜像；这不等于完全离线。完全离线需预先准备解释器、缓存或本地软件包，再使用`--offline`。

### 安装Python

```bash
export UV_PYTHON_INSTALL_MIRROR=https://mirror.example.com/python-build-standalone/releases/download
```

`mirror.example.com`只是格式示例，必须替换为自己信任且采用兼容目录结构的解释器镜像，不能直接执行。解释器属于可执行软件，不建议使用来源不明的中转下载站。

### 换源

在Linux/macOS的`~/.config/uv/uv.toml`中添加以下配置（设置了`XDG_CONFIG_HOME`时以该目录为准）；Windows用户配置路径为`%APPDATA%\uv\uv.toml`。注意`uv.toml`不加`[tool.uv]`前缀，参见[uv配置文档](https://docs.astral.sh/uv/concepts/configuration-files/)。

```toml uv.toml
[[index]]
url = "https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple"
default = true
```

镜像说明见[清华PyPI镜像](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)。

## uv工具

### nvitop

[nvitop](https://github.com/XuehaiPan/nvitop)是一个用于监控NVIDIA GPU的工具，它可以显示GPU的使用情况。

安装命令

```bash
uv tool install nvitop
```

运行nvitop

```bash
nvitop
```

## uv脚本

Python是一个脚本语言，而uv的脚本功能，使我深刻了解到了这一点。

### 编写uv脚本

下面以`src/utils/__init__.py`作为脚本模块示例。必须确保构建后端会打包`utils`；实际项目更适合放在已有包内，并相应修改入口点模块路径。读取配置的`ROOT`等变量定义见本节后面的示例，应与函数放在同一模块中。

例如，通过`uv export`将锁定后的依赖写入requirements文件。不要只遍历`pyproject.toml`列表：它可能含有依赖组引用，也不包含解析后的传递依赖。下面假定已经定义`docs`依赖组。

```python utils/__init__.py
import subprocess


def write_requirements():
    """通过uv导出运行依赖与docs组依赖，失败时抛出异常。"""
    (ROOT / "docs").mkdir(exist_ok=True)
    subprocess.run(
        ["uv", "export", "--no-default-groups", "--no-emit-project",
         "--format", "requirements.txt", "--output-file", "requirements.txt"],
        cwd=ROOT, check=True,
    )
    subprocess.run(
        ["uv", "export", "--only-group", "docs", "--format", "requirements.txt",
         "--output-file", "docs/requirements.txt"],
        cwd=ROOT, check=True,
    )
```

`pyproject.toml`文件中的`project.scripts`条目是项目的脚本入口，在其中添加`utils/__init__.py`文件中的函数。

```conf pyproject.toml
[project.scripts]
requires = "utils:write_requirements"
```

执行脚本。

```bash
uv run requires
```

### 几个常用脚本

执行外部程序，并实时显示输出。传入参数列表，例如`["python", "--version"]`；不要拼接不可信输入，也不要仅因使用Windows就启用`shell=True`。只有确需shell内建命令/语法且输入可信时才另行处理。

```python
import subprocess


def run_command(command):
    with subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        shell=False,
    ) as process:
        for line in process.stdout:
            print(line, end="")
        returncode = process.wait()
        if returncode != 0:
            raise subprocess.CalledProcessError(returncode, command)
```

读取并解析`pyproject.toml`文件，`config`中包含其配置信息。这里假定文件位于`src/utils/__init__.py`；换位置时要调整`ROOT`。Python 3.10及更早版本需要另行安装`tomli`。导出选项见[uv文档](https://docs.astral.sh/uv/concepts/projects/export/)，子进程处理见[Python subprocess文档](https://docs.python.org/3/library/subprocess.html)。

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
