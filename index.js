// var TurndownService = require('turndown');
var html2md = require('html-markdown');
// var tService = new TurndownService();
var request = require('request');
var cheerio = require('cheerio');
var fs=require('fs');




if (process.argv && process.argv.length > 2) {
  let url =  '';
  let obj = {};
  // 区分掘金还是segmentfault
  if (isNaN(process.argv[2])) {
    url = 'https://juejin.im/post/';
    obj.from = 'juejin';
  } else {
    url = 'https://segmentfault.com/a/';
    obj.from = 'segmentfault';
  }
  // 通过 GET 请求 的内容
  request(`${url}${process.argv[2]}`,  (error, response, body)  => {
    if (!error && response.statusCode == 200) {
      // 输出网页内容
      const $ = cheerio.load(body);
      let art = $('html').find('article').html();
      let title = (obj.from === 'juejin' ? $('html').find('.article-title').text().trim() : $('#sf-article_title').text().trim()) || '标题未定义';
      // const markdown = tService.turndown(art);
      // 替换data-src -> src
      const regex = /data-src/ig;
      art = art.replace(regex, 'src');
      const md1 = html2md.html2mdFromString(art);
      // use markdown or md1
      //3. fs.writeFile  写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略
      fs.writeFile(title.substring(0, 15) + '.md', md1, 'utf8', function (error) {
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
