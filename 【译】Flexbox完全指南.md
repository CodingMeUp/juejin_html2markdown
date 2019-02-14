[

](/post/5c4ef49b518825273e7339f9)

[](/post/5c4ef49b518825273e7339f9)

2019年01月28日阅读 567

【译】Flexbox完全指南
==============

#### 该文章为原创翻译，原文可访问[A Complete Guide to Flexbox](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fsnippets%2Fcss%2Fa-guide-to-flexbox%2F)。

本人能力尚缺，经验稍浅，翻译中存在的不足之处望大家批评指正，以便及时更正。  
邮箱：440981b05j0.cdb@sina.cn  
Github:[Duggud](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2FDuggud)

>   文章描述的是CSS flexbox布局综合指南。该完全指南解释了有关flexbox的所有内容，重点介绍了父元素（flex容器）和子元素（flex项目）的所有可能的不同属性。它还包括历史记录，演示，模式和浏览器支持图表。

背景
--

  Flexbox布局（灵活盒子）模块（[截至2017年10月的W3C候选推荐标准](https://link.juejin.im?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fcss-flexbox%2F)）旨在提供一种更有效的方式来布置，对齐和分配容器中项目之间的空间，即使它们的大小未知或是动态变化的（ 这也是“flex”这个词的由来）。

  Flex布局的主要思想是使容器能够改变其项目的宽度、高度以及顺序，以最好地填充可用空间（主要是为了适应所有类型的显示设备和屏幕尺寸）。Flex容器扩展项目以填充可用空间，或缩小它们以防止溢出。

  最重要的是，与常规布局（基于垂直的块和基于水平的内联块）相反，flexbox布局与方向无关。虽然前者适用于页面，但它缺乏灵活性来支持大型或复杂的应用程序（特别是在方向更改，调整大小，拉伸，缩小等方面）。

  **注意**：Flexbox布局最适合应用程序的组件和小规模布局，而[Grid布局](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fsnippets%2Fcss%2Fcomplete-guide-grid%2F)则适用于更大规模的布局。

基础与术语
-----

                **父的属性（弹性容器)**

                **子的属性（弹性项目）**

### display

  这定义了一个flex容器;内联或块取决于给定的值。它为所有直接子项目提供了flex上下文。

    <!--css-->
    .container {
      display: flex; /* or inline-flex */
    }
    复制代码

  **注意**: CSS列对flex容器没有影响。

### order

  默认情况下，flex项目按源顺序排列。但是，_order_属性可以控制它们在Flex容器中的显示顺序。

### flex-direction

  这将建立主轴（main-axis），从而定义Flex项目放置在Flex容器中的方向。除了可选wrapping外，flexbox采用单向布局概念。可以将flex项看作是水平行或垂直列的布局。

    <!--css-->
    .container {
      flex-direction: row | row-reverse | column | column-reverse;
    }
    复制代码

*   _row_(默认): _ltr_表示从左至右；_rtl_表示从右至左；
*   _row-reverse_（反向行: _rtl_表示从左至右；_ltr_表示从右至左;
*   _column_: 与_row_一样，只是方向从上至下；
*   _column reserse_: 与_row reserse_一样，只是方向从下至上。

### flex-wrap

  默认情况下，flex项目都会尝试在一行中自适应布局。你可以根据需要利用此属性更改它并允许项目进行换行。

    <!--css-->
    .container{
      flex-wrap: nowrap | wrap | wrap-reverse;
    }
    复制代码

*   _nowrap_: 所有的flex项目会在同一行；
*   _wrap_: flex项目将从上到下被换行成多行；
*   _wrap-reverse_：flex项目将从下到上被换行成多行；

  更多可视化_flex-wrap_例程可访问[visual demos of flex-wrap here](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Falmanac%2Fproperties%2Ff%2Fflex-wrap%2F)

