import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflowUrl = new URL(
  '../.github/workflows/record-site-release.yml',
  import.meta.url,
);

async function readWorkflow() {
  return readFile(workflowUrl, 'utf8');
}

test('records releases only through an explicitly verified manual workflow', async () => {
  const workflow = await readWorkflow();

  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^\s+push:/m);
  assert.match(workflow, /DEPLOYMENT_VERIFIED/);
  assert.match(workflow, /process\.env\.DEPLOYMENT_VERIFIED !== 'true'/);
});

test('binds every release to the current validated main commit', async () => {
  const workflow = await readWorkflow();

  assert.match(workflow, /context\.ref !== 'refs\/heads\/main'/);
  assert.match(workflow, /main\.commit\.sha !== context\.sha/);
  assert.match(workflow, /'Lint and build'/);
  assert.match(workflow, /'Mark production release candidate'/);
  assert.match(workflow, /target_commitish: context\.sha/);
});

test('uses stable date-based tags and public generated notes', async () => {
  const workflow = await readWorkflow();

  assert.match(workflow, /site-\$\{version\}/);
  assert.match(workflow, /Release \$\{tag\} already exists/);
  assert.match(workflow, /parsedUrl\.protocol !== 'https:'/);
  assert.match(workflow, /generate_release_notes: true/);
});
