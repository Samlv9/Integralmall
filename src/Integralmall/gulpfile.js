﻿/// <binding />
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2015 Samlv9 and other contributors.
/// @MIT-LICENSE | dev-1.0.0 | http://samlv9.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///                                              }|
///                                              }|
///                                              }|     　 へ　　　 ／|    
///      _______     _______         ______      }|      /　│　　 ／ ／
///     /  ___  |   |_   __ \      .' ____ '.    }|     │　Z ＿,＜　／　　 /`ヽ
///    |  (__ \_|     | |__) |     | (____) |    }|     │　　　　　ヽ　　 /　　〉
///     '.___`-.      |  __ /      '_.____. |    }|      Y　　　　　`　 /　　/
///    |`\____) |    _| |  \ \_    | \____| |    }|    ｲ●　､　●　　⊂⊃〈　　/
///    |_______.'   |____| |___|    \______,'    }|    ()　 v　　　　|　＼〈
///    |=========================================\|    　>ｰ ､_　 ィ　 │ ／／
///    | LESS IS MORE!                           ||     / へ　　 /　ﾉ＜|＼＼
///    `=========================================/|    ヽ_ﾉ　　(_／　 │／／
///                                              }|     7　　　　　　  |／
///                                              }|     ＞―r￣￣`ｰ―＿`
///                                              }|
///                                              }|
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.


var gulp         = require("gulp");
var del          = require("del");
var path         = require("path");
var through2     = require("through2");
var promise      = require("es6-promise").polyfill();
var data         = require("gulp-data");
var bower        = require("gulp-bower");
var sass         = require("gulp-sass");
var uglify       = require("gulp-uglify");
var wrapper      = require("gulp-wrapper");
var mustache     = require("gulp-mustache");
var sourcemaps   = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var reference    = require("./toolkit/reference");
var pse2class    = require("./toolkit/pse2class");


const __WEBROOT__   = require("./gulp.json").path; 
const __RESOURCES__ = "resources";
const __BITMAPS__   = __RESOURCES__ + "/bitmaps";
const __CDNIMG__    = __RESOURCES__ + "/bitmaps/cdn"
const __SCRIPTS__   = __RESOURCES__ + "/scripts";
const __STYLES__    = __RESOURCES__ + "/stylesheets";
const __LIBRARIES__ = __RESOURCES__ + "/libraries";


gulp.task("bower", function( callback ) {
    /// 安装 bower 依赖项。
    return bower();
});


gulp.task("update", [
    /* ASSETS */
    "update:assets",

    /* SCSS & CSS */
    "update:normalize.css",
    "update:swiper.css",

    /* SCRIPTS */
    "update:zeptojs",
    //"update:gsap",
    "update:swiper"
], function( callback ) {
    /// 更新项目需要的第三方库。
    return callback();
});


gulp.task("update:gsap", ["bower"], function () {
    /// 更新 Gsap 库。
    return gulp.src(["lib/gsap/src/minified/**/*.js", "lib/gsap/src/minified/**/*.map"])
        .pipe(gulp.dest(__WEBROOT__ + "/" + __LIBRARIES__ + "/gsap"));
});


gulp.task("update:swiper", ["bower"], function () {
    /// 更新 Swiper 库。
    return gulp.src(["lib/swiper/dist/js/**/*.js", "lib/swiper/dist/js/**/*.map"])
        .pipe(gulp.dest(__WEBROOT__ + "/" + __LIBRARIES__ + "/swiper"));
});


gulp.task("update:zeptojs", ["bower"], function () {
    /// 更新 ZeptoJs 库。
    return gulp.src(["lib/zeptojs/src/**/*.js"])
        .pipe(sourcemaps.init())
        .pipe(uglify({ "compress": { 'drop_console': false } }).on("error", console.log))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(__WEBROOT__ + "/" + __LIBRARIES__ + "/zeptojs"));
});


gulp.task("update:normalize.css", ["bower"], function () {
    /// 更新 normalize.scss 库。
    return gulp.src(["lib/normalize-scss/_normalize.scss"])
        .pipe(gulp.dest("sass/normalize"));
});


gulp.task("update:swiper.css", ["bower"], function () {
    /// 更新 swiper.css。
    return gulp.src(["lib/swiper/dist/css/**/*.css", "lib/swiper/dist/css/**/*.map"])
        .pipe(gulp.dest(__WEBROOT__ + "/" + __LIBRARIES__ + "/swiper"));
});


gulp.task("update:assets", ["update:bitmaps"], function( callback ) {
    /// 更新所有的资源文件。
    return callback();
});


gulp.task("update:bitmaps", function () {
    /// 更新图片资源。
    return gulp.src(["bmp/**/*.png", "bmp/**/*.jpg", "bmp/**/*.gif"])
        .pipe(gulp.dest(__WEBROOT__ + "/" + __BITMAPS__));
});


