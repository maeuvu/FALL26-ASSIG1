# Mission 4: Report it and brief the owner

## Commit history

Output of `git log --oneline`:

```
14e2d67 (HEAD -> assignment1, origin/assignment1) Implement Mission 2 runaway button attack (R1-R5)
945e4fa Add console logs to verify async fetch timing for Mission 3
1cdf255 Update mission3.md
da3fa21 Update mission2.md
387505e Update mission1.md
60fe36d Update mission1.md
99e4e6a Merge branch 'assignment1' of https://github.com/maeuvu/FALL26-ASSIG1 into assignment1
81aa6eb Implement strict type-checked normalizeService and parseStatusReport for Mission 1
6aa7f4d Update mission0.md
e104895 Add node_modules to .gitignore
d890ff1 (origin/main, origin/HEAD, main) first push with the assignment files
294714d Initial commit
```

Pick your **best** commit message and your **worst** one. Which of the 7 rules does the worst one break?

> My best commit message is "Add node_modules to .gitignore" it's capitalized, uses imperative mood, has no trailing period, and stays well under 50 characters. My worst is "Implement strict type-checked normalizeService and parseStatusReport for Mission 1," which breaks rule 2. it's 82 characters long. That detail should have gone in a commit body instead, separated from a short subject line by a blank line,  rules 1 and 7.

## Pull Request

PR link, inside your fork:

> [https://github.com/maeuvu/FALL26-ASSIG1/pull/1]

## Creating value: the risk brief

The Operations Manager who owns the portal is not a developer. Write a brief of **120 to 180 words** addressed to them. It must answer:

1. What you proved, in terms of **impact** on operators and on the campus, not in terms of code.
2. Why "it uses HTTPS and validates its data" did **not** protect them.
3. The single most important change the backend team must make, stated concretely.
4. One honest limit of your engagement: what you did **not** test.

> I tested the Incident Management portal by pretending to be malicious code running inside an operator's browser, and I found two serious problems. First, I was able to disable the "Purge All Incidents" button completely. An operator could click it and nothing would happen, with no error message, so they might think a critical action actually went through when it didn't. Second, and worse, I intercepted the live status feed so it always showed every service as "up," even during a real outage. An operator using this portal would have no way of knowing campus systems were actually down.

Neither of these was caused by weak encryption or bad input validation. Those protections only stop bad data from getting in; they don't stop code that's already running inside the page.

The most important fix: the backend needs to independently check every purge request itself, instead of trusting whatever the browser's UI shows.

I didn't test server-side login systems, network attacks, or the real production servers, only the browser itself.

## Reflection

In one or two sentences: which concept from Units 1.1 to 1.3 do you understand much better now, and what made it click? The concept I understand better now is that client-side JavaScript can never be trusted for security, no matter how well-written it looks. It clicked during Mission 3, when I watched my own script replace window.fetch itself and make the portal lie about a real 503 outage, even though the portal's code used textContent and validated every field correctly. Seeing that "well-written" code get completely fooled made it obvious why real protection has to live on the server.

> your answer
