# 面向对象
服务端和前端共用类，WebSocket 实时通信，多人网络实时应用

## Robot 类
机器人类，行走和转向的方法
支持匀速运动和匀变速运动
支持运动中改变速度
跟随鼠标运动
寻路算法躲过障碍物

## Board 类
机器人运动的场景类
支持显示尺寸的放缩

## Pointer 类
位置类

# CMD规范
编译后前端使用


```

browserify ./src/app.js -o ./dist/bundle.js

uglify ./dist/bundle.js -c -o ./dist/bundle.min.js

```
