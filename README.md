# Actions Status Discord

Discord Notification Made Easy.

![image](https://user-images.githubusercontent.com/33576079/102154007-d6e3ec80-3ebb-11eb-9389-f372954813c5.png)

- :sushi: **_Zero-configure!_** Works perfectly out of the box.
- :sushi: **_Universal!_** Supports Linux (Ubuntu), macOS and Windows.
- :sushi: **_Faster startup!_** Faster than ones written in Docker container action.

---

- [Usage](#usage)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Inputs](#inputs)
- [Tips](#tips)
- [FAQ](#faq)
- [Questions? Bugs?](#questions-bugs)

> :warning: If you're reading this document in Marketplace page,
> please refer to the [latest document here](https://github.com/sarisia/actions-status-discord). 

<!-- * [Migrate to v2](#migrate-to-v2) -->

## Usage

### Minimum

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

![image](https://user-images.githubusercontent.com/33576079/102154007-d6e3ec80-3ebb-11eb-9389-f372954813c5.png)

### Full options

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: "deploy"
    description: "Build and deploy to GitHub Pages"
    image: ${{ secrets.EMBED_IMAGE }}
    color: 0x0000ff
    username: GitHub Actions
    avatar_url: ${{ secrets.AVATAR_URL }}
```

![image](https://user-images.githubusercontent.com/33576079/102154036-ecf1ad00-3ebb-11eb-9af3-ff58982d9ecb.png)

### No detail

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
  with:
    nodetail: true
    title: "We did it!"
    color: 0xff91a4
```

![image](https://user-images.githubusercontent.com/33576079/102154072-009d1380-3ebc-11eb-9fe9-24d35a0e1e7b.png)

For `if` parameter, see
[GitHub Actions Reference](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-status-check-functions)

## Configuration

### Environment Variables

| Key | Value | Description |
| - | - | - |
| DISCORD_WEBHOOK | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...` | You can provide webhook via inputs either.<br>**DO NOT APPEND [`/github` SUFFIX](https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook)!**

### Inputs

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| webhook | No | String | `env.DISCORD_WEBHOOK` | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...`<br>This overrides `env.DISCORD_WEBHOOK`.<br>**DO NOT APPEND [`/github` SUFFIX](https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook)!** |
| status | No | `Success`, `Failure` or `Cancelled` | `${{ job.status }}` | See [Document for `job` context](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-context) |
| title | No | String | `${{ github.workflow}}` | String included in embed title. Overrides `job` input. |
| url | No | String | | URL linked to embeded title. |
| description | No | String | | Description included in message |
| image | No | String | | Image attached to the message |
| color | No | Hex string like: `0xFFFFFF` | | Overrides Discord embed color |
| username | No | String | | Overrides Discord webhook username |
| avatar_url | No | String | | Overrides Discord webhook avatar url |
| notime | No | `true` or `false` | `false` | Set `true` to suppress the embeded timestamp. |
| nofail | No | `true` or `false` | `true` | This action won't make workflow failed by default. If set to `false`, this action will set status failed when failed to notify. |
| nocontext | No | `true` or `false` | `false` | Set `true` to suppress GitHub context fields (`Repository`, `Ref`, etc). |
| noprefix | No | `true` or `false` | `false` | Set `true` to avoid appending job status (`Success: `, etc.) to title |
| nodetail | No | `true` or `false` | `false` | Set `true` will set both `nocontext` and `noprefix` to `true` |

<details>
<summary>Show deprecated</summary>

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| job | No | String | | **Deprecated. Will be removed in v2**<br>Job name included in message title. Same as `title` input. |

</details>

<!-- ## Migrate to v2

### input `job` is now `title`

`job` input is deprecated and now removed in v2.

Just change `job` to `title` in your workflow file to make it work. -->

## Tips

### Using markdown

Some fields support markdown syntax.

```yaml
- uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    nodetail: true
    title: New version of `software` is ready!
    description: |
      Version `1.2.3-alpha`
      Click [here](https://github.com/sarisia/actions-status-discord) to download!
```

![image](https://user-images.githubusercontent.com/33576079/102154106-0f83c600-3ebc-11eb-9b4e-b8a90afae4db.png)

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

## FAQ

### `Error: Webhook response: 400: {"sender":["This field is required"]}`

Do not append `/github` suffix to your webhook URL. See [Inputs](#inputs) section.

## Questions? Bugs?

Feel free to ask in [Discussions](https://github.com/sarisia/actions-status-discord/discussions),
or report bugs in [Issues](https://github.com/sarisia/actions-status-discord/issues)!
