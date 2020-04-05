let str = 'helloworld';

let res = [];

function createTextChunks(size, text) {
    let cur = 0;
    let res = [];
    while (cur < text.length) {
        res.push({
            chunk: text.slice(cur, cur + size)
        })
        cur += size;
    }
    return res;
}

// console.log(createTextChunks(5, str))

let data = [
    '&lt;h1&gt;&lt;a id=&quot;_0&quot;&gt;&lt;/a&gt;前言&lt;/h1&gt;\n' +
    '&lt;p&gt;其实, 前端的安全并没有很多, 不过知道了, 起码后端兄弟不',
    '会那么累了。&lt;br&gt;&lt;br /&gt;\n' +
    '本文主要讨论以下几种攻击方式 :&lt;/p&gt;\n' +
    '&lt;ul&gt;\n' +
    '&lt;li&gt;&lt;strong&gt;XSS方式&lt;',
    '/strong&gt;&lt;/li&gt;\n' +
    '&lt;li&gt;&lt;strong&gt;CSRF方式&lt;/strong&gt;&lt;/li&gt;\n' +
    '&lt;li&gt;&lt;strong',
    '&gt;点击劫持&lt;/strong&gt;&lt;/li&gt;\n&lt;/ul&gt;\n'
];


// 转义
function decodeHtml(str) {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}


// console.log(decodeHtml(data.join("")))


// 让一个函数调用两次

const num = 1;

function test(num) {
    
    if(num) {
        num--;
        test(num);
    }
    console.log(6);
}

test(num)