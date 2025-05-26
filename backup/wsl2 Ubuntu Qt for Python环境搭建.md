# 安装基础环境

```bash
sudo apt update
```
```bash
sudo apt upgrade
```
```bash
sudo apt-get install libxcb-*
```
```bash
sudo apt-get install libxkbcommon-x11-0
```

# 安装 Qt

官网下载[Qt安装软件](https://www.qt.io/download-qt-installer-oss)

# 安装 Miniconda

官网下载[Miniconda脚本](https://www.anaconda.com/download/success)

# 创建 Qt 环境

```bash
conda create -n qt python=3.10
```
```bash
conda activate qt
```

# 安装 Qt

```bash
pip install pyside6
```

# 解决输出界面所有中文乱码中部分的乱码问题(标题乱码未解决)

```bash
sudo apt-get install fonts-noto-cjk
```

# 解决wayland 错误 

>Failed to create wl_display (No such file or directory)
>qt.qpa.plugin: Could not load the Qt platform plugin "wayland" in "" even though it was found.

```bash
export QT_QPA_PLATFORM=xcb
```
