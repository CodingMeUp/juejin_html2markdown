[

](/post/5d2593986fb9a07ee27b3d2e)

[](/post/5d2593986fb9a07ee27b3d2e)

2019年07月10日阅读 659

前端之路：RN拆包demo（js部分）
===================

RN 拆包 demo（基于 react-native bundle 命令）
=====================================

> 我不懂原生，只做 js 部分，有懂这方面的大佬，也可以补充原生部分，git地址: [github.com/Mr-jiangzhi…](https://github.com/Mr-jiangzhiguo/rn-bundles-demo)
> 
> 环境：
> 
> macOS: 10.14.4;
> 
> node(nvm): 10.15.3;
> 
> react-native-cli: 2.0.1;
> 
> react-native: 0.60.0;

目录结构
----

    .
    ├── .babelrc
    ├── .buckconfig
    ├── .editorconfig
    ├── .eslintrc.js
    ├── .flowconfig
    ├── .git
    ├── .gitattributes
    ├── .gitignore
    ├── .patch (存放增量文件)
    ├── .watchmanconfig
    ├── README.md
    ├── __tests__
    ├── android (原生代码，原生开发维护)
    ├── app.json
    ├── babel.config.js
    ├── bundles (bundle输出目录)
    ├── business.config.js (打包业务模块的配置)
    ├── common.config.js (打包公共基础模块的配置)
    ├── common.js (公共基础模块的入口文件，将第三方依赖/shim等文件引入进来)
    ├── config (配置文件目录)
    ├── index.js (开发模式的入口文件)
    ├── ios (原生代码，原生开发维护)
    ├── jsconfig.json
    ├── package.json
    ├── scripts (脚本目录)
    ├── src (前端页面，前端开发维护)
    ├── upload (存放需上传服务器的文件)
    └── yarn.lock
    复制代码

### js 部分

通常，我们将一个大的 jsbundle 包拆分为基础包和业务包：

*   基础包：承接 react，react-native 和一些第三方依赖，这些依赖一般不会有太多变动（毕竟 rn 开发大都锁定依赖版本）
*   业务包：承接业务模块，一般有多个模块（比如登录模块，个人中心模块，。。。）

基于 `react-native bundle` 命令拆包(其实是基于[metro](https://facebook.github.io/metro/docs/en/configuration)) 命令为我们提供了 `--config` 参数，让我们可以自己指定配置文件，这样我们就可以通过两个配置文件（common 和 business）来分别进行打包了:

*   `react-native bundle [其他配置] --config common`：打公共基础包
*   `react-native bundle [其他配置] --config business`：打业务包

下面我们来看看 metro 的这个 config 文件：

    module.exports = {
      resolver: {
        /* resolver options */
      },
      transformer: {
        /* transformer options */
      },
      serializer: {
        /* serializer options */
      },
      server: {
        /* server options */
      },
    
      /* general options */
    };
    复制代码

对于拆包我们能用到的就是 `serializer` 中的 `createModuleIdFactory` 和 `postProcessBundleSourcemap` 这两个方法：

*   `createModuleIdFactory`：
    
    *   Used to generate the module id for `require` statements.
    *   用来生成模块 id 的
*   `postProcessBundleSourcemap`：
    
    *   An optional function that can modify the code and source map of the bundle before it is written. Applied once for the entire bundle.
    *   可选函数，可以在写入之前修改包的代码和源映射，用来过滤是否编译

#### 1\. 在项目`config`目录新建 `createModuleIdFactory.js` 和 `postProcessBundleSourcemap.js`

`createModuleIdFactory.js`:

    /**
     * 生成模块Id
     * 基础打包配置
     */
    const path = require('path');
    const pathSep = path.posix.sep;
    
    function createModuleIdFactory() {
      const projectRootPath = process.cwd(); //获取命令行执行的目录
    
      return modulePath => {
        // console.log(modulePath)
        let moduleName = '';
        if (modulePath.indexOf(`node_modules${pathSep}react-native${pathSep}Libraries${pathSep}`) > 0) {
          //这里是去除路径中的'node_modules/react-native/Libraries/‘之前（包括）的字符串，可以减少包大小，可有可无
          moduleName = modulePath.substr(modulePath.lastIndexOf(pathSep) + 1);
        } else if (modulePath.indexOf(projectRootPath) === 0) {
          //这里是取相对路径，不这么弄的话就会打出_user_smallnew_works_....这么长的路径，还会把计算机名打进去
          moduleName = modulePath.substr(projectRootPath.length + 1);
        }
        moduleName = moduleName.replace('.js', ''); //js png字符串没必要打进去
        moduleName = moduleName.replace('.png', '');
        let regExp = pathSep === '\\' ? new RegExp('\\\\', 'gm') : new RegExp(pathSep, 'gm');
        moduleName = moduleName.replace(regExp, '_'); //把path中的/换成下划线(适配Windows平台路径问题)
    
        // console.log(moduleName);
    
        return moduleName;
      };
    }
    module.exports = createModuleIdFactory;
    复制代码

`postProcessBundleSourcemap.js`:

    // 业务代码
    const path = require('path');
    const pathSep = path.posix.sep;
    // 这里简单暴力地吧preclude和node_modules目录下的文件全部过滤掉，只打自己写的代码。
    // 只有自己写的才算是业务代码
    function postProcessModulesFilter(module) {
      //返回false则过滤不编译
    
      if (module.path.indexOf('__prelude__') >= 0) {
        return false;
      }
      if (module.path.indexOf(pathSep + 'node_modules' + pathSep) > 0) {
        if (`js${pathSep}script${pathSep}virtual` === module.output[0].type) {
          return true;
        }
        if (
          module.path.indexOf(
            `${pathSep}node_modules${pathSep}@babel${pathSep}runtime${pathSep}helpers`
          ) > 0
        ) {
          //添加这个判断，让@babel/runtime打进包去
          return true;
        }
        return false;
      }
      return true;
    }
    module.exports = postProcessModulesFilter;
    复制代码

#### 2\. 在项目根目录新建 `common.config.js` 和 `business.config.js`

`common.config.js`:

    // 基础打包配置
    const createModuleIdFactory = require('./config/createModuleIdFactory');
    
    module.exports = {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: true,
            inlineRequires: false,
          },
        }),
      },
      serializer: {
        // 所有模块一经转换就会被序列化，Serialization会组合这些模块来生成一个或多个包，包就是将模块组合成一个JavaScript文件的包。
        // 函数传入的是你要打包的module文件的绝对路径返回的是这个module的id
        // 配置createModuleIdFactory让其每次打包都module们使用固定的id(路径相关)
        createModuleIdFactory: createModuleIdFactory,
        /* serializer options */
      },
    };
    复制代码

