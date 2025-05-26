本文首先列出我常用的环境命令方便我以后使用，然后介绍了conda的基本使用方法。

# 常用环境

## python 环境

```bash
conda create -n python310 python=3.10
```
```bash
conda activate python310
```

## pytorch 环境

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

## limu 环境(d2l 环境)

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

## pip 换清华源加快速度

临时使用

```bash
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple some-package
```

设为默认

```bash
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```

恢复默认源

```bash
pip config unset global.index-url
```

# 管理环境

## 创建环境

```bash
conda create -n env-name [list of package]
```
-n env-name是设置新建环境的名字

list of package是可选项，选择要为该环境安装的包。

如果我们没有指定安装python的版本，conda会安装我们最初安装conda时所装的那个版本的python。
    
创建特定python版本的包环境

```bash
conda create -n env-name python=3.6
```

## 激活环境

```bash
conda activate env-name
```

小技巧：新的开发环境会被默认安装在你conda目录下的envs文件目录下。你可以指定一个其他的路径

## 切换到base环境

退出当前环境

```bash
conda deactivate
```

## 复制一个环境

通过克隆来复制一个环境

```bash
conda create -n new-env-name --clone old-env-name
```

检查目前拥有的环境

```bash
conda env list
```

## 删除一个环境

```bash
conda env remove -n env-name
```

# 管理conda

## 获取版本号

```bash
conda --version
```

## 列出所有的环境

```bash
conda env list
```

## 查看conda当前环境下的包

```bash
conda list
```

## 查看环境管理的全部命令帮助

```bash
conda env -h
```

## conda升级

我们可以在命令行中或者anaconda prompt中执行命令进行操作。

```bash
conda update conda
```

```bash
conda update --all
```

## conda升级后释放空间

在升级完成之后，我们可以使用命令来清理一些无用的包以释放一些空间：

删除没有用的包

```bash
conda clean -p
```

删除保存下来的压缩文件（.tar）

```bash
conda clean -t
```

# 管理包

## 安装包 或 安装特定版本的包

```bash
conda install package-name
```

```bash
conda install package-name==version
```

## 查看所有已安装包

```bash
conda list
```

## 卸载包

```bash
conda remove package-name
```

## 更新包

更新一个包

```bash
conda update package-name
```

更新所有包

```bash
conda update --all
```

## 搜索包

```bash
conda search search-term
```

可以模糊搜索
