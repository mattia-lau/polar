# Philosophy

A next generation Tiny Web Framework. To support both TypeScript and JavaScript. Add decorators supprt TypeScript for RAD.

Even have many great frameworks, such as `Nest.js`, `express.js`, `koa.js`. But most of them are not peeflect.

# Benchmark

```
autocannon -c 1024 -t30 http://localhost:3000/test
┌─────────┬───────┬───────┬────────┬────────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5%  │ 99%    │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼────────┼────────┼──────────┼──────────┼────────┤
│ Latency │ 82 ms │ 87 ms │ 148 ms │ 180 ms │ 92.39 ms │ 22.52 ms │ 273 ms │
└─────────┴───────┴───────┴────────┴────────┴──────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 6687    │ 6687    │ 11591   │ 11919   │ 11052.2 │ 1513.27 │ 6684    │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 1.09 MB │ 1.09 MB │ 1.89 MB │ 1.94 MB │ 1.8 MB  │ 247 kB  │ 1.09 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

```

# TODO

[x] Demo site
[x] Router
[ ] Error Handling
[ ] Human Readable Http Exceptions
[ ] Decorators
[ ] Documentation
