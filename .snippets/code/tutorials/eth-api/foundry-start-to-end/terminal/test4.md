<div id="termynal" data-termynal>
    <span data-ty="input"><span class="file-path"></span>forge test</span>
    <span data-ty>[PASS] testIsOverflowingFalse() (gas: 192130)</span>
    <span data-ty>Traces:</span>
    <span data-ty>  [192130] ContainerTest::testIsOverflowingFalse()</span>
    <span data-ty>    ├─ [151256] → new ContainerHarness@0xF62849F9A0B5Bf2913b396098F7c7019b51A820a</span>
    <span data-ty>    │   └─ ← [Return] 522 bytes of code</span>
    <span data-ty>    ├─ [421] ContainerHarness::exposed_isOverflowing(99) [staticcall]</span>
    <span data-ty>    │   └─ ← [Return] false</span>
    <span data-ty>    ├─ [0] VM::assertFalse(false) [staticcall]</span>
    <span data-ty>    │   └─ ← [Return]</span>
    <span data-ty>    ├─ [421] ContainerHarness::exposed_isOverflowing(100) [staticcall]</span>
    <span data-ty>    │   └─ ← [Return] false</span>
    <span data-ty>    ├─ [0] VM::assertFalse(false) [staticcall]</span>
    <span data-ty>    │   └─ ← [Return]</span>
    <span data-ty>    ├─ [421] ContainerHarness::exposed_isOverflowing(0) [staticcall]</span>
    <span data-ty>    │   └─ ← [Return] false</span>
    <span data-ty>    ├─ [0] VM::assertFalse(false) [staticcall]</span>
    <span data-ty>    │   └─ ← [Return]</span>
    <span data-ty>    └─ ← [Stop]</span>
    <span data-ty>Suite result: ok. 4 passed; 0 failed; 0 skipped; finished in 2.07s (2.07s CPU time)</span>
    <span data-ty>Ran 2 test suites in 2.44s (2.08s CPU time): 7 tests passed, 0 failed, 0 skipped (7 total tests)</span>
    <span data-ty="input"><span class="file-path"></span></span>
</div>
