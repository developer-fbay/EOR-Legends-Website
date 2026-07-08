<script setup lang="ts">
// "Why an EOR?" comparison table — user's code block, converted to a data-driven Vue component.
const rows = [
  'Time to first hire',
  'Upfront setup cost',
  'Payroll, tax & benefits',
  'Local compliance & labour law',
  'Equipment & onboarding',
  'Ongoing admin burden',
  'Cost vs home market',
]

const columns = [
  {
    name: 'Legends EOR',
    sub: '',
    highlight: true,
    values: [
      { text: '2–4 weeks' },
      { text: 'None' },
      { text: '✓ Included' },
      { text: '✓ Included' },
      { text: '✓ Included' },
      { text: 'None - we run it' },
      { text: 'up to 60% lower' },
    ],
  },
  {
    name: 'Build your own entity',
    sub: 'Slow & costly',
    highlight: false,
    values: [
      { text: '4–6 months' },
      { text: '£15k–40k' },
      { text: 'Your job', faint: true },
      { text: 'Your job', faint: true },
      { text: 'Your job', faint: true },
      { text: 'High' },
      { text: 'Lower + overheads' },
    ],
  },
  {
    name: 'Local recruiter',
    sub: 'Hire then alone',
    highlight: false,
    values: [
      { text: '3–8 weeks' },
      { text: 'Placement fee' },
      { text: '✗ Not covered', no: true },
      { text: '✗ Not covered', no: true },
      { text: '✗ Not covered', no: true },
      { text: 'Yours after hire' },
      { text: 'Market rate + fee' },
    ],
  },
]
</script>

