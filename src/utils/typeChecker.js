
export default {

  getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  },

  isNumber(value) {
    return this.getType(value) === 'Number';
  },

  isDate(value) {
    return this.getType(value) === 'Date';
  },

  isString(value) {
    return this.getType(value) === 'String';
  },

  isArray(value) {
    return this.getType(value) === 'Array';
  },

  isObject(value) {
    return this.getType(value) === 'Object';
  },
};
