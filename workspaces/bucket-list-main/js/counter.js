// 간단한 카운터 컴포넌트
class Counter {
  constructor(options = {}) {
    this.initialValue = options.initialValue || 0;
    this.value = this.initialValue;
    this.min = options.min !== undefined ? options.min : -Infinity;
    this.max = options.max !== undefined ? options.max : Infinity;
    this.step = options.step || 1;
    this.onChange = options.onChange || (() => {});
  }

  // 값 증가
  increment() {
    if (this.value + this.step <= this.max) {
      this.value += this.step;
      this.onChange(this.value);
    }
  }

  // 값 감소
  decrement() {
    if (this.value - this.step >= this.min) {
      this.value -= this.step;
      this.onChange(this.value);
    }
  }

  // 값 설정
  setValue(newValue) {
    const clampedValue = Math.max(this.min, Math.min(this.max, newValue));
    if (clampedValue !== this.value) {
      this.value = clampedValue;
      this.onChange(this.value);
    }
  }

  // 값 리셋
  reset() {
    this.value = this.initialValue;
    this.onChange(this.value);
  }

  // 현재 값 반환
  getValue() {
    return this.value;
  }
}

// DOM 기반 카운터 UI 컴포넌트
class CounterUI {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.counter = new Counter(options);
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md max-w-xs mx-auto">
        <h3 class="text-lg font-semibold text-gray-800">카운터</h3>
        <div class="text-5xl font-bold text-blue-600" id="counterDisplay">${this.counter.getValue()}</div>
        <div class="flex gap-3">
          <button id="decrementBtn" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold">
            -
          </button>
          <button id="resetBtn" class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold">
            리셋
          </button>
          <button id="incrementBtn" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
            +
          </button>
        </div>
        <div class="text-sm text-gray-500">
          범위: ${this.counter.min} ~ ${this.counter.max === Infinity ? '∞' : this.counter.max}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const incrementBtn = this.container.querySelector('#incrementBtn');
    const decrementBtn = this.container.querySelector('#decrementBtn');
    const resetBtn = this.container.querySelector('#resetBtn');
    const display = this.container.querySelector('#counterDisplay');

    this.counter.onChange = (value) => {
      display.textContent = value;
      display.style.animation = 'none';
      setTimeout(() => {
        display.style.animation = 'scaleIn 0.3s ease-out';
      }, 10);
    };

    incrementBtn.addEventListener('click', () => this.counter.increment());
    decrementBtn.addEventListener('click', () => this.counter.decrement());
    resetBtn.addEventListener('click', () => this.counter.reset());
  }
}
