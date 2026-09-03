import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/data/alarmProducts.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { alarmProducts, alarmKitComponentIds, arrowheadKitIncludedItems, createAlarmDetailContent, alarmKitComponentDisplayName } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const kits = alarmProducts.filter((p) => alarmKitComponentIds[p.id] || arrowheadKitIncludedItems[p.id]);
assert.equal(kits.length, 14);

for (const product of alarmProducts.filter((p) => alarmKitComponentIds[p.id] || p.id.endsWith("control-panel"))) {
  const detail = createAlarmDetailContent(product);
  const visible = detail.features.map(([label, text]) => `${label}: ${text}`).join("\n");
  for (const token of ["256", "IP150+", "IP180", "BlueEye", "2012", "firmware", "installer", "master", "maintenance", "monitoring", "daylight-saving", "reset"]) {
    assert(visible.toLowerCase().includes(token.toLowerCase()), `${product.id}: missing ${token}`);
  }
  if (product.id.includes("mg5050") || product.id.includes("sp4000")) assert.match(visible, /15 keypads/);
  if (product.id.includes("sp4000")) assert.match(visible, /BabyWare/);
  assert.equal(new Set(detail.features.map(([label]) => label)).size, detail.features.length, `${product.id}: repeated feature heading`);
}

for (const product of kits.filter((p) => p.brand === "Arrowhead")) {
  const visible = createAlarmDetailContent(product).features.map((pair) => pair.join(": ")).join("\n");
  for (const token of ["32 doors", "1,900 wireless users", "13.8V", "1A", "Outputs 1 and 2", "monitored 12V", "optional", "voltage-free", "Infinity Output"]) {
    assert(visible.includes(token), `${product.id}: missing ${token}`);
  }
  assert(arrowheadKitIncludedItems[product.id].some(([label]) => label === "Alternative power option"));
  assert.equal(arrowheadKitIncludedItems[product.id].some(([label]) => label === "Alternative keypad colour"), product.id.includes("-led-"));
}

const tm50 = alarmProducts.find((p) => p.id === "paradox-tm50-touch-keypad");
for (const kit of kits.filter((p) => p.id.includes("tm50"))) {
  assert.match(kit.name, /White TM50/);
  assert.match(alarmKitComponentDisplayName(kit.id, tm50), /White/);
}
console.log("PASS: 14 kits and 3 Paradox panels expose the verified features; colour and power notes preserved.");
