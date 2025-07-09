---
title: pytorch
date: 2025-03-20 17:13:19
categories:
    - 机器学习
tags:
    - Python
---

pytorch是一个基于Python的科学计算库，它主要用于深度学习领域。

<!--more-->

## pytorch安装

### pytorch对应的python版本

安装最新版本的pytorch，可以直接去[官方文档](https://pytorch.ac.cn/)查看所需python版本和安装命令。

需要安装旧版的pytorch，就要查看旧版pytorch对应的python版本，官方提供的版本对照表不在官方文档中，而在GitHub源代码仓库里，这里是[版本对照表](https://github.com/pytorch/pytorch/blob/main/RELEASE.md#release-compatibility-matrix)，这里是[旧版pytorch 的安装命令](https://pytorch.ac.cn/get-started/previous-versions/)。

## 常用pytorch环境

### pytorch 环境

```bash
conda create -n pytorch python=3.10
```

```bash
conda activate pytorch
```

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
```

```bash
conda install jupyter
```

```bash
pip3 install pandas matplotlib
```

### limu 环境(d2l 环境)

```bash
conda create -n limu python=3.8
```

```bash
conda activate limu
```

```bash
conda install pytorch==2.1.0 torchvision==0.16.0 torchaudio==2.1.0 pytorch-cuda=12.1 -c pytorch -c nvidia
```

```bash
conda install jupyter==1.0.0
```

```bash
pip3 install d2l==0.17.5
```

开始学习机器学习了，关注哔哩哔哩的up主[跟李沐学AI](https://space.bilibili.com/1567748478)，学习 **【完结】动手学深度学习 PyTorch版** 合集视频。这篇博客是我对机器学习的补充。

配套资料[《动手学深度学习》](https://zh.d2l.ai/)

## pytorch环境搭建

官网下载[Miniconda](https://www.anaconda.com/download/success)脚本并安装。

pytorch环境搭建（参考[Conda](https://wliafe.github.io/post/Conda.html)）

## flask应用

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
