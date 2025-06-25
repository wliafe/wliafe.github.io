# Qt将控制台的输出信息实时显示到GUI界面上

将logging库与pyside6的Signal结合使用，可以轻而易举地将控制台的输出信息实时显示到GUI界面上，具体做法如下，其中QtHandler类是自定义的Signal类，用于将logging库的输出信息转换为Signal信号，从而实现将控制台的输出信息实时显示到GUI界面上。

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
    <width>400</width>
    <height>300</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>批量文字替换</string>
  </property>
  <widget class="QPushButton" name="folderSearchButton">
   <property name="geometry">
    <rect>
     <x>320</x>
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
     <width>221</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QLineEdit" name="oldWordLineEdit">
   <property name="geometry">
    <rect>
     <x>100</x>
     <y>40</y>
     <width>281</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QLineEdit" name="newWordLineEdit">
   <property name="geometry">
    <rect>
     <x>100</x>
     <y>70</y>
     <width>281</width>
     <height>21</height>
    </rect>
   </property>
  </widget>
  <widget class="QTextBrowser" name="textBrowser">
   <property name="geometry">
    <rect>
     <x>10</x>
     <y>131</y>
     <width>371</width>
     <height>161</height>
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
     <x>14</x>
     <y>100</y>
     <width>361</width>
     <height>24</height>
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
        Form.resize(400, 300)
        self.folderSearchButton = QPushButton(Form)
        self.folderSearchButton.setObjectName(u"folderSearchButton")
        self.folderSearchButton.setGeometry(QRect(320, 10, 61, 24))
        self.folderPathLineEdit = QLineEdit(Form)
        self.folderPathLineEdit.setObjectName(u"folderPathLineEdit")
        self.folderPathLineEdit.setGeometry(QRect(100, 10, 221, 21))
        self.oldWordLineEdit = QLineEdit(Form)
        self.oldWordLineEdit.setObjectName(u"oldWordLineEdit")
        self.oldWordLineEdit.setGeometry(QRect(100, 40, 281, 21))
        self.newWordLineEdit = QLineEdit(Form)
        self.newWordLineEdit.setObjectName(u"newWordLineEdit")
        self.newWordLineEdit.setGeometry(QRect(100, 70, 281, 21))
        self.textBrowser = QTextBrowser(Form)
        self.textBrowser.setObjectName(u"textBrowser")
        self.textBrowser.setGeometry(QRect(10, 131, 371, 161))
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
        self.runButton.setGeometry(QRect(14, 100, 361, 24))

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

import os
import logging
import pandas as pd
from docx import Document
from win32com import client


class Run:
    def __init__(self):
        # 设置日志
        self.logger = logging.getLogger()
        self.logger.setLevel(logging.DEBUG)
        # 设置日志格式
        self.formatter = logging.Formatter("%(asctime)s - %(levelname)s: %(message)s")

    def _batch_replace_excel_content(self, file_path, old_string, new_string):
        '''批量替换excel中的内容'''
        df = pd.read_excel(file_path)
        df.replace(old_string,  new_string, inplace=True)
        df.to_excel(file_path,  index=False)

    def _doc_to_docx(self, path):
        '''doc文件转换为docx文件'''
        if os.path.splitext(path)[1] == ".doc":
            word = client.Dispatch('Word.Application')
            doc = word.Documents.Open(path)  # 目标路径下的文件
            new_path = os.path.splitext(path)[0]+".docx"
            doc.SaveAs(new_path, 16)  # 转化后路径下的文件
            doc.Close()
            word.Quit()
            os.remove(path)
        return new_path

    def _batch_replace_word_content(self, file_path, old_word, new_word):
        '''批量替换word中的内容'''
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            for run in paragraph.runs:
                if old_word in run.text:
                    run.text = run.text.replace(old_word,  new_word)
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if old_word in cell.text:
                        cell.text = cell.text.replace(old_word, new_word)
        doc.save(file_path)

    def batch_replace_content(self, folder_path, old_word, new_word):
        '''批量替换文件内容'''
        for filename in os.listdir(folder_path):
            full_path = os.path.join(folder_path, filename)
            self.logger.info(full_path)
            if os.path.isfile(full_path):
                if full_path.endswith('.doc'):
                    full_path = self._doc_to_docx(full_path)
                if full_path.endswith('.docx'):
                    self._batch_replace_word_content(full_path, old_word, new_word)
                if full_path.endswith('.xlsx'):
                    self._batch_replace_excel_content(full_path, old_word, new_word)
            else:
                self.batch_replace_content(full_path, old_word, new_word)


if __name__ == '__main__':
    # 功能执行参数
    folder_path = 'C:\\Users\\Administrator\\Desktop\\project\\batch-replace-word\\2005陆梁新能源维护工程开工资料'
    old_word = '新疆西部明珠工程建设'
    new_word = '永升建设集团'
    run = Run()
    run.batch_replace_content(folder_path, old_word, new_word)

```

```python
# main.py

import sys
import logging
from PySide6.QtCore import Signal, QObject
from PySide6.QtWidgets import QApplication, QMainWindow, QFileDialog
from main_ui import Ui_Form
from run import Run


class QtHandler(logging.Handler, QObject):
    def __init__(self):
        logging.Handler.__init__(self)
        QObject.__init__(self)

    qt_signal = Signal(str)

    def emit(self, record):
        try:
            msg = self.format(record)
            self.qt_signal.emit(msg)
        except Exception:
            self.handleError(record)


class MainWindow(QMainWindow):
    def __init__(self):
        QMainWindow.__init__(self)
        self.run = Run()

        qt_handler = QtHandler()
        qt_handler.setLevel(logging.INFO)
        qt_handler.setFormatter(self.run.formatter)
        self.run.logger.addHandler(qt_handler)

        self.ui = Ui_Form()
        self.ui.setupUi(self)

        qt_handler.qt_signal.connect(self.ui.textBrowser.append)
        self.ui.folderSearchButton.clicked.connect(self.browse_folder)
        self.ui.runButton.clicked.connect(self.run_Button)

    
    def browse_folder(self):
        folder_path = QFileDialog.getExistingDirectory(self, '选择文件夹')
        if folder_path:
            self.ui.folderPathLineEdit.setText(folder_path)
    
    def run_Button(self):
        folder_path = self.ui.folderPathLineEdit.text()
        old_word = self.ui.oldWordLineEdit.text()
        new_word = self.ui.newWordLineEdit.text()
        self.run.batch_replace_content(folder_path, old_word, new_word)


if __name__ == '__main__':
    app = QApplication(sys.argv)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())
```