# Actions Status Discord

![test](https://github.com/sarisia/actions-status-discord/workflows/test/badge.svg)
![test cancel](https://github.com/sarisia/actions-status-discord/workflows/test%20cancel/badge.svg)

## About

A Github Actions action to notify CI status to Discord.

<img width="478" alt="Screen Shot 2020-04-28 at 6 46 57" src="https://user-images.githubusercontent.com/33576079/80424271-55cfe900-891c-11ea-8c18-4cdcb1ce1ecf.png">

## Usage

### Simple

```yaml
# DO NOT point `@master` branch! It won't work.
- uses: sarisia/actions-status-discord@v1
  # set `always()` to get notifications for all statuses (success, failure, cancelled)
  if: always()
  with:
    # provide discord webhook via either inputs or env.DISCORD_WEBHOOK
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
```

See
[GitHub Actions Reference](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-status-check-functions)
to check functions usable in `if` parameter.

### Full options

```yaml
- name: Post status to Discord
  uses: sarisia/actions-status-discord@v1
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    job: Build
    description: Build and deploy to staging
    nofail: false
    nodetail: false
    color: 0x0000FF
    username: GitHub Actions
    avatar_url: "https://.../image.png"
```

## Environment Variables

| Key | Value | Description |
| - | - | - |
| DISCORD_WEBHOOK | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...` | You can provide webhook via inputs either.

## Inputs

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| webhook | No | String | `env.DISCORD_WEBHOOK` | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...`<br>You can provide webhook via env either. If both is set, this input will be used.<br>**DO NOT APPEND `/github` SUFFIX!** |
| status | No | `Success`, `Failure` or `Cancelled` | `Success` | Set to `${{ job.status }}` is recommended. |
| job | No | String | | Job name included in message title. See example above. |
| description | No | String | | Description included in message. See example above. |
| nofail | No | `true` or `false` | `true` | This action won't make workflow failed by default. If set to `false`, this action will set status failed when failed to notify. |
| nodetail | No | `true` or `false` | `false` | Set `true` to suppress detailed embed fields. |
| color | No | Hex string like: `0xFFFFFF` | | Overrides Discord embed color. |
| username | No | String | | Overrides Discord webhook username. |
| avatar_url | No | String | | Overrides Discord webhook avatar url. |

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

If the option `nofail` is set to `false`, any one of fail will set
workflow status to `failed`.

### Guilded webhook support

As [Guilded](https://guilded.gg) supports [Discord Webhooks API](https://discord.com/developers/docs/resources/webhook#execute-webhook),
you can use Guilded webhook endpoint in the same way as Discord webhook.
