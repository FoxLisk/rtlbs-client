export function restErrorToString (error) {
  if (error.response.status === 404) {
    return 'Unknown resource (404)'
  } else if (error.response.status === 405) {
    return 'Invalid method (405)'
  } else if (error.response.status >= 400 && error.response.status < 500) {
    if (error.response.data instanceof String) {
      return error.response.data
    } else if (error.response.data instanceof Array) {
      return error.response.data.join('<br />')
    } else {
      let str = ''
      for (var k in error.response.data) {
        if (k !== 'non_field_errors') {
          str += k + ': '
        }
        str += error.response.data[k].join(', ') + '<br />'
      }
      return str
    }
  } else {
    return 'An error occured (' + error.response.status + ')'
  }
}
