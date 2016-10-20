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
