<template>
  <div class='box'>
    <div class='control is-horizontal is-grouped'>
      <div class='control-label'>
        <label class='label pre'>{{ predays }}</label>
      </div>
      <div class='control'>
        <input
          class='input' type='number' min='1'
          :placeholder='placeholder' v-model='days'
          @blur='edited("days")'>
      </div>
      <div class='control-label'>
        <label class='label post'>{{ postdays }}</label>
      </div>
    </div>
    <div class='control is-horizontal is-grouped'>
      <div class='control-label'>
        <label class='label pre'>{{ preweeks }}</label>
      </div>
      <div class='control'>
        <input
          class='input' type='number' min='1'
          :placeholder='placeholder' v-model='weeks'
          @blur='edited("weeks")'>
      </div>
      <div class='control-label'>
        <label class='label post'>{{ postweeks }}</label>
      </div>
    </div>
    <div class='control is-horizontal is-grouped'>
      <div class='control-label'>
        <label class='label pre'>{{ premonths }}</label>
      </div>
      <div class='control'>
        <input
          class='input' type='number' min='1'
          :placeholder='placeholder' v-model='months'
          @blur='edited("months")'>
      </div>
      <div class='control-label'>
        <label class='label post'>{{ postmonths }}</label>
      </div>
    </div>
    <div class='control is-horizontal is-grouped'>
      <div class='control-label'>
        <label class='label pre'>{{ preyears }}</label>
      </div>
      <div class='control'>
        <input class='input' type='number' min='1'
          :placeholder='placeholder' v-model='years'
          @blur='edited("years")'>
      </div>
      <div class='control-label'>
        <label class='label post'>{{ postyears }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: undefined,
      weeks: undefined,
      months: undefined,
      years: undefined,
      predays: 'Every',
      preweeks: 'and every',
      premonths: 'and every',
      preyears: 'and every',
      placeholder: 'single',
    };
  },
  computed: {
    showDays() {
      return this.daysInFocus || this.days > 1;
    },
    postdays() {
      return this.days > 1 ? 'days' : 'day';
    },
    postweeks() {
      return this.weeks > 1 ? 'weeks' : 'week';
    },
    postmonths() {
      return this.months > 1 ? 'months' : 'month';
    },
    postyears() {
      return this.years > 1 ? 'years' : 'year';
    },
  },
  methods: {
    edited(field) {
      if (this[field] <= 1) this[field] = undefined;
    },
  },
};
</script>

<style scoped>

input {
  width: 85px;
  text-align: center;
}

.pre {
  width: 90px;
}

.post {
  text-align: left;
  width: 50px;
}

.hidden {
  display: none;
}

</style>
