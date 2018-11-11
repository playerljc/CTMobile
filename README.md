# CTMobile
CtMobie移动端开发框架，适用于WebApp，混合开发Hybrid，Cordova
## 开发模式
1.inline
2.ajax
## 安装
npm install ctmobile --save-dev
## 快速开始
1.基本结构
<div ct-data-role="page" id="index" opt="index">
  <header>
    <p class="ct-header-title">CtMobile Demo</p>
  </header>
  <div class="ct-content" style="top:3rem;bottom:0;">
    <ul>
      <li><a class="link" ct-pageId="devmode">开发模式</a></li>
      <li><a class="link" ct-pageId="return">返回</a></li>
      <li><a class="link" ct-pageId="startmode">启动模式</a></li>
      <li><a class="link" ct-pageId="parameter">界面传递参数</a></li>
      <li><a class="link" ct-pageId="transition">页面转场</a></li>
      <li><a class="link" ct-pageId="borasdcast">广播</a></li>
    </ul>
  </div>
</div>

