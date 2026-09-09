import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = join(root, "src");
const publicRoot = join(root, "public");

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? filesBelow(join(directory, entry.name))
    : [join(directory, entry.name)]));
  return nested.flat();
}

const sourceFiles = (await filesBelow(sourceRoot)).filter((file) => [".ts", ".tsx", ".json"].includes(extname(file)));
let imageTags = 0;
let localReferences = 0;
for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  if (extname(file) === ".tsx") {
    for (const [tag] of source.matchAll(/<img\b[\s\S]*?>/g)) {
      imageTags += 1;
      assert.match(tag, /\balt\s*=/, `${file}: every image needs an alt attribute; use alt="" only when decorative`);
    }
  }
  for (const [, path] of source.matchAll(/["'](\/assets\/[^"']+\.(?:avif|gif|jpe?g|png|svg|webp))["']/gi)) {
    localReferences += 1;
    await access(join(publicRoot, path.slice(1)));
    const filename = path.split("/").at(-1).replace(/\.[^.]+$/, "");
    assert.ok(filename.length >= 3 && /[a-z0-9]/i.test(filename), `${path}: use a descriptive image filename`);
    assert.doesNotMatch(filename, /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i, `${path}: do not use a UUID-only public filename`);
  }
}

const publicFiles = await filesBelow(publicRoot);
assert.ok(publicFiles.every((file) => !file.endsWith(".DS_Store")), "Do not deploy .DS_Store files");
console.log(`PASS: ${imageTags} image tags include alt attributes; ${localReferences} local image references resolve; public assets contain no macOS metadata.`);
