https://schara.sunrockgo.com/birthday?b=20240504&p=1 様から
ページングしつつ取得

```js
$('.en_title').remove()
JSON.stringify(
  Array.from($('.wrap_chara_space')).map(($e) => ({
    name: $e.getElementsByClassName('main_name')[0].innerText,
    anime: $e.getElementsByTagName('a')[0].innerText,
  }))
)
```

`./data/birthday.json` に保存

```

{
  '0504': [
    { name: 'ミナト', anime: 'NARUTO -ナルト-' },
    { name: 'a', anime: 'b' },
    ...],
  '0505': [
    { name: 'a', anime: 'b' },
    ...]
}

```
