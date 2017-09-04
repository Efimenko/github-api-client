export const pickBy = (obj) => {
  let result = {}
  Object.keys(obj).forEach(key => {
      if (obj[key]){
          result[key] = obj[key]
      }
  });
  return result
}