### flex-flow（适用于父flex元素）

  这是一个简写的_flex-direction_和_flex-wrap_属性，它们共同定义了flex容器的主轴(main-axis)和交叉轴(across-axis)。默认值为 _row nowrap_。

    <!--css-->
    flex-flow: <‘flex-direction’> || <‘flex-wrap’>
    复制代码

### flex-grow

  这定义了flex项在必要时增长的能力。可取无单位值作为比例值。它规定了项目应该占用flex容器内可用空间的数量。如果所有项目都将_flex-grow_设置为1，则容器中的剩余空间将平均分配给所有子项目。如果其中一个子项目的值设为2，那么将占用两倍于其他子项目的空间(或者至少会尝试这样做)。

    <!--css-->
    .item {
      flex-grow: <number>; /* default 0 */
    }
    复制代码

  _flex-grow_设置为负值时无效。

### flex-shrink

  这定义了flex项在必要时收缩的能力。

    <!--css-->
    .item {
      flex-shrink: <number>; /* default 1 */
    }
    复制代码

  _flex-shrink_设置为负值时无效。

### flex-basis

这定义了剩余空间分布之前元素的默认大小。它可以是长度（例如20％，5rem等）或关键字。_auto_关键字的意思是“查看我的宽度或高度属性”(这是由_main-size_关键字临时完成的，直到弃用)。 _content_关键字的意思是“根据项目的内容调整大小”，这个关键字还没有得到很好的支持，因此很难测试它，也很难知道它的兄弟属性_max-content_、_min-content_和_fit-content_的功能。

    <!--css-->
    .item {
      flex-basis: <length> | auto; /* default auto */
    }
    复制代码

  如果设置为0，则不考虑内容周围的额外空间。如果设置为auto，则根据其弹性增长值分布额外的空间。点击查看[示例图表](https://link.juejin.im?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fcss-flexbox-1%2Fimages%2Frel-vs-abs-flex.svg)。

### flex

  这是_flex-grow_、_flex-shrink_和_flex-basis_组合的简写。第二个和第三个参数(_flex-shrink_和_flex-basis_)是可选的。默认值是_0 1 auto_。

    <!--css-->
    .item {
      flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
    }
    复制代码

  建议你使用这个简写属性，而不是设置各个独立属性。简写可以智能地设置其他值。

### justify-content

  这定义了沿主轴的对齐方式。当一行中的所有flex项无论是不灵活的，或者是灵活的但已经达到自身最大值时，它可以帮助分配剩余的可用空间。此外，当flex项目溢出行时,它还对对齐方式进行了一些控制。

    <!--css-->
    .container {
      justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
    }
    复制代码

*   _flex-start_: flex项目在行开始处紧密排列；
*   _flex-end_：flex项目在行结尾处紧密排列；
*   _center_：flex项目行居中排列；
*   _space-between_：flex项目均匀分布;第一项在起始行，最后一项在结束行；
*   _space-around_：flex项目在行中均匀分布，项目周围的空间相等。注意，咋一看，空间是不相等的，因为**所有的项在两边都有相等的空间**。第一项在容器边缘有一个单位的空间，但是与下一项之间有两个单位的空间，因为下一项有它自身空间。

### align-self

  这允许为单个flex项目重置默认的对齐方式(或由align-items指定的对齐方式)。

  请参阅_align-items_说明以了解可用的值。

    <!--css-->
    .item {
      align-self: auto | flex-start | flex-end | center | baseline | stretch;
    }
    复制代码

**注意**: _float_、_clear_和_vertical-align_对flex项没有影响。

### align-items

  这定义了flex项在当前行的cross- axis轴(c垂直于main-axis轴)上布局的默认行为。可以将其视为justify-content作用于cross- axis轴的版本。

    <!--css-->
    .container {
      align-items: stretch | flex-start | flex-end | center | baseline;
    }
    复制代码

*   _stretch_ (default): 拉伸以填充容器(仍然遵循最小宽度/最大宽度)
*   _flex-start_: flex项目的横轴方向起始边距（margin）边缘位于横轴起始行处；
*   _flex-end_:flex项目的横轴方向结束边距（margin）边缘位于横轴结尾行处；
*   _center_: flex项目沿横轴居中对齐；
*   _baseline_: flex项目根据_baseline_基线对齐；

### align-content

  当cross-axis轴存在额外空间时，这会对flex项目沿cross-axis轴进行行对齐，类似于_justify-content_沿main-axis轴对flex项目进行对齐。

  **注意**:当只有flex项目只有一行时，此属性不起作用。

    <!--css-->
    .container {
      align-content: flex-start | flex-end | center | space-between | space-around | stretch;
    }
    复制代码

*   _flex-start_: 行于flex容器开始处紧密排列；
*   _flex-end_: 行于flex容器末尾处紧密排列；
*   _center_: 行于flex容器居中紧密排列；
*   _space-between_: 行均匀分布;第一行位于容器的开末尾头，而最后一行位于容器的末尾；
*   _space-around_:行均匀分布，每行周围的空间相等；
*   _stretch_ (default): 行伸展以占据剩余空间。

例子
--

  让我们以一个非常简单的例子开始，解决一个几乎每天都会遇到的问题:完美居中。如果您使用flexbox，它将变得不能更简单。

    <!--css-->
    .parent {
      display: flex;
      height: 300px; /* Or whatever */
    }
    
    .child {
      width: 100px;  /* Or whatever */
      height: 100px; /* Or whatever */
      margin: auto;  /* Magic! */
    }
    复制代码

  这取决于flex容器中设置为“_auto_”的_margin_会吸收额外的空间。因此，设置垂直边距为_auto_将使项目完美地在两个轴上居中排列。

  现在让我们添加更多的属性。考虑一个包含6个项目的列表，它们的尺寸都是固定的，但是可以自动调整大小。我们希望它们均匀地分布在横轴上，以便在调整浏览器大小时一切正常(不使用媒体查询!)。

    <!--css-->
    .flex-container {
      /* We first create a flex layout context */
      display: flex;
      
      /* Then we define the flow direction 
         and if we allow the items to wrap 
       * Remember this is the same as:
       * flex-direction: row;
       * flex-wrap: wrap;
       */
      flex-flow: row wrap;
      
      /* Then we define how is distributed the remaining space */
      justify-content: space-around;
    }
    复制代码

  Done.其他都只是一些样式问题。下面是一个测试例程。请访问CodePen，试着调整窗口大小，看看会发生什么。

  我们试下别的例子。想象一下，我们的网站顶部有一个靠右对齐的导航，但我们希望它中型屏幕上居中，在小型设备上则呈现为单列导航。这也足够简单。

    <!--css-->
    /* Large */
    .navigation {
      display: flex;
      flex-flow: row wrap;
      /* This aligns items to the end line on main-axis */
      justify-content: flex-end;
    }
    
    /* Medium screens */
    @media all and (max-width: 800px) {
      .navigation {
        /* When on medium sized screens, we center it by evenly distributing empty space around items */
        justify-content: space-around;
      }
    }
    
    /* Small screens */
    @media all and (max-width: 500px) {
      .navigation {
        /* On small screens, we are no longer using row direction but column */
        flex-direction: column;
      }
    }
    复制代码

  让我们使用flex项目的灵活性来做更好的实现!比如移动优先的3列布局，具有全宽度的页眉和页脚。与源顺序无关。

    <!--css-->
    .wrapper {
      display: flex;
      flex-flow: row wrap;
    }
    
    /* We tell all items to be 100% width, via flex-basis */
    .wrapper > * {
      flex: 1 100%;
    }
    
    /* We rely on source order for mobile-first approach
     * in this case:
     * 1. header
     * 2. article
     * 3. aside 1
     * 4. aside 2
     * 5. footer
     */
    
    /* Medium screens */
    @media all and (min-width: 600px) {
      /* We tell both sidebars to share a row */
      .aside { flex: 1 auto; }
    }
    
    /* Large screens */
    @media all and (min-width: 800px) {
      /* We invert order of first sidebar and main
       * And tell the main element to take twice as much width as the other two sidebars 
       */
      .main { flex: 2 0px; }
      .aside-1 { order: 1; }
      .main    { order: 2; }
      .aside-2 { order: 3; }
      .footer  { order: 4; }
    }
    复制代码

带前缀的Flexbox
-----------

  Flexbox需要一些供应商的前缀来支持尽可能多的浏览器。它不仅包括带有供应商前缀的前置属性，实际上还有完全不同的属性和值名称。这是因为随着时间的推移，Flexbox规范已经发生了变化，创建了["old", "tweener", and "new"](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fold-flexbox-and-new-flexbox%2F)版本。

  或许处理这个问题的最好方法是使用新的(也是最终的)语法，并通过[Autoprefixer](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fautoprefixer%2F)运行CSS, Autoprefixer可以很好地处理回退。

  另外，这里有一个Sass @mixin来帮助添加一些前缀，这也让你知晓需要处理的事情:

    <!--scss-->
    @mixin flexbox() {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
    }
    
    @mixin flex($values) {
      -webkit-box-flex: $values;
      -moz-box-flex:  $values;
      -webkit-flex:  $values;
      -ms-flex:  $values;
      flex:  $values;
    }
    
    @mixin order($val) {
      -webkit-box-ordinal-group: $val;  
      -moz-box-ordinal-group: $val;     
      -ms-flex-order: $val;     
      -webkit-order: $val;  
      order: $val;
    }
    
    .wrapper {
      @include flexbox();
    }
    
    .item {
      @include flex(1 200px);
      @include order(2);
    }
    复制代码

相关属性
----

*   [Grid完全指南](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fsnippets%2Fcss%2Fcomplete-guide-grid%2F)

其他资源
----

*   [Flexbox in the CSS specifications](https://link.juejin.im?target=http%3A%2F%2Fwww.w3.org%2FTR%2Fcss3-flexbox%2F)
*   [Flexbox at MDN](https://link.juejin.im?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FCSS%2FTutorials%2FUsing_CSS_flexible_boxes)
*   [Flexbox at Opera](https://link.juejin.im?target=http%3A%2F%2Fdev.opera.com%2Farticles%2Fview%2Fflexbox-basics%2F)
*   [Diving into Flexbox by Bocoup](https://link.juejin.im?target=http%3A%2F%2Fweblog.bocoup.com%2Fdive-into-flexbox%2F)
*   [Mixing syntaxes for best browser support on CSS-Tricks](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fusing-flexbox%2F)
*   [Flexbox by Raphael Goetter (FR)](https://link.juejin.im?target=http%3A%2F%2Fwww.alsacreations.com%2Ftuto%2Flire%2F1493-css3-flexbox-layout-module.html)
*   [Flexplorer by Bennett Feely](https://link.juejin.im?target=http%3A%2F%2Fbennettfeely.com%2Fflexplorer%2F)

Bugs
----

  Flexbox当然也有bugs。我见过的最好bugs收集是Philip Walton和Greg Whitworth的[Flexbugs](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fphilipwalton%2Fflexbugs)。它是开源的，你可以跟踪所有的数据，所以我认为最好查看一下。

浏览器支持
-----

  按“版本”划分:

*   (new)指规范中的最新语法(例如display: flex;)
*   (tweener)是指2011年的一种非官方语法(例如display: flexbox;)
*   (old)指2009年起的旧语法(例如:display: box;)

  黑莓浏览器10+支持新语法。

  更多有关如何混合使用语法以获得最佳浏览器支持的信息，可访问[CSS-Tricks](https://link.juejin.im?target=https%3A%2F%2Fcss-tricks.com%2Fusing-flexbox%2F)和 [DevOpera](https://link.juejin.im?target=http%3A%2F%2Fdev.opera.com%2Farticles%2Fview%2Fadvanced-cross-browser-flexbox%2F%23fallbacks)