<template>
  <section class="why-eor band-white section fill-screen">
    <div class="container">
      <header class="why-head">
        <h2>Why Legends EOR?</h2>
        <p>How Legends stacks up against building your own entity or hiring through a local recruiter.</p>
      </header>

      <div class="eor-comp">
        <div class="eor-table">
          <div class="eor-col eor-col-labels">
            <div class="eor-cell eor-cell-head" />
            <div v-for="r in rows" :key="r" class="eor-cell">{{ r }}</div>
          </div>

          <div
            v-for="col in columns"
            :key="col.name"
            class="eor-col"
            :class="{ 'eor-col-legends': col.highlight }"
          >
            <div class="eor-cell eor-cell-head">
              <span class="eor-plan-name">{{ col.name }}</span>
              <span v-if="col.sub" class="eor-plan-sub">{{ col.sub }}</span>
            </div>
            <div v-for="(v, i) in col.values" :key="i" class="eor-cell">
              <span class="eor-rlabel">{{ rows[i] }}</span>
              <span class="eor-val" :class="{ 'eor-val-faint': v.faint, 'eor-val-no': v.no }">{{ v.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-head {
  text-align: center;
  max-width: 720px;
  margin: 0 auto clamp(1.5rem, 4vh, 2.5rem);
}
.why-head p { color: var(--grey-text); }

/* ===== User's comparison-table CSS, kept verbatim (scoped) ===== */
.eor-comp {
  width: 100%;
  margin: 0 auto;
  padding: 22px 0;
  font-family: var(--sans);
  color: #333;
}
.eor-comp p { margin: 0; }

.eor-table { background: white; }
.eor-comp .eor-table {
  display: flex;
  border: 1px solid #e9e6df;
  border-radius: 12px;
}
.eor-comp .eor-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.eor-comp .eor-col-labels { flex: 1.4 1 0; }

.eor-comp .eor-cell {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 22px;
  font-size: 16px;
  line-height: 1.35;
}
.eor-comp .eor-cell-head {
  height: 92px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px 22px 0;
}
.eor-comp .eor-col .eor-cell { border-bottom: 1px solid #ece9e2; }
.eor-comp .eor-col-labels .eor-cell { color: #333; font-weight: 400; }

.eor-comp .eor-plan-name {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 19px;
  color: #2a2a2a;
  line-height: 1.15;
}
.eor-comp .eor-plan-sub { font-size: 13px; color: #8c8c8c; margin-top: 4px; }
.eor-comp .eor-val { color: #6b6b6b; }
.eor-comp .eor-val-faint { color: #ababab; }
.eor-comp .eor-val-no { color: #eb3d00; }
.eor-comp .eor-rlabel { display: none; }

.eor-comp .eor-col-legends { position: relative; }
.eor-comp .eor-col-legends::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 5px;
  right: 5px;
  border: 2px solid #014520;
  background: rgba(1, 69, 32, 0.05);
  z-index: 0;
}
.eor-comp .eor-col-legends .eor-cell { position: relative; z-index: 1; }
.eor-comp .eor-col-legends .eor-plan-name { color: #014520; }
.eor-comp .eor-col-legends .eor-val { color: #014520; font-weight: 600; }

/* Laptop screens: compress the table so the whole section fits the viewport */
@media (min-width: 993px) and (max-height: 820px) {
  .why-head { margin-bottom: 1.1rem; }
  .eor-comp { padding: 10px 0; }
  .eor-comp .eor-cell { height: 47px; font-size: 14px; padding: 0 22px; }
  .eor-comp .eor-cell-head { height: 70px; padding: 16px 22px 0; }
  .eor-comp .eor-plan-name { font-size: 17px; }
  .eor-comp .eor-plan-sub { font-size: 12px; margin-top: 2px; }
}

@media (max-width: 992px) {
  .eor-comp { max-width: 100%; }
  .eor-comp .eor-cell { padding: 0 16px; font-size: 15px; }
  .eor-comp .eor-cell-head { padding: 22px 16px 0; height: 106px; }
  .eor-comp .eor-plan-name { font-size: 17px; }
  .eor-comp .eor-col-labels { flex: 1.5 1 0; }
}

@media (max-width: 768px) {
  .eor-comp .eor-table {
    flex-direction: column;
    border: none;
    border-radius: 0;
    gap: 18px;
  }
  .eor-comp .eor-col-labels { display: none; }
  .eor-comp .eor-col {
    border: 1px solid #e6e2da;
    border-radius: 14px;
    background: #ffffff;
    padding: 6px 20px 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }
  .eor-comp .eor-col-legends {
    border: 2px solid #014520;
    background: rgba(1, 69, 32, 0.04);
  }
  .eor-comp .eor-col-legends::before { display: none; }
  .eor-comp .eor-table .eor-cell-head {
    height: auto;
    padding: 14px 0 12px;
    border-bottom: 1px solid #ece9e2;
    align-items: flex-start;
  }
  .eor-comp .eor-col-legends .eor-cell-head { border-bottom: 1px solid rgba(1, 69, 32, 0.2); }
  .eor-comp .eor-plan-name { font-size: 19px; }
  .eor-comp .eor-table .eor-col .eor-cell:not(.eor-cell-head) {
    height: auto;
    padding: 13px 0;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid #efece5;
  }
  .eor-comp .eor-table .eor-col .eor-cell:not(.eor-cell-head):last-child { border-bottom: none; }
  .eor-comp .eor-rlabel {
    display: block;
    flex: 1;
    color: #7a7a7a;
    font-size: 14px;
    font-weight: 400;
  }
  .eor-comp .eor-val {
    flex: 0 0 auto;
    text-align: right;
    font-weight: 500;
  }
  .eor-comp .eor-col-legends .eor-val { font-weight: 600; }
}

@media (max-width: 480px) {
  .eor-comp .eor-col { padding: 4px 16px 12px; }
  .eor-comp .eor-plan-name { font-size: 18px; }
  .eor-comp .eor-table .eor-col .eor-cell:not(.eor-cell-head) { font-size: 15px; padding: 12px 0; }
  .eor-comp .eor-rlabel { font-size: 13px; }
}
</style>
