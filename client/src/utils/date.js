// 时间工具类
var DateUtil = {}

// 是否为时间
DateUtil.isDate = function (input) {
  return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]'
}

// 字符串转成时间
DateUtil.toDate = function (date) {
  // 时间对象
  if (DateUtil.isDate(date)) {
    return date
  }
  // 空
  if (!date) {
    return date
  }
  // 时间戳
  if (/^\d{10}$/.test(date)) {
    date = date * 1000
  }
  if (/^\d{13}$/.test(date)) {
    return new Date(date)
  }

  var spiltDate = date.split(/[T|\s]/)
  if (spiltDate.length < 2) {
    return new Date(date)
  }
  var fullDate = spiltDate[0].split('-')
  var fullTime = spiltDate[1].split(':')

  return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], (fullTime[0] != null ? fullTime[0] : 0), (fullTime[1] != null ? fullTime[1] : 0), (fullTime[2] != null ? fullTime[2].split('.')[0] : 0))
}

/**
 * 判断是否过期
 * @param isoDateStr
 * @returns {boolean}
 */
DateUtil.isExpired = function (date) {
  date = DateUtil.toDate(date)
  if (date.getTime() < new Date().getTime()) {
    return true
  }
  return false
}

export default DateUtil
