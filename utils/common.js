let common = {};
/*微信预览图片*/
common.preImg = (option) => {
  wx.previewImage({
    current: option.url,
    urls: option.urls
  })
}
common.hideTel = (tel) => {
  return tel.substr(0, 3) + '****' + tel.substr(7)
}
common.hideUserName = (userName) => {
  return userName.split("").map((v, index) => {
    return index ? "*" : v;
  }).join("")
}
common.objToArr = (obj) => {
  if (typeof(obj) == 'string') {
    obj = JSON.parse(obj)
  }
  let arr = []
  for (let i in obj) {
    arr.push(obj[i]);
  }
  return arr
}
/**  获取数据类型 */
common.getType = (obj) => {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return 'array';
  } else if (obj === true || obj === false) {
    return 'boolean';
  } else if (typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length) {
    return 'json'
  } else {
    return typeof(obj)
  }
}
common.failValue = (v, k) => {
  return (v == undefined || v == null || v == 'undefined' || v == 'null' || v == '' || (common.getType(v) == 'array' && v.length == 0) || !v || JSON.stringify(v) == '{}');
}
common.isFailParams = (option) => {
  let field = option.field

  function fail(key) {
    wx.showModal({
      title: '提示',
      content: option.tips && option.tips[key] ? option.tips[key] : key
    })
    return false
  }
  for (let k in field) {
    if (common.failValue(field[k], k)) {
      if (option.filter) {
        if (common.getType(option.filter) == 'string' && k != option.filter) {
          return fail(k);
        } else if (common.getType(option.filter) == 'array' && option.filter.indexOf(k) < 0) {
          return fail(k);
        }
      } else {
        return fail(k);
      }
    }
  }
  return true
}
common.changeWeek = (e) => {
  e = parseInt(e)
  let name
  switch (e) {
    case 1:
      name = "周一";
      break;
    case 2:
      name = "周二";
      break;
    case 3:
      name = "周三";
      break;
    case 4:
      name = "周四";
      break;
    case 5:
      name = "周五";
      break;
    case 6:
      name = "周六";
      break;
    case 7:
      name = "周日";
      break;
  }
  return name
}
//省市区截取
common.getArea = (str) => {
  let area = {}
  let index11 = 0
  let index1 = str.indexOf("省")
  if (index1 == -1) {
    index11 = str.indexOf("自治区")
    if (index11 != -1) {
      area.Province = str.substring(0, index11 + 3)
    } else {
      area.Province = str.substring(0, 0)
    }
  } else {
    area.Province = str.substring(0, index1 + 1)
  }

  let index2 = str.indexOf("市")
  if (index11 == -1) {
    area.City = str.substring(index11 + 1, index2 + 1)
  } else {
    if (index11 == 0) {
      area.City = str.substring(index1 + 1, index2 + 1)
    } else {
      area.City = str.substring(index11 + 3, index2 + 1)
    }
  }

  let index3 = str.lastIndexOf("区")
  if (index3 == -1) {
    index3 = str.indexOf("县")
    area.Country = str.substring(index2 + 1, index3 + 1)
  } else {
    area.Country = str.substring(index2 + 1, index3 + 1)
  }
  return area;
}
//获取操作选项
common.getOperation = (deleteObj = []) => {

  let operation = [{
    name: '分享扩散',
    field: 'share'
  }, {
    name: '置顶信息',
    field: 'top'
  }, {
    name: '刷新信息',
    field: 'refresh'
  }, {
    name: '编辑',
    field: 'edit'
  }, {
    name: '结束',
    field: 'over'
  }, {
    name: '下架',
    field: 'upOrDown'
  }, {
    name: '删除',
    field: 'delete'
  }];
  deleteObj.length > 0 && deleteObj.forEach((v, i) => {
    operation.forEach((o, j) => {
      o.field == v && operation.splice(j, 1);
    })
  })

  return operation
}
//格式化时间数字
common.formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
common.countDownTime = (second) => {
  // 总秒数
  let s = Math.floor(second),
    // 天数
    day = Math.floor(s / 3600 / 24),
    // 小时
    hr = Math.floor(s / 3600 % 24),
    // 分钟
    min = Math.floor(s / 60 % 60),
    // 秒
    sec = Math.floor(s % 60);
  return [day, hr, min, sec].map(common.formatNumber)
  // if (day < 10) {
  //   day = '0' + day
  // }
  // if (hr < 10) {
  //   hr = '0' + hr
  // }
  // if (sec < 10) {
  //   sec = '0' + sec
  // }
  // if (min < 10) {
  //   min = '0' + min
  // }
  // let time = {
  //   day: day,
  //   hr: hr,
  //   min: min,
  //   sec: sec
  // }
  //return time
}
common.promisify = api => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const extras = {
        success: resolve,
        fail: reject
      }
      api({ ...options,
        ...extras
      }, ...params)
    })
  }
}
module.exports = common;