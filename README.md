# Actions Status Discord

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=sarisia/actions-status-discord)](https://dependabot.com)
![test](https://github.com/sarisia/actions-status-discord/workflows/test/badge.svg)
![run](https://github.com/sarisia/actions-status-discord/workflows/run/badge.svg)
![run releases](https://github.com/sarisia/actions-status-discord/workflows/run%20releases/badge.svg)

A Github Actions action to notify CI status to Discord.

---

* [Usage](#usage)
* [Environment Variables](#environment-variables)
* [Inputs](#inputs)
* [Tips](#tips)
<!-- * [Migrate to v2](#migrate-to-v2) -->

---

## Usage

### Minimum

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

<img width="393" alt="Screen Shot 2020-05-14 at 11 42 20" src="https://user-images.githubusercontent.com/33576079/81886730-651b8b80-95d8-11ea-923d-b1a896b4a9a0.png">

### Full options

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: "deploy"
    description: "Build and deploy to GitHub Pages"
    nofail: false
    nocontext: false
    noprefix: false
    color: 0x0000ff
    username: GitHub Actions
    avatar_url: ${{ secrets.AVATAR_URL }}
```

<img width="391" alt="Screen Shot 2020-05-14 at 11 42 53" src="https://user-images.githubusercontent.com/33576079/81886733-677de580-95d8-11ea-831c-dba1698757ec.png">

### No detail

```yaml
- uses: sarisia/actions-status-discord@v1
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
  with:
    nodetail: true
    title: "We did it!"
```

<img width="296" alt="Screen Shot 2020-05-14 at 11 43 28" src="https://user-images.githubusercontent.com/33576079/81886735-69e03f80-95d8-11ea-8828-fa10dda8afd1.png">

For `if` parameter, see
[GitHub Actions Reference](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-status-check-functions)

## Environment Variables

| Key | Value | Description |
| - | - | - |
| DISCORD_WEBHOOK | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...` | You can provide webhook via inputs either.<br>**DO NOT APPEND [`/github` SUFFIX](https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook)!**

## Inputs

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| webhook | No | String | `env.DISCORD_WEBHOOK` | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...`<br>This overrides `env.DISCORD_WEBHOOK`.<br>**DO NOT APPEND [`/github` SUFFIX](https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook)!** |
| status | No | `Success`, `Failure` or `Cancelled` | `${{ job.status }}` | See [Document for `job` context](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-context) |
| title | No | String | `${{ github.workflow}}` | String included in embed title. Overrides `job` input. |
| description | No | String | | Description included in message |
| color | No | Hex string like: `0xFFFFFF` | | Overrides Discord embed color |
| username | No | String | | Overrides Discord webhook username |
| avatar_url | No | String | | Overrides Discord webhook avatar url |
| nofail | No | `true` or `false` | `true` | This action won't make workflow failed by default. If set to `false`, this action will set status failed when failed to notify. |
| nocontext | No | `true` or `false` | `false` | Set `true` to suppress GitHub context fields (`Repository`, `Ref`, etc). |
| noprefix | No | `true` or `false` | `false` | Set `true` to avoid appending job status (`Success: `, etc.) to title |
| nodetail | No | `true` or `false` | `false` | Set `true` will set both `nocontext` and `noprefix` to `true` |

### Deprecated inputs

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| job | No | String | | **Deprecated. Will be removed in v2**<br>Job name included in message title. Same as `title` input. |

<!-- ## Migrate to v2

### input `job` is now `title`

`job` input is deprecated and now removed in v2.

Just change `job` to `title` in your workflow file to make it work. -->

## Tips

### Trigger multiple webhooks

You can set multiple webhooks separated with EOL (line break, `\n`) to Secrets.

For example, set Secrets to:
```
https://discordapp.com/api/webhooks/...
https://media.guilded.gg/weabhooks/...
https://this-is-invalid-webhook-endpoint.invalid/...
```
will trigger these 3 webhooks simultaneously.

If some of these webhooks are failed, other deliveries will **NOT** be cancelled.

If the option `nofail` is set to `false` and any of one fail, the action will set
workflow status to `Failure`.

### Guilded webhook support

As [Guilded](https://guilded.gg) supports [Discord Webhooks API](https://discord.com/developers/docs/resources/webhook#execute-webhook),
you can use Guilded webhook endpoint in the same way as Discord webhook.

<details>
<summary>Guilded Embed Image</summary>

<img width="431" alt="Screen Shot 2020-05-14 at 11 44 21" src="https://user-images.githubusercontent.com/33576079/81886777-841a1d80-95d8-11ea-9878-c3c10ab6f21b.png">

</details>
