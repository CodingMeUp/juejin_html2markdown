var TurndownService = require('turndown');
var tService = new TurndownService()
var request = require('request');
var cheerio = require('cheerio');
var fs=require('fs');

if (process.argv && process.argv.length > 2) {
  // 通过 GET 请求 的内容
  request(`https://juejin.im/post/${process.argv[2]}`,  (error, response, body)  => {
    if (!error && response.statusCode == 200) {
      // 输出网页内容
      const $ = cheerio.load(body);
      const art = $('html').find('article').html();
      const title = $('html').find('.article-title').text();
      const markdown = tService.turndown(art);
      //3. fs.writeFile  写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略
      fs.writeFile(title.substring(0, 15) + '.md', markdown, 'utf8', function (error) {
        if (error) {
          console.log(error);
          return false;
        }
        console.log('写入成功');
      })
    }
  });
} else {
    console.log(error);
    return false;
}

