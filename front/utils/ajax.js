// 用Promise 封装 ajax
const qs = require('querystring');
const axios = require('axios');

/**
 * 
 * @param {域名} url
 * @param {方式} method
 * @param {头部} headers
 */


 // 后端url
 let baseUrl = 'http://localhost:3000'


function request({
  url = '',
  method = 'get',
  headers = {},
  data  = {}
}) {
  var xhr = new XMLHttpRequest();
  return new Promise((resolve,reject) => {
    url = baseUrl + url;
    xhr.open(method,url,true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // 通过 Content-Type 为 application/x-www-form-urlencoded 设置 发送的数据类型 为 qs.stringfy(data)
    xhr.send(qs.stringify(data));

    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    }
  })
}




// JSONP
function jsonp ({url , params , callback}) {
    return new Promise((resolve,reject) => {
        let script = document.createElement('script');
        params = JSON.parse(JSON.stringify(params));
        let arrs = [];
        for(let key in params) {
            arrs.push(`${key}=${params[key]}`);
        }
        arrs.push(`callback=${callback}`);
        script.src = `${url}?${arrs.join('&')}`;
        document.body.appendChild(script);
        window[callback] = function(data) {
            resolve(data);
            document.body.removeChild(script);
        }
    })
}


// 返回在vue模板中的调用接口
export default {
    request ,
    jsonp
}