var TurndownService = require('turndown');
var tService = new TurndownService()
var request = require('request');
var cheerio = require('cheerio');
var fs=require('fs');

// 通过 GET 请求 的内容
request('https://juejin.im/post/5c4ef49b518825273e7339f9', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // 输出网页内容
    var $ = cheerio.load(body);
    var art = $('html').find('article').html();
    var title = $('html').find('.article-title').text();
    var markdown = tService.turndown(art);
    //3. fs.writeFile  写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略
    fs.writeFile(title +'.md', markdown, 'utf8',function(error){
        if(error){
            console.log(error);
            return false;
        }
        console.log('写入成功');
    })
  }
});
