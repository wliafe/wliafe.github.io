---
title: Qt for Python
date: 2025-05-27 17:25:19
categories:
    - Qt
tags:
    - Python
---

Qt框架是一个跨平台的C++应用程序开发框架，由Qt公司开发。Qt框架提供了一组丰富的GUI组件和工具，用于开发Windows、Linux、macOS等操作系统的应用程序。Qt for Python也叫Pyside，是一个基于Qt框架的Python绑定库，它可以让Python开发者使用C++编写的Qt应用程序。

<!--more-->

### python 环境

```bash
conda create -n python310 python=3.10
```

```bash
conda activate python310
```

qt 环境

```bash
pip3 install pyside6
```

## Qt for Python 环境搭建

### 安装基础环境（Linux）

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

### 安装 Qt

官网下载[Qt安装软件](https://www.qt.io/download-qt-installer-oss)

### 安装 Miniconda

官网下载[Miniconda脚本](https://www.anaconda.com/download/success)

### 创建 Qt 环境

```bash
conda create -n qt python=3.10
```

```bash
conda activate qt
```

### 安装 Qt for Python

```bash
pip install pyside6
```

### 解决输出界面所有中文乱码中部分的乱码问题(标题乱码未解决)（Linux）

```bash
sudo apt-get install fonts-noto-cjk
```

### 解决 wayland 错误（Linux）

>Failed to create wl_display (No such file or directory)
>qt.qpa.plugin: Could not load the Qt platform plugin "wayland" in "" even though it was found.

在代码中加入下面这一行

```python
import os
os.environ['QT_QPA_PLATFORM'] = 'xcb'
```

## Qt 打包

使用 pyside6-deploy 打包 exe 文件时，可以通过修改 nuitka 的一些参数来达到想要的效果

### pyside6-deploy 打包 exe 不显示终端窗口

这里假设你的主文件是 main.py 文件。

生成打包配置文件 pysidedeploy.spec

```bash
pyside6-deploy --init
```

在 pysidedeploy.spec 文件中 [nuitka] 的 extra_args 中添加下面的参数

```bash
--windows-console-mode=disable
```

运行打包命令

```bash
pyside6-deploy
```

## Qt将控制台的输出信息实时显示到GUI界面上

这是一个批量替换文件字符的例子，这个例子包含两个功能：

- 将logging库与pyside6结合使用，使控制台的输出信息实时显示到GUI界面上
- pyside6使用浏览的方式，获取文件目录
- pyside6使用主线程更新界面，使用子线程执行run函数

```xml
# main.ui

<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>Form</class>
 <widget class="QWidget" name="Form">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>719</width>
    <height>569</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>批量文字替换</string>
  </property>
  <widget class="QPushButton" name="folderSearchButton">
   <property name="geometry">
    <rect>
     <x>630</x>
     <y>10</y>
     <width>61</width>
     <height>24</height>
    </rect>
   </property>
   <property name="text">
    <string>浏览</string>
   </property>
  </widget>
  <widget class="QLineEdit" name="folderPathLineEdit">
   <property name="geometry">
    <rect>
     <x>100</x>
     <y>10</y>
     <width>521</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QLineEdit" name="oldWordLineEdit">
   <property name="geometry">
    <rect>
     <x>100</x>
     <y>40</y>
     <width>591</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QLineEdit" name="newWordLineEdit">
   <property name="geometry">
    <rect>
     <x>100</x>
     <y>70</y>
     <width>591</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QTextBrowser" name="textBrowser">
   <property name="geometry">
    <rect>
     <x>10</x>
     <y>140</y>
     <width>691</width>
     <height>421</height>
    </rect>
   </property>
  </widget>
  <widget class="QLabel" name="folderPathLabel">
   <property name="geometry">
    <rect>
     <x>10</x>
     <y>10</y>
     <width>71</width>
     <height>20</height>
    </rect>
   </property>
   <property name="text">
    <string>文件路径</string>
   </property>
   <property name="alignment">
    <set>Qt::AlignmentFlag::AlignCenter</set>
   </property>
  </widget>
  <widget class="QLabel" name="oldWordLabel">
   <property name="geometry">
    <rect>
     <x>10</x>
     <y>40</y>
     <width>71</width>
     <height>20</height>
    </rect>
   </property>
   <property name="text">
    <string>查找内容</string>
   </property>
   <property name="alignment">
    <set>Qt::AlignmentFlag::AlignCenter</set>
   </property>
  </widget>
  <widget class="QLabel" name="newWordLabel">
   <property name="geometry">
    <rect>
     <x>10</x>
     <y>70</y>
     <width>71</width>
     <height>20</height>
    </rect>
   </property>
   <property name="text">
    <string>替换为</string>
   </property>
   <property name="alignment">
    <set>Qt::AlignmentFlag::AlignCenter</set>
   </property>
  </widget>
  <widget class="QPushButton" name="runButton">
   <property name="geometry">
    <rect>
     <x>10</x>
     <y>100</y>
     <width>681</width>
     <height>31</height>
    </rect>
   </property>
   <property name="text">
    <string>开始执行</string>
   </property>
  </widget>
 </widget>
 <resources/>
 <connections/>
</ui>
```

```python
# main_ui.py

# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'main.ui'
##
## Created by: Qt User Interface Compiler version 6.9.1
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PySide6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PySide6.QtWidgets import (QApplication, QLabel, QLineEdit, QPushButton,
    QSizePolicy, QTextBrowser, QWidget)

class Ui_Form(object):
    def setupUi(self, Form):
        if not Form.objectName():
            Form.setObjectName(u"Form")
        Form.resize(719, 569)
        self.folderSearchButton = QPushButton(Form)
        self.folderSearchButton.setObjectName(u"folderSearchButton")
        self.folderSearchButton.setGeometry(QRect(630, 10, 61, 24))
        self.folderPathLineEdit = QLineEdit(Form)
        self.folderPathLineEdit.setObjectName(u"folderPathLineEdit")
        self.folderPathLineEdit.setGeometry(QRect(100, 10, 521, 21))
        self.oldWordLineEdit = QLineEdit(Form)
        self.oldWordLineEdit.setObjectName(u"oldWordLineEdit")
        self.oldWordLineEdit.setGeometry(QRect(100, 40, 591, 21))
        self.newWordLineEdit = QLineEdit(Form)
        self.newWordLineEdit.setObjectName(u"newWordLineEdit")
        self.newWordLineEdit.setGeometry(QRect(100, 70, 591, 21))
        self.textBrowser = QTextBrowser(Form)
        self.textBrowser.setObjectName(u"textBrowser")
        self.textBrowser.setGeometry(QRect(10, 140, 691, 421))
        self.folderPathLabel = QLabel(Form)
        self.folderPathLabel.setObjectName(u"folderPathLabel")
        self.folderPathLabel.setGeometry(QRect(10, 10, 71, 20))
        self.folderPathLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.oldWordLabel = QLabel(Form)
        self.oldWordLabel.setObjectName(u"oldWordLabel")
        self.oldWordLabel.setGeometry(QRect(10, 40, 71, 20))
        self.oldWordLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.newWordLabel = QLabel(Form)
        self.newWordLabel.setObjectName(u"newWordLabel")
        self.newWordLabel.setGeometry(QRect(10, 70, 71, 20))
        self.newWordLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.runButton = QPushButton(Form)
        self.runButton.setObjectName(u"runButton")
        self.runButton.setGeometry(QRect(10, 100, 681, 31))

        self.retranslateUi(Form)

        QMetaObject.connectSlotsByName(Form)
    # setupUi

    def retranslateUi(self, Form):
        Form.setWindowTitle(QCoreApplication.translate("Form", u"\u6279\u91cf\u6587\u5b57\u66ff\u6362", None))
        self.folderSearchButton.setText(QCoreApplication.translate("Form", u"\u6d4f\u89c8", None))
        self.folderPathLabel.setText(QCoreApplication.translate("Form", u"\u6587\u4ef6\u8def\u5f84", None))
        self.oldWordLabel.setText(QCoreApplication.translate("Form", u"\u67e5\u627e\u5185\u5bb9", None))
        self.newWordLabel.setText(QCoreApplication.translate("Form", u"\u66ff\u6362\u4e3a", None))
        self.runButton.setText(QCoreApplication.translate("Form", u"\u5f00\u59cb\u6267\u884c", None))
    # retranslateUi
```

```python
# run.py

import logging
from pathlib import Path
import win32com.client as win32


class BaseRun:
    def __init__(self):
        # 设置日志
        self.logger = logging.getLogger()
        self.logger.setLevel(logging.DEBUG)
        # 设置日志格式
        self.formatter = logging.Formatter("%(asctime)s - %(levelname)s: %(message)s")
        # 创建控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(self.formatter)
        self.logger.addHandler(console_handler)


class Run(BaseRun):
    def replace_word_content(self, file_path, old_word, new_word):
        '''替换word文件内容'''
        wps_word = win32.gencache.EnsureDispatch('KWPS.Application')  # 创建 WPS 文字应用程序对象
        wps_word.Visible = False  # 让 WPS 窗口不可见
        doc = wps_word.Documents.Open(file_path)  # 打开指定的 WPS 文字文件
        doc.Content.Find.Execute(FindText=old_word, ReplaceWith=new_word, Replace=2)  # 替换文本
        doc.Save()  # 保存文档
        doc.Close()  # 关闭文档
        wps_word.Quit()  # 退出 WPS 文字应用程序

    def replace_excel_content(self, file_path, old_text, new_text):
        '''替换excel文件内容'''
        wps = win32.gencache.EnsureDispatch('KET.Application')  # 创建 WPS 表格应用程序对象
        wps.Visible = False  # 使 WPS 表格窗口不可见（可选）
        workbook = wps.Workbooks.Open(file_path)  # 打开指定的 WPS 表格文件
        for sheet in workbook.Sheets:
            cells = sheet.UsedRange
            cells.Replace(What=old_text, Replacement=new_text, LookAt=win32.constants.xlPart, SearchOrder=win32.constants.xlByRows, MatchCase=False, SearchFormat=False, ReplaceFormat=False)
        # 保存并关闭工作簿
        workbook.Save()
        workbook.Close()
        wps.Quit()

    def batch_replace_content(self, folder_path, old_word, new_word):
        '''批量替换文件内容'''
        folder_path = Path(folder_path)
        for filename in folder_path.iterdir():
            full_path = folder_path / filename
            if full_path.is_dir():
                self.batch_replace_content(str(full_path), old_word, new_word)
            else:
                if full_path.suffix == '.docx' or full_path.suffix == '.doc':
                    self.logger.info(f'替换文件{full_path}内容')
                    self.replace_word_content(str(full_path), old_word, new_word)
                elif full_path.suffix == '.xlsx' or full_path.suffix == '.xls':
                    self.logger.info(f'替换文件{full_path}内容')
                    self.replace_excel_content(str(full_path), old_word, new_word)
                else:
                    self.logger.info(f'文件{full_path}后缀名不在替换范围内')

    def run(self, folder_path, old_word, new_word):
        '''运行程序'''
        self.logger.info('替换开始')
        self.batch_replace_content(folder_path, old_word, new_word)
        self.logger.info('替换完成')


if __name__ == '__main__':
    # 功能执行参数
    folder_path = r''
    old_word = ''
    new_word = ''
    run = Run()
    run.run(folder_path, old_word, new_word)
```

```python
# main.py

import sys
import logging
from PySide6.QtCore import Signal, QObject, QThread
from PySide6.QtWidgets import QApplication, QMainWindow, QFileDialog
from main_ui import Ui_Form
from run import Run


class QTextBrowserHandler(logging.Handler, QObject):
    '''自定义Qt日志处理器'''
    signal = Signal(str)

    def __init__(self):
        '''初始化'''
        logging.Handler.__init__(self)
        QObject.__init__(self)

    def emit(self, record):
        '''重写日志输出方法'''
        msg = self.format(record)
        self.signal.emit(msg)


class QWorkThread(QThread):
    '''自定义Qt线程'''

    def set_run(self, run):
        '''设置线程执行函数'''
        self.run = run


class MainWindow(QMainWindow):
    '''自定义Qt主窗口'''

    def __init__(self):
        '''初始化'''
        QMainWindow.__init__(self)
        # 初始化界面
        self.ui = Ui_Form()
        self.ui.setupUi(self)
        # 定义执行函数
        self.run = Run()
        # 添加qt日志输出
        qt_handler = QTextBrowserHandler()
        qt_handler.setLevel(logging.INFO)
        qt_handler.setFormatter(self.run.formatter)
        self.run.logger.addHandler(qt_handler)
        # 定义执行线程
        self.thread = QWorkThread(self)
        # 事件绑定
        qt_handler.signal.connect(self.ui.textBrowser.append)
        self.ui.folderSearchButton.clicked.connect(self.browse_folder)
        self.ui.runButton.clicked.connect(self.start_replace)

    def browse_folder(self):
        '''选择文件夹'''
        folder_path = QFileDialog.getExistingDirectory(self, '选择文件夹')
        if folder_path:
            self.ui.folderPathLineEdit.setText(folder_path)

    def start_replace(self):
        '''开始替换'''
        folder_path = self.ui.folderPathLineEdit.text()
        old_word = self.ui.oldWordLineEdit.text()
        new_word = self.ui.newWordLineEdit.text()
        self.thread.set_run(lambda: self.run.run(folder_path, old_word, new_word))
        self.thread.start() # 线程启动，执行run函数


if __name__ == '__main__':
    app = QApplication(sys.argv)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())
```
