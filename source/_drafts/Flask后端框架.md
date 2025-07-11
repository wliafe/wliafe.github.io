---
title: Flask后端框架
date: 2024-03-06 11:08:53
categories:
    - 后端
tags:
    - Python
---

Flask是一个简单的Python后端框架，用于构建简单的Python后端Web应用程序。它提供了基本的路由、请求处理和响应机制，使开发人员能够专注于业务逻辑而不是底层实现。

<!--more-->

## Flask应用

```py
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/predictTest', methods=['POST'])
def predictTest():
    image = request.files['image']
    image_tensor = transform(Image.open(image).convert('RGB')).unsqueeze(0)
    net.load_state_dict(torch.load(model_path, map_location=device))
    predicted_class = ML.image_classification_predict(net, labels, image_tensor, device)
    return render_template('predict.html', predicted_class=predicted_class)


@app.route('/predict', methods=['POST'])
def predict():
    image = request.files['image']
    image_tensor = transform(Image.open(image).convert('RGB')).unsqueeze(0)
    net.load_state_dict(torch.load(model_path, map_location=device))
    predicted_class = ML.image_classification_predict(net, labels, image_tensor, device)
    data = {'predicted_class': predicted_class}
    response = jsonify(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
```
