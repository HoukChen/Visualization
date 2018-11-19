# CRWEB
## 项目介绍
本项目提供了对CloudRAN相关算法的可视化，CloudRan云平台系统实现了一个交互式的网站，采用纯前端的方式开发，主要开发语言为JavaScript。用户可以通过向网站输入算法各个相应的参数，模拟相关算法的执行过程，获得各个算法执行结果或过程中某些数据的统计图，并在性能上满足网站对于一般量级数据访问的时间及性能需求。

## 部署环境
### 项目依赖
 - 本项目依赖前端框架[AdminLTE](https://adminlte.io/)
 - 本项目依赖前端图表框架[Echarts](http://echarts.baidu.com/)
 - 本项目依赖前端机器学习库[ML.js](https://github.com/mljs/ml)
 ### 项目运行
 - 本项目采用纯前端方式实现，可直接离线在浏览器运行（推荐使用chrome或firefox浏览器）
 - 本项目的浏览器运行入口（网站首页）为AdminLTE目录下的[starter.html](https://github.com/HoukChen/CRWEB/blob/master/AdminLTE/starter.html)文件
 
## 操作说明

### 参数配置
 - 上传参数文件: 参数文件格式需为json，待配置项参见参数格式部分。
- 手动输入参数: 该页面用来手动输入参数，或调整上传的参数文件。

### 结果展示
- 参数确认后点击【开始计算】，完成后自动跳转至结果显示页面，结果显示页面可下载算法结果至本地备用，也可以通过上传算法结果文件来直接展示算法结果图。
- 放置算法结果分两部分显示，一部分为全局统计信息，包括所有物理机上虚拟机的数目和物理机的利用率，该部分信息跳转时自动加载；另一部分为放置方案详细信息，可通过输入物理机编号自定义显示。
- 调整算法结果分两部分显示，一部分为全局统计信息，包括任务预测值和实际值对比图，调整过程中虚拟机数量，该部分信息跳转时自动加载；另一部分为详细历史信息，可通过输入时间范围自定义显示。
- 均衡算法的结果有三个方面的信息，第一部分为任务到来时间图，第二部分为虚拟机总负载变化时间图，第三部分为算法性能的比对信息图，以上统计信息均在跳转时自动加载。
- 多模基带算法的结果有三个方面的信息，第一部分为网络拓扑结构间小区流量走向图，第二部分为单板利用率图，第三部分为单板上各制式业务数量图，以上统计信息均在跳转时自动加载。

### 数据格式
- 虚拟机放置算法参考参数配置文件可从此处下载 [placement_parameter.json](https://github.com/HoukChen/CRWEB/blob/master/AdminLTE/Scripts/Placement/parameter.json) 文件
- 动态调整算法参考参数配置文件可从此处下载 [adjustment_parameter.json](https://github.com/HoukChen/CRWEB/blob/master/AdminLTE/Scripts/Adjustment/parameter.json) 文件
- 负载均衡算法参考参数配置文件可从此处下载 [balance_parameter.json](https://github.com/HoukChen/CRWEB/blob/master/AdminLTE/Scripts/Loadbalance/parameter.json) 文件
- 多模基带管理算法参考参数配置文件可从此处下载 [du_parameter.json](https://github.com/HoukChen/CRWEB/blob/master/AdminLTE/Scripts/DU/parameter.json) 文件

### 支持算法
- 【虚拟机放置算法】：给定虚拟机的规格和数量，物理机的规格和数量，展示最佳的虚拟机放置方案。
- 【动态调整算法】：给定任务产生的方式，虚拟机的规格和数量，展示任务负载在虚拟机上的调整方式。
- 【负载均衡算法】：给定任务产生的方式，虚拟机的规格和数量，展示任务负载在虚拟机上的均衡结果。
- 【多模基带管理算法】：给定背板带宽流量限制，不同制式小区数量，展示小区在单板间的调度方式。

## 问题
如对该项目代码有任何问题或者操作使用上有任何疑问，可联系 HoukChen@163.com
