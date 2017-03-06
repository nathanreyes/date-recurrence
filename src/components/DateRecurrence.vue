<template>
<div class='container'>
  <div class='columns'>
    <div class='tabs is-one-third'>
      <nav class='panel'>
        <p class='panel-heading'>Rules</p>
        <a class='panel-block'>Repeat</a>
        <a class='panel-block'>Interval</a>
        <a class='panel-block'>Weekdays</a>
        <a class='panel-block'>Days In Month</a>
        <a class='panel-block'>Weeks In Month</a>
        <a class='panel-block'>Weekdays In Month</a>
        <a class='panel-block'>Weeks In Year</a>
        <a class='panel-block'>Weekdays In Year</a>
        <a class='panel-block'>Months In Year</a>
        <div class='panel-block'>
          <button class='button is-primary is-fullwidth' @click='exceptionOn = false' v-if='exceptionOn'>Exceptions</button>
          <button class='button is-light is-fullwidth' @click='exceptionOn = true' v-if='!exceptionOn'>Exceptions</button>
        </div>
        <div class='panel-block'>
          <button class="button is-primary is-outlined is-fullwidth">
            Reset all rules
          </button>
        </div>
      </nav>
    </div>
    <div>
      <recurrence-interval></recurrence-interval>
    </div>
  </div>
</div>
</template>

<script>
import RecurrenceInterval from './RecurrenceInterval';

export default {
  data() {
    return {
      exceptionOn: false,
    };
  },
  components: {
    RecurrenceInterval,
  },
};
</script>
