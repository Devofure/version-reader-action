# Repository rulesets

These files describe the intended GitHub rulesets. Committing them does not
activate protection; a repository administrator must import them in GitHub.

After the CI workflow has run successfully, open **Settings → Rules → Rulesets**,
choose **New ruleset → Import a ruleset**, and import each JSON file:

- `main.json`: require pull requests and the `Build and test` check for `main`;
  block branch deletion and force pushes. No approving reviews are required, so
  a sole maintainer can merge their own pull requests. The check builds on Node.js
  24, verifies the committed bundle, and runs the integration tests.
- `releases.json`: prevent changes to or deletion of fixed version tags matching
  `v*.*.*`, such as `v2.0.0`. Creating new versions remains allowed. Moving major
  tags such as `v2` are outside this ruleset.

Both rulesets are active on import and contain no bypass actors. Keep them active
and confirm their rules after importing.