gulp.task("build", ["build:script", "build:sass", "build:templates", "build:static"], function( callback ) {
    /// 编译整个项目。
    return callback();
});


gulp.task("build:sass", ["update"], function () {
    /// 编译项目中的 sass/scss 文件。
    return gulp.src([
        /* 新闻列表 */
        "sass/news.scss",
        "sass/news_native.scss",


        /* 新闻内容页 */
        "sass/article.scss",
        "sass/article_native.scss",


        /* 首页 */
        "sass/index.scss",
        "sass/index_native.scss",

        /* 我的购物车 */
        "sass/cart.scss",
        "sass/cart_native.scss",

        /* 手机绑定 */
        "sass/associate.scss",
        "sass/associate_native.scss",

        /* 用户协议 */
        "sass/license.scss",
        "sass/license_native.scss",

        /* 分类页面 */
        "sass/category.scss",
        "sass/category_native.scss",


        /* 商品详情页 */
        "sass/detail.scss",
        "sass/detail_native.scss",
        "sass/spec_native.scss",
        "sass/option_native.scss",

        /* 确认订单页 */
        "sass/order.scss",
        "sass/order_native.scss",

        /* 用户中心 */
        "sass/usercenter.scss",
        "sass/usercenter_native.scss",

        /* 个人信息 */
        "sass/userinfo.scss",
        "sass/userinfo_native.scss",

        /* 商家信息 */
        "sass/business.scss",
        "sass/business_native.scss",

        /* 我的合伙人 */
        "sass/partner.scss",
        "sass/partner_native.scss",

        /* 订单查询 */
        "sass/query.scss",
        "sass/query_native.scss",

        /* 订单详情 */
        "sass/result.scss",
        "sass/result_native.scss",

        /* 物流详情 */
        "sass/express.scss",
        "sass/express_native.scss",

        /* 我的积分 */
        "sass/credit.scss",
        "sass/credit_native.scss",

        /* 积分提现 */
        "sass/drawcash.scss",
        "sass/drawcash_native.scss",

        /* 积分概览 */
        "sass/logs.scss",
        "sass/logs_native.scss",

        /* 积分明细 */
        "sass/extra.scss",
        "sass/extra_native.scss",

        /* 帮助与反馈 */
        "sass/help.scss",

        /* 404 页面 */
        "sass/404.scss",
        "sass/404_native.scss",

        /* 非微信打开页面 */
        "sass/external.scss"
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({ "outputStyle":"compressed" }).on("error", console.log))
    //.pipe(pse2class({ "pseudos":['active'] }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(__WEBROOT__ + "/" + __STYLES__));
});


gulp.task("build:script", ["update"], function () {
    /// 编译项目中的 javascript 文件。
    return gulp.src([
        /* 运行环境 */
        "src/system.js",

        /* 新闻列表 */
        "src/news.js",
        "src/news_native.js",

        /* 新闻内容页 */
        "src/article.js",
        "src/article_native.js",

        /* 首页 */
        "src/index.js",
        "src/index_native.js",

        /* 我的购物车 */
        "src/cart.js",
        "src/cart_native.js",

        /* 手机绑定 */
        "src/associate.js",
        "src/associate_native.js",

        /* 用户协议 */
        "src/license.js",
        "src/license_native.js",

        /* 商品详情页 */
        "src/detail.js",
        "src/detail_native.js",
        "src/spec_native.js",
        "src/option_native.js",

        /* 分类页面 */
        "src/category.js",
        "src/category_native.js",

        /* 确认订单页 */
        "src/order.js",
        "src/order_native.js",

        /* 用户中心 */
        "src/usercenter.js",
        "src/usercenter_native.js",

        /* 个人信息 */
        "src/userinfo.js",
        "src/userinfo_native.js",

        /* 商家信息 */
        "src/business.js",
        "src/business_native.js",

        /* 我的合伙人 */
        "src/partner.js",
        "src/partner_native.js",

        /* 订单查询 */
        "src/query.js",
        "src/query_native.js",

        /* 订单详情 */
        "src/result.js",
        "src/result_native.js",

        /* 物流详情 */
        "src/express.js",
        "src/express_native.js",

        /* 我的积分 */
        "src/credit.js",
        "src/credit_native.js",

        /* 积分提现 */
        "src/drawcash.js",
        "src/drawcash_native.js",

        /* 积分概览 */
        "src/logs.js",
        "src/logs_native.js",

        /* 积分明细 */
        "src/extra.js",
        "src/extra_native.js",

        /* 帮助与反馈 */
        "src/help.js",

        /* 404 */
        "src/404.js",
        "src/404_native.js"

    ])
    .pipe(sourcemaps.init())
    .pipe(reference())
    .pipe(uglify({ "compress": { 'drop_console': false } }).on("error", console.log))
    .pipe(wrapper({ 
        "header": '(function(domain,undefined){"use strict";', 
        "footer": 'if(typeof Page == "function" && !document.currentPage){domain.currentPage=new Page();}}(this||window));' 
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(__WEBROOT__ + "/" + __SCRIPTS__));
});


gulp.task("build:templates", ["update"], function () {
    /// 编译项目中的模板文件。
    return gulp.src([
        /* 新闻列表 */
        "tmpl/news.html",
        "tmpl/news_native.html",

        /* 新闻内容页 */
        "tmpl/article.html",
        "tmpl/article_native.html",

        /* 首页 */
        "tmpl/index.html",
        "tmpl/index_native.html",

        /* 我的购物车 */
        "tmpl/cart.html",
        "tmpl/cart_native.html",

        /* 手机绑定 */
        "tmpl/associate.html",
        "tmpl/associate_native.html",

        /* 用户协议 */
        "tmpl/license.html",
        "tmpl/license_native.html",

        /* 商品详情页 */
        "tmpl/detail.html",
        "tmpl/detail_native.html",
        "tmpl/spec_native.html",
        "tmpl/option_native.html",

        /* 分类页面 */
        "tmpl/category.html",
        "tmpl/category_native.html",

        /* 确认订单页 */
        "tmpl/order.html",
        "tmpl/order_native.html",

        /* 用户中心页 */
        "tmpl/usercenter.html",
        "tmpl/usercenter_native.html",

        /* 个人信息 */
        "tmpl/userinfo.html",
        "tmpl/userinfo_native.html",

        /* 商家信息 */
        "tmpl/business.html",
        "tmpl/business_native.html",

        /* 我的合伙人 */
        "tmpl/partner.html",
        "tmpl/partner_native.html",

        /* 订单查询 */
        "tmpl/query.html",
        "tmpl/query_native.html",

        /* 订单详情 */
        "tmpl/result.html",
        "tmpl/result_native.html",

        /* 物流详情 */
        "tmpl/express.html",
        "tmpl/express_native.html",

        /* 我的积分 */
        "tmpl/credit.html",
        "tmpl/credit_native.html",

        /* 积分提现 */
        "tmpl/drawcash.html",
        "tmpl/drawcash_native.html",

        /* 积分概览 */
        "tmpl/logs.html",
        "tmpl/logs_native.html",

        /* 积分明细 */
        "tmpl/extra.html",
        "tmpl/extra_native.html",

        /* 帮助与反馈 */
        "tmpl/help.html",

        /* 404 */
        "tmpl/404.html",
        "tmpl/404_native.html"
        
    ])
    .pipe(data(function(file) {
        var opts = {}, filename = path.basename(file.path, path.extname(file.path)), 
            base = require("./model/common/base.json"),
            data = require("./model/" + filename + ".json");

        for ( var name in base ) {
            opts[name] = base[name];
        }

        for ( var name in data ) {
            opts[name] = data[name];
        }

        for ( var name in cfgs = {
            "system"     : "system",
            "filename"   : filename,
            "cdnImg"     : __CDNIMG__,
            "resources"  : __RESOURCES__,
            "bitmaps"    : __BITMAPS__,
            "stylesheets": __STYLES__,
            "scripts"    : __SCRIPTS__,
            "libraries"  : __LIBRARIES__ }) { 

            opts[name] = cfgs[name]; 
        }

        return opts;
    }))
    .pipe(mustache(null, { "extension": ".html" }).on("error", console.log))
    .pipe(gulp.dest(__WEBROOT__));
});


gulp.task("build:static", function() {
    gulp.src([
        "tmpl/external.html"
    ])
    .pipe(gulp.dest(__WEBROOT__));
});


gulp.task("watch:sass", function () {
    /// 监视项目中的样式文件的改动。
    gulp.watch(["sass/**/*.scss", "sass/**/*.sass", "sass/**/*.css"], ["build:sass"]);
});


gulp.task("watch:script", function () {
    /// 监视项目中的脚本文件的改动。
    gulp.watch(["src/**/*.js"], ["build:script"]);
});


gulp.task("watch:templates", function () {
    /// 监视项目中的模板文件的改动。
    gulp.watch(["tmpl/**/*.html", "tmpl/**/*.mst", "model/**/*.json"], ["build:templates"]);
});


gulp.task("clear", function () {
    /// 清空 WebRoot 目录。 
    return del([__WEBROOT__ + "/*", "!" + __WEBROOT__ + "/web.config"], { force: require("./gulp.json").force });
});
