/* eslint-disable no-param-reassign */

import { getType, isNumber, isString, isDate, isArray, isObject } from './typeChecker';

const millisecondsPerDay = 24 * 60 * 60 * 1000;

const DAY_NAMES = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

const MONTH_NAMES = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

const INTERVAL_RULES = [
  { type: 'dailyInterval' },
  { type: 'weeklyInterval' },
  { type: 'monthlyInterval' },
  { type: 'yearlyInterval' },
];

const COMPONENT_RULES = [
  { type: 'weekdays', min: 1, max: 7, lookup: DAY_NAMES },
  { type: 'daysInMonth', min: 1, max: 31 },
  { type: 'weeksInMonth', min: 1, max: 5 },
  { type: 'ordinalWeekdaysInMonth', ordinal: { min: 1, max: 5 }, min: 1, max: 5, lookup: DAY_NAMES },
  { type: 'weeksInYear', min: 1, max: 53 },
  { type: 'ordinalWeekdaysInYear', ordinal: { min: 1, max: 5 }, min: 1, max: 5, lookup: DAY_NAMES },
  { type: 'monthsInYear', min: 1, max: 12, lookup: MONTH_NAMES },
];

class DateRecurrence {

  constructor(options) {
    // Assign start and end dates if specified
    if (options.start) {
      this.start = this.toDate(options.start);
    }
    if (options.end) {
      this.end = this.toDate(options.end);
    }

    // Assign start of week if specified
    if (options.startOfWeek) {
      let startOfWeek = options.startOfWeek;
      if (isString(startOfWeek)) {
        startOfWeek = DAY_NAMES[options.startOfWeek.toLowerCase()];
      }
      if (startOfWeek < 1 || startOfWeek > 7) {
        throw Error('Start of week must be between 1 and 7.');
      }
      this.startOfWeek = startOfWeek;
    } else {
      // Default to Monday as start of week
      this.startOfWeek = 1;
    }

    // Add interval rules
    INTERVAL_RULES.forEach((rule) => {
      // Get/verify config for the current rule
      const config = options[rule.type];
      if (!config) return;
      // Start date needed for interval rules
      if (!this.start) {
        throw Error('You can only set an interval if this recurrence has a start date.');
      }
      // Parse interval value
      const interval = parseInt(config, 10);
      if (interval <= 0) {
        throw Error(`Interval must be greater than one for ${rule.type}.`);
      }
      // Save interval for this rule
      this[rule.type] = interval;
    });

    // Add component rules
    COMPONENT_RULES.forEach((rule) => {
      // Get/verify config for the current rule
      const config = options[rule.type];
      if (!config) return;
      // Configure rule components
      let components = {};
      if (rule.ordinal) {
        // Make sure ordinal rule is specified as an object
        if (!isObject(config)) {
          throw Error(`Object must be specified for ${rule.type}.`);
        }
        // Process ordinal key:value pairs
        Object.keys(config).forEach((key) => {
          // Parse/validate ordinal key value
          const ordinal = parseInt(key, 10);
          if (ordinal < rule.ordinal.min || ordinal > rule.ordinal.max) {
            throw Error(`Acceptable ordinal range for ${rule.type} is from ${rule.ordinal.min} to ${rule.ordinal.max}.`);
          }
          // Assign ordinal rule components
          components[ordinal] = this.getRuleComponents(rule, config[ordinal]);
        });
      } else {
        // Assign rule components
        components = this.getRuleComponents(rule, config);
      }
      // Save components for this rule
      this[rule.type] = components;
    });
  }

  static toDate(value) {
    if (isDate(value)) {
      return new Date(value.toISOString().substr(0, 10));
    }
    if (isString(value) && value.match(/^(\d\d\d\d-\d\d-\d\d)$/)) {
      return new Date(value);
    }
    throw Error(`Unknown date format: ${value}`);
  }

  getRuleComponents(rule, config, components = {}) {
    if (isNumber(config)) {
      if (config < rule.min || config > rule.max) {
        throw Error(`Acceptable range for ${rule.type} is from ${rule.min} to ${rule.max}.`);
      }
      components[config] = true;
    } else if (isString(config)) {
      if (!rule.lookup) {
        throw Error(`Not allowed to use strings to configure ${rule.type}.`);
      }
      components[rule.lookup[config.toLowerCase()]] = true;
    } else if (isArray(config)) {
      config.forEach(c => this.getRuleComponents(rule, c, components));
    } else {
      // Unsupported type
      throw Error(`Not allowed to use ${getType(config)} to configure ${rule.type}.`);
    }
    return components;
  }