`business.config.js`:

    // 业务代码
    const createModuleIdFactory = require('./config/createModuleIdFactory');
    const postProcessModulesFilter = require('./config/postProcessModulesFilter');
    
    module.exports = {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: true,
            inlineRequires: false,
          },
        }),
      },
      serializer: {
        // 函数传入的是你要打包的module文件的绝对路径返回的是这个module的id
        createModuleIdFactory: createModuleIdFactory,
        // A filter function to discard specific modules from the output.
        // 数传入的是module信息，返回是boolean值，如果是false就过滤不打包
        // 配置processModuleFilter过滤基础包打出业务包
        processModuleFilter: postProcessModulesFilter,
        /* serializer options */
      },
    };
    复制代码

#### 3\. 在项目`config`目录新建 `index.js`，用于设置打包配置

`index.js`:

    // 基础打包配置
    /**
     * version - js bundle版本，初始值是1，每次更新请手动加1
     * common - 公共基础包bundle
     * bundles - 业务模块基础包bundle
     * {
    
        "animate": true, // ios平台会使用, 当从A页面转场到B页面的时候,控制[self.navigationControllersetNavigationBarHidden: animated:];中的animate
        "statusBgColor": "#408EF5", //导航状态栏的背景色
        "type": "push", // 进入rn的形式(2种, push和present)
    
        "source": "Login", // 用于拆包打包时的入口entry_file
        "moduleName": "platform", // 模块名称,和 AppRegistry.registerComponent('platform', () => App);一一对应
        "bundleName": "platform.bundle" // 此模块打包出来的bundle名称, 生产环境使用
        }
    */
    module.exports = {
      version: 1,
      common: {
        moduleName: 'platform',
        bundleName: 'platform.bundle',
      },
      bundles: [
        {
          animate: false,
          statusBgColor: '#408EF5',
          type: 'push',
          source: 'mine',
          moduleName: 'rbd_mine',
          bundleName: 'rbd_mine.bundle',
        },
        {
          animate: true,
          statusBgColor: '#ffffff',
          type: 'push',
          source: 'discover',
          moduleName: 'rbd_discover',
          bundleName: 'rbd_discover.bundle',
        },
      ],
    };
    复制代码

#### 4\. 编写`node`脚本，进行打包，包含热更新（文件级别增量升级）

注：`<>` 表示必选，`[]` 表示可选，-v 默认取 config/index.js 的 version

目前是文件级别增量升级，下一步是内容级别增量升级（[diff-match-patch](https://github.com/google/diff-match-patch)）

`package.json` 增加

    "bin": {
      "rn": "./scripts/command.js"
    },
    复制代码

在项目目录执行 `npm link`,之后就可以用 `rn` 脚手架命令了：

*   `rn pack <platform> <type> [-v version]`: 打包 android/ios 的 version 版本的 common/business 包，并压缩至 upload 目录
*   `rn patch <platform> [-v version]`: 打包 android/ios 的 version 版本的增量包，并压缩至 upload 目录
*   `rn hash <target> [-v version]`: target 可以是文件路径(此时无需-v 参数)、ios、android,获取文件指纹(md5)

脚本内容有点多，请直接看代码吧: [command](https://github.com/Mr-jiangzhiguo/rn-bundles-demo/blob/master/scripts/command.js)

为了保证 jsbundle 版本和原生 native 版本保持同步，需要前端和原生人员共同维护一个配置文件，例如放到 firebase：

### Android 部分（等大佬补充）

### Ios 部分（等大佬补充）

附：[repo](https://github.com/Mr-jiangzhiguo/rn-bundles-demo)

\===🧐🧐 文中不足，欢迎指正 🤪🤪===