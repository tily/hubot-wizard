# hubot-wizard

Data-driven multi-step conversation for hubot.

## Usage

```js
Wizard = require("hubot-wizard")

module.exports = (robot)->
  questions = [
    {label: "Sex", type: "list", name: "sex", text: "Are you male or female?", list: ["male", "female"]},
    {label: "Age", type: "text", name: "age", text: "How old are you?"},
    {label: "Job", type: "text", name: "job", text: "What do you do?"},
  ]
  wizard = new Wizard(robot: robot, config: {questions: questions})
  wizard.respond /start wizard/, (message, result)=>
    message.reply("You are " + result.sex + ", " + result.age + " years old, and " + result.job + ".")
```

```
tily > @hubot start wizard
hubot> Welcome to the wizard! (c = cancel, r = rewind, d = default)
       Are you male or female? (0:male/1:female [default=0])
tily > @hubot 0
hubot> How old are you?
hubot> @hubot 33
hubot> What do you do?
tily > @hubot Software Engineer
hubot> Are you sure? (y/n)
       * Sex: male
       * Age: 33
       * Job: Software Engineer
tily > @hubot y
hubot> You are male, 33 years old, and Software Engineer.
```
