import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const project = fileURLToPath(new URL('../', import.meta.url));
const fixtures = [
  { name: 'stable Groovy version', version: '1.2.3', code: '1435' },
  {
    name: 'Kotlin version with prerelease and build metadata',
    version: '2.0.0-rc.21+debug.123',
    code: '4213',
    assignment: ' =',
    outputs: {
      prereleaseVersion: 'rc.21',
      prereleaseStage: 'rc',
      prereleaseBuildNumber: '21',
      buildMetaDataVersion: 'debug.123',
      buildMetaDataType: 'debug',
      buildMetaDataBuildNumber: '123',
    },
  },
  {
    name: 'prerelease without a build number',
    version: '1.1.2-beta',
    code: '17',
    outputs: { prereleaseVersion: 'beta', prereleaseStage: 'beta' },
  },
  {
    name: 'prerelease with multiple stage components',
    version: '1.0.0-alpha.debug.1',
    code: '4213',
    outputs: {
      prereleaseVersion: 'alpha.debug.1',
      prereleaseStage: 'alpha.debug',
      prereleaseBuildNumber: '1',
    },
  },
];

function readOutputs(path) {
  const lines = readFileSync(path, 'utf8').trimEnd().split(/\r?\n/);
  const outputs = {};
  for (let index = 0; index < lines.length;) {
    const [name, delimiter] = lines[index++].split('<<');
    assert.ok(delimiter, 'output must use the GitHub Actions file format');
    const value = [];
    while (index < lines.length && lines[index] !== delimiter) {
      value.push(lines[index++]);
    }
    assert.equal(lines[index++], delimiter);
    outputs[name] = value.join('\n');
  }
  return outputs;
}

for (const target of ['source', 'bundle']) {
  function run(t, fixture) {
    const directory = mkdtempSync(join(tmpdir(), 'version-reader-test-'));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    let entry = join(project, 'index.js');
    if (target === 'bundle') {
      // Copy only the distributable so no project dependencies are available.
      cpSync(join(project, 'dist'), join(directory, 'dist'), { recursive: true });
      entry = join(directory, 'dist/index.js');
    }
    const gradlePath = join(directory, 'build.gradle');
    const outputPath = join(directory, 'output');
    writeFileSync(outputPath, '');
    if (fixture) {
      const assignment = fixture.assignment ?? '';
      writeFileSync(gradlePath, `android {\n  defaultConfig {\n    versionCode${assignment} ${fixture.code}\n    versionName${assignment} "${fixture.version}"\n  }\n}\n`);
    }
    const result = spawnSync(process.execPath, [entry], {
      cwd: directory,
      env: { ...process.env, INPUT_GRADLEPATH: gradlePath, GITHUB_OUTPUT: outputPath },
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.ifError(result.error);
    return { result, outputPath };
  }

  for (const fixture of fixtures) {
    test(`${target}: ${fixture.name}`, (t) => {
      const { result, outputPath } = run(t, fixture);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const [majorVersion, minorVersion, patchVersion] = fixture.version.split(/[-+]/)[0].split('.');
      assert.deepEqual(readOutputs(outputPath), {
        versionName: `"${fixture.version}"`,
        cleanVersionName: fixture.version,
        versionCode: fixture.code,
        majorVersion,
        minorVersion,
        patchVersion,
        ...fixture.outputs,
      });
    });
  }

  test(`${target}: missing Gradle file fails the action`, (t) => {
    const { result, outputPath } = run(t);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /::error::.*ENOENT/);
    assert.equal(readFileSync(outputPath, 'utf8'), '');
  });
}