  static getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  }

  static isNumber(value) {
    return this.getType(value) === 'Number';
  }

  static isDate(value) {
    return this.getType(value) === 'Date';
  }

  static isString(value) {
    return this.getType(value) === 'String';
  }

  static isArray(value) {
    return this.getType(value) === 'Array';
  }

  static isObject(value) {
    return this.getType(value) === 'Object';
  }

  static diffInDays(d1, d2) {
    return (d2 - d1) / millisecondsPerDay;
  }

  diffInWeeks(d1, d2) {
    return this.diffInDays(this.getStartOfWeek(d1), this.getStartOfWeek(d2)) / 7;
  }

  diffInMonths(d1, d2) {
    return (this.diffInYears(d1, d2) * 12) + (d2.getMonth() - d1.getMonth());
  }

  static diffInYears(d1, d2) {
    return d2.getUTCFullYear() - d1.getUTCFullYear();
  }

  getStartOfWeek(date) {
    const day = date.getDay();
    let addDays = 0;
    if (day < this.startOfWeek) {
      addDays = day + (this.startOfWeek - 7);
    } else {
      addDays = day - this.startOfWeek;
    }
    return date + (millisecondsPerDay * addDays);
  }

  static getStartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static getStartOfYear(date) {
    return new Date(date.getFullYear(), 1, 1);
  }

  weekOfMonth(date) {
    return this.diffInWeeks(this.getStartOfMonth(date), date);
  }

  dayOfYear(date) {
    return this.diffInDays(this.getStartOfYear(date), date);
  }

  weekOfYear(date) {
    return this.diffInWeeks(this.getStartOfYear(date), date);
  }

  matches(date) {
    date = this.toDate(date);
    // Check if date is between start and end dates, if specified
    if (this.start && date < this.start) return false;
    if (this.end && date > this.end) return false;
    // Check if date matches every rule
    return Object.keys(this).every(key => this[`${key}Matches`](this[key]));
  }

  dailyIntervalMatches(date, components) {
    return (this.diffInDays(this.start, date) % components === 0);
  }

  weeklyIntervalMatches(date, components) {
    return (this.diffInWeeks(this.start, date) % components === 0);
  }

  monthlyIntervalMatches(date, components) {
    return (this.diffInWeeks(this.start, date) % components === 0);
  }

  yearlyIntervalMatches(date, components) {
    return (this.diffInYears(this.start, date) % components === 0);
  }

  static weekdaysMatches(date, components) {
    return components[date.getDay()];
  }

  static daysInMonthMatches(date, components) {
    return components[date.getDate()];
  }

  weeksInMonthMatches(date, components) {
    return components[this.weekOfMonth(date)];
  }

  static ordinalWeekdaysInMonthMatches(date, components) {
    const day = date.getDate();
    const weekday = date.getDay();
    // Check if date matches at least one rule
    return Object.keys(components).some((ordinalKey) => {
      const ordinal = parseInt(ordinalKey, 10);
      const maxDay = ordinal * 7;
      const minDay = maxDay - 6;

      if (day > maxDay) return false;
      if (day < minDay) return false;
      if (!components[weekday]) return false;
      return true;
    });
  }

  weeksInYearMatches(date, components) {
    return components[this.weekOfYear(date)];
  }

  ordinalWeekdaysInYearMatches(date, components) {
    const day = this.dayOfYear(date);
    const weekday = date.getDay();
    // Check if date matches at least one rule
    Object.keys(components).some((ordinalKey) => {
      const ordinal = parseInt(ordinalKey, 10);
      const maxDay = ordinal * 7;
      const minDay = maxDay - 6;

      if (day > maxDay) return false;
      if (day < minDay) return false;
      if (!components[weekday]) return false;
      return true;
    });
  }

  static monthsInYearMatches(date, components) {
    return components[date.getMonth() + 1];
  }
}

export default DateRecurrence;
