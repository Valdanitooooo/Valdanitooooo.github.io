---
layout: post
title: '百度飞桨课程学习心得之计算机视觉'
categories: develop
tags: 深度学习 PaddlePaddle 计算机视觉
---

* content
{:toc}

## 什么是计算机视觉

计算机视觉本质上就是研究视觉感知问题。视觉感知，根据维基百科中的定义, 是指对“环境表达和理解中，对视觉信息的组织、识别和解释的过程”。根据这种定义，计算机视觉的目标是对环境的表达和理解，核心问题是研究如何对输入的图像信息进行组织，对物体和场景进行识别，进而对图像内容给予解释。

## 什么是卷积神经网络
卷积神经网络是一种前馈神经网络，它的人工神经元可以响应一部分覆盖范围内的周围单元，对于大型图像处理有出色表现。

卷积神经网络由一个或多个卷积层和顶端的全连通层（对应经典的神经网络）组成，同时也包括关联权重和池化层（pooling layer）。这一结构使得卷积神经网络能够利用输入数据的二维结构。与其他深度学习结构相比，卷积神经网络在图像和语音识别方面能够给出更好的结果。这一模型也可以使用反向传播算法进行训练。相比较其他深度、前馈神经网络，卷积神经网络需要考量的参数更少，使之成为一种颇具吸引力的深度学习结构。





## 百度飞桨的课程中的计算机视觉
课程地址这里不发了(帖子总是待审核)， 百度一下，你就知道。
### 案例——图像中物体边缘检测
对于真实的图片，可以使用合适的卷积核对它进行操作，用来检测物体的外形轮廓，观察输出特征图跟原图之间的对应关系，如下代码所示：

```python
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import paddle
import paddle.fluid as fluid
from paddle.fluid.dygraph.nn import Conv2D
from paddle.fluid.initializer import NumpyArrayInitializer

img = Image.open('./work/images/section1/000000098520.jpg')
with fluid.dygraph.guard():
    # 设置卷积核参数
    w = np.array([[-1,-1,-1], [-1,8,-1], [-1,-1,-1]], dtype='float32')/8
    w = w.reshape([1, 1, 3, 3])
    # 由于输入通道数是3，将卷积核的形状从[1,1,3,3]调整为[1,3,3,3]
    w = np.repeat(w, 3, axis=1)
    # 创建卷积算子，输出通道数为1，卷积核大小为3x3，
    # 并使用上面的设置好的数值作为卷积核权重的初始化参数
    conv = Conv2D(num_channels=3, num_filters=1, filter_size=[3, 3], 
            param_attr=fluid.ParamAttr(
              initializer=NumpyArrayInitializer(value=w)))
    
    # 将读入的图片转化为float32类型的numpy.ndarray
    x = np.array(img).astype('float32')
    # 图片读入成ndarry时，形状是[H, W, 3]，
    # 将通道这一维度调整到最前面
    x = np.transpose(x, (2,0,1))
    # 将数据形状调整为[N, C, H, W]格式
    x = x.reshape(1, 3, img.height, img.width)
    x = fluid.dygraph.to_variable(x)
    y = conv(x)
    out = y.numpy()

plt.figure(figsize=(20, 10))
f = plt.subplot(121)
f.set_title('input image', fontsize=15)
plt.imshow(img)
f = plt.subplot(122)
f.set_title('output feature map', fontsize=15)
plt.imshow(out.squeeze(), cmap='gray')
plt.show()
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200829225905423.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM3NTQ2NTI5,size_16,color_FFFFFF,t_70#pic_center)

## 学习感受

### 课程内容结构清晰
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200829224120189.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM3NTQ2NTI5,size_16,color_FFFFFF,t_70#pic_center)

notebook的形式非常易读易操作，学习体验非常好，并且百度提供了免费的学习环境，随时可以把代码跑起来看到效果👍。

总的来说课程光是文字描述的就很清晰了，再加上很多视频课程，只要认真学就可以学会。

### 快速上手
我们在平时开发中，在学一些东西的时候，如果花了两个小时还没跑起来，那学习的兴趣会极速下降。尤其对一些入门的知识，如果不能快速实践起来，光是看枯燥的文档，提升的会比较慢。百度aistudio的平台已经非常成熟，社区也很活跃，非常适合新手入门前沿的AI知识和技术。
