# Qt将控制台的输出信息实时显示到GUI界面上

将logging库与pyside6的Signal结合使用，可以轻而易举地将控制台的输出信息实时显示到GUI界面上，具体做法如下，其中QtHandler类是自定义的Signal类，用于将logging库的输出信息转换为Signal信号，从而实现将控制台的输出信息实时显示到GUI界面上。


```python
# test_ui.py

# -*- coding: utf-8 -*-

################################################################################
# Form generated from reading UI file 'test.ui'
##
# Created by: Qt User Interface Compiler version 6.9.0
##
# WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
                            QMetaObject, QObject, QPoint, QRect,
                            QSize, QTime, QUrl, Qt)
from PySide6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
                           QFont, QFontDatabase, QGradient, QIcon,
                           QImage, QKeySequence, QLinearGradient, QPainter,
                           QPalette, QPixmap, QRadialGradient, QTransform)
from PySide6.QtWidgets import (QApplication, QPushButton, QSizePolicy, QTextBrowser,
                               QWidget)


class Ui_Form(object):
    def setupUi(self, Form):
        if not Form.objectName():
            Form.setObjectName(u"Form")
        Form.resize(400, 300)
        self.train_button = QPushButton(Form)
        self.train_button.setObjectName(u"train_button")
        self.train_button.setGeometry(QRect(30, 220, 83, 22))
        self.textBrowser = QTextBrowser(Form)
        self.textBrowser.setObjectName(u"textBrowser")
        self.textBrowser.setGeometry(QRect(70, 10, 256, 192))
        self.test_button = QPushButton(Form)
        self.test_button.setObjectName(u"test_button")
        self.test_button.setGeometry(QRect(150, 220, 83, 22))
        self.predict_button = QPushButton(Form)
        self.predict_button.setObjectName(u"predict_button")
        self.predict_button.setGeometry(QRect(280, 220, 83, 22))

        self.retranslateUi(Form)

        QMetaObject.connectSlotsByName(Form)
    # setupUi

    def retranslateUi(self, Form):
        Form.setWindowTitle(QCoreApplication.translate("Form", u"Form", None))
        self.train_button.setText(QCoreApplication.translate("Form", u"train", None))
        self.test_button.setText(QCoreApplication.translate("Form", u"test", None))
        self.predict_button.setText(QCoreApplication.translate("Form", u"predict", None))
    # retranslateUi
```

```python
# run.py

import logging

class Run:
    def __init__(self):
        # 设置日志
        self.logger = logging.getLogger()
        self.logger.setLevel(logging.DEBUG)
        # 创建控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        # 设置日志格式
        self.formatter = logging.Formatter("%(asctime)s - %(levelname)s: %(message)s")
        console_handler.setFormatter(self.formatter)
        # 将处理器添加到日志记录器
        self.logger.addHandler(console_handler)

    def train(self):
        self.logger.info('train')
    
    def test(self):
        self.logger.info('test')
    
    def predict(self):
        self.logger.info('predict')
```

```python
# main.py

import sys
import logging
from PySide6.QtCore import Signal, QObject
from PySide6.QtWidgets import QApplication, QMainWindow
from test_ui import Ui_Form
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

        self.ui.train_button.clicked.connect(self.run.train)
        self.ui.test_button.clicked.connect(self.run.test)
        self.ui.predict_button.clicked.connect(self.run.predict)


if __name__ == '__main__':
    app = QApplication(sys.argv)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())
```