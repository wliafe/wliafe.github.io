---
title: Python 包管理
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
permalink: 工具/pip/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

pip是Python官方的包管理工具，它可以用来安装、升级、卸载Python包。

有关pip的文档和包源，我们可以参考[pip官方文档](https://pip.pypa.io/en/stable/)和[PyPI包索引](https://pypi.org/)，基本使用参考[pip安装包](https://packaging.python.org/en/latest/tutorials/installing-packages/)

## 章节目录

1. [pip 常用命令与镜像](/%E5%B7%A5%E5%85%B7/pip/#pip%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4)
2. [发布 Python 库到 PyPI](/%E5%B7%A5%E5%85%B7/pip/#%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E5%BA%93%E5%B9%B6%E5%8F%91%E5%B8%83%E5%88%B0PyPI)
3. [使用 Sphinx 编写项目文档](/%E5%B7%A5%E5%85%B7/pip/#%E7%BB%99PyPI%E9%A1%B9%E7%9B%AE%E6%B7%BB%E5%8A%A0%E6%96%87%E6%A1%A3)
4. [Sphinx 主题与 Read the Docs](/%E5%B7%A5%E5%85%B7/pip/#sphinx-rtd-theme%E4%B8%BB%E9%A2%98)

## pip常用命令

安装包

```bash
pip3 install <package-name>
```

安装特定版本的包

```bash
pip3 install <package-name>==<version>
```

查看所有已安装包

```bash
pip3 list
```

卸载包

```bash
pip3 uninstall <package-name>
```

更新包

```bash
pip3 install --upgrade <package-name>
```

搜索包请使用[PyPI网站](https://pypi.org/search/)。PyPI已关闭`pip search`所依赖的XML-RPC搜索接口，不能再将该命令作为默认搜索办法；参见[pip说明](https://pip.pypa.io/en/stable/cli/pip_search/)。

## pip换清华源加快速度

临时使用

```bash
pip3 install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple some-package
```

设为默认

```bash
pip3 config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```

恢复该配置项为官方源（若仍被覆盖，使用`pip3 config debug`检查其他配置及环境变量）

```bash
pip3 config set global.index-url https://pypi.org/simple
```

## 创建一个库并发布到PyPI

这里我使用[uv 项目管理](/%E5%B7%A5%E5%85%B7/uv/)来管理项目。

### 创建项目

按照[GitHub 代码托管](/%E5%B7%A5%E5%85%B7/GitHub/)中的仓库管理体系创建仓库，并将项目clone到本地。

### 初始化项目

由于我要创建一个库，所以初始化时要加入`--lib`参数。

```bash
uv init --lib
```

### 安装依赖

```bash
uv add <package-name>
```

### 编写代码

在项目中编写代码，确保代码符合Python的规范。

### 编写`pyproject.toml`文件

参考[pip官方文档打包一个项目](https://packaging.python.org/en/latest/tutorials/packaging-projects/)

修改项目根目录下的`pyproject.toml`文件，用于描述项目的元数据和依赖信息。

其中，project-name为分发项目名，project-description为项目描述。分发名与Python导入模块名不必相同，但构建后端必须正确定位实际模块。`requires-python`应填写代码实际测试支持的版本，不能只改数字就宣称兼容旧版Python。

```toml pyproject.toml
[project]
name = "<project-name>"
version = "1.0.0"
description = "<project-description>"
readme = "README.md"
authors = [
    { name = "<username>", email = "<email>" }
]
requires-python = ">=3.8"
classifiers = [
    "Programming Language :: Python :: 3",
    "Operating System :: OS Independent",
]
license = "Apache-2.0"
license-files = ["LICENSE"]
dependencies = []

[project.urls]
Homepage = "https://github.com/<username>/<repository-name>"
Issues = "https://github.com/<username>/<repository-name>/issues"

[build-system]
requires = ["uv_build>=0.8.4,<0.9.0"]
build-backend = "uv_build"
```

使用`module-name`参数可以实现项目名和包名不同的效果，具体参考[uv官方文档build-backend部分](https://docs.astral.sh/uv/concepts/build-backend/#modules)。

```toml
[tool.uv.build-backend]
module-name = "<package-name>"
```

### 创建workflow

参考[uv官方文档GitHub Actions](https://docs.astral.sh/uv/guides/integration/github/)

创建workflow文件的目的是实现自动发布功能，为以后包的更新提供方便。

在`.github/workflows`目录下添加文件`publish-to-pypi.yml`文件，用于描述发布项目的工作流程。

文件内容如下：

```yml publish-to-pypi.yml
name: Publish to PyPI

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v6

      - name: Install dependencies
        run: uv sync

      - name: Build package
        run: uv build

      - name: Publish to PyPI
        uses: pypa/gh-action-pypi-publish@release/v1
        with:
          user: __token__
          password: ${{ secrets.PYPI_API_TOKEN }}
```

当匹配`v*`的tag被推送到GitHub时，workflow才会触发；只在本地创建tag不会触发。上面的示例使用API Token认证，不是Trusted Publishing。

### 添加Trusted Publisher Management

Trusted Publishing与API Token是两种不同的认证方式，不需要同时配置。选择Trusted Publishing时，在PyPI登记仓库和workflow文件名，并给发布job添加`permissions: { contents: read, id-token: write }`，同时删除发布步骤中的`user`和`password`。具体见[PyPI官方说明](https://docs.pypi.org/trusted-publishers/using-a-publisher/)。下面的Token两节只适用于保留上方Token工作流的情况。

注册一个PyPI账号，选择Publishing，添加Trusted Publisher。

![1.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/1.png)

添加GitHub Trusted Publisher。

![2.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/2.png)

这里最常见的问题就是撞名，没办法，一个一个试吧。

> **danger**
> PyPI项目名必须满足唯一性要求；已经上传过的分发文件名不能再次使用，即使文件后来被删除。删除不代表文件仍可下载，也不能靠删包重新上传同名文件。发布有误时通常应提高版本号重新构建，详见[Filename or contents already exists](https://pypi.org/help/#file-name-reuse)。

### 生成PyPI Token

在Account settings中生成token。

![3.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/3.png)

找到API tokens

![4.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/4.png)

按要求填写表单，生成token。项目已存在时优先限定到该项目，妥善保存，不要把令牌贴进代码、日志或截图。

![5.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/5.png)

### 将Token添加到GitHub Actions

在GitHub仓库中，选择Settings，选择Secrets and variables，选择Actions，点击New repository secret。

![6.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/6.png)

填写从PyPI账号获取的token。

![7.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/7.png)

### 发布项目

将匹配`v*`的tag推送到GitHub，才会触发上面的发布workflow；若在Gitee创建tag，需先确认镜像已将该tag同步到GitHub。也可在GitHub Actions中手动触发。

## 给PyPI项目添加文档

我使用的文档工具是[Sphinx](https://www.sphinx-doc.org/en/master/)，我使用的文档主题是[sphinx_rtd_theme](https://sphinx-rtd-theme.readthedocs.io/en/stable/)，我的文档发布平台是[Read the Docs](https://app.readthedocs.org/dashboard/)。

### Sphinx

#### 安装

```bash
uv add sphinx
```

#### 初始化

```bash
uv run sphinx-quickstart --sep docs
```

#### 配置

上面的`--sep`将源文件放入`docs/source`，与下文路径保持一致。若选择不分离source/build，必须相应调整路径。Python 3.10及更早版本还需安装`tomli`；MyST和主题插件需按后文先安装再构建。

配置项目信息，其中，通过代码获取版本号填入`release`变量。

```python conf.py
# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

import sys
from pathlib import Path

FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]  # 项目根目录

sys.path.insert(0, str(ROOT / "src"))

if sys.version_info >= (3, 11):
    # Python 3.11 或更高
    import tomllib as tomli
else:
    # Python 3.8 ~ 3.10
    import tomli

with open(ROOT / "pyproject.toml", "rb") as f:
    config = tomli.load(f)

project = "wliafe-mltools"
copyright = "2025, wliafe"
author = "wliafe"
release = config["project"]["version"]
```

添加Sphinx插件。

```python conf.py
# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.viewcode",
    "sphinx.ext.napoleon",
    "myst_parser",
    "sphinx_rtd_theme",
]

templates_path = ["_templates"]
exclude_patterns = []

language = "zh_CN"
```

设置html主题。

```python conf.py
# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]
```

#### 编写index.rst文件

在`.. toctree`下面列出自己编写的文档。

```rst index.rst
.. wliafe-mltools documentation master file, created by
   sphinx-quickstart on Fri Aug 22 14:27:37 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

欢迎查看 wliafe-mltools 文档
==========================================

.. toctree::
   :maxdepth: 1

   入门
   api
   历史版本

索引和表格
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
```

#### 自动生成API文档

使用`sphinx.ext.autodoc`和`sphinx.ext.napoleon`插件根据代码中的注释自动生成API文档。

在`conf.py`文件中添加插件。

编写`api.rst`文件，列出需要生成文档的模块。

```rst api.rst
API 文档
========

.. automodule:: mltools
   :members:
   :undoc-members:
   :show-inheritance:

.. autoclass:: mltools.learn.Epoch
   :members:
   :undoc-members:
   :show-inheritance:

.. autoclass:: mltools.utils.Timer
   :members:
   :undoc-members:
   :show-inheritance:

.. autoclass:: mltools.utils.Recorder
   :members:
   :undoc-members:
   :show-inheritance:

.. autoclass:: mltools.draw.Animator
   :members:
   :undoc-members:
   :show-inheritance:
```

将`api.rst`添加到`index.rst`中。

#### 使用Markdown编写文档

使用Markdown编写文档，需要安装`myst_parser`插件。

```bash
uv add myst_parser
```

在`conf.py`文件中添加插件。

编写Markdown文件，将Markdown文件名添加到`index.rst`。

#### 本地构建项目

在项目根目录下执行以下命令，构建项目。

```bash
uv run sphinx-build -M html docs/source docs/build
```

### sphinx_rtd_theme主题

#### 安装

```bash
uv add sphinx_rtd_theme
```

#### 配置

将主题作为插件添加到`conf.py`文件中。

将`conf.py`文件中的`html_theme`变量设置为`sphinx_rtd_theme`。

我使用的是主题的默认配置，如果想配置主题，参考[sphinx_rtd_theme](https://rtd.sphinx-doc.cn/en/stable/index.html)。

### Read the Docs

使用Github注册Read the Docs账号。

点击`Add project`，填写信息。

![8.png](/images/knowledge/%E5%B7%A5%E5%85%B7/pip/8.png)

在项目中添加`.readthedocs.yaml`文件用于Read the Docs构建项目。

```yaml .readthedocs.yaml
version: 2
build:
  os: ubuntu-24.04
  tools:
    python: '3.12'
sphinx:
  configuration: docs/source/conf.py
python:
  install:
  - requirements: docs/requirements.txt
  - requirements: requirements.txt
  - method: pip
    path: .
```

> **info**
> `requirements`接收requirements格式文件的路径，并不要求文件必须叫`requirements.txt`；`python.install`还支持安装当前项目，供autodoc导入。示例采用Python 3.12，具体版本应与项目和文档依赖相容。参见[Read the Docs配置文档](https://docs.readthedocs.com/platform/stable/config-file/v2.html)。
