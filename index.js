module.exports = class Wizard {
  constructor(options) {
    this.robot = options.robot
    this.startText = options.config.startText || "Welcome to the wizard!"
    this.confirmText = options.config.confirmText || "Are you sure? (y/n)"
    this.confirmListMark = options.config.confirmListMark || "* "
    this.confirmListSeparator = options.config.confirmListSeparator || ": "
    this.confirmErrorText = options.config.confirmErrorText || "Please answer with 'y' or 'n'."
    this.cancelText = options.config.cancelText || "Okay! Tell me if I can help."
    this.questions = options.config.questions
    this.cancelCommand = options.config.cancelCommand || "c"
    this.rewindCommand = options.config.rewindCommand || "r"
    this.forwardCommand = options.config.forwardCommand || "d"
    this.state = {started: false}
  }

  respond (regexp, callback) {
    this.callback = callback
    this.robot.respond(regexp, this.startCallback())
    this.robot.respond(/(.+)/, this.answerCallback())
  }

  startCallback() {
    return (message)=> {
      if(this.state.started) return
      this.state = {started: true, confirming: false, questionIndex: 0, result: {}}
    }
  }

  answerCallback() {
    return (message)=> {
      if(!this.state.started) return true
      message.done = true

      if(message.match[1] == this.cancelCommand) {
        return this.cancel(message)
      }

      if(message.match[1] == this.rewindCommand) {
        this.state.questionIndex--
        this.state.questionIndex--
        return this.askQuestion(message)
      }

      if(this.state.questionIndex > 0) {
        if(message.match[1] == this.forwardCommand) {
          let question = this.questions[this.state.questionIndex - 1]
          if(question.type == "list") {
            this.state.result[question.name] = question.list[0]
          } else {
            this.state.result[question.name] = question.default
          }
        } else {
          let question = this.questions[this.state.questionIndex - 1]
          let answer = undefined

          if(question.type == "list") {
            let listIndex = parseInt(message.match[1])
            answer = question.list[listIndex]
          } else {
            answer = message.match[1]
          }
          if(answer === undefined) {
            this.state.questionIndex--
            return this.askQuestion(message)
          }
          this.state.result[question.name] = answer
        }
      }

      if(this.state.confirming) {
        return this.handleConfirmationAnswer(message)
      }
      if(this.state.questionIndex >= this.questions.length) {
        return this.confirmResult(message)
      }
      return this.askQuestion(message)
    }
  }

  askQuestion(message) {
    const question = this.questions[this.state.questionIndex]
    let text = question.text
    if(question.type == "list") {
      let list = []
      question.list.forEach((item, i)=> {
        list.push(`${i}:${item}`)
      })
      text += ` (${list.join("/")} [default=0])`
    } else {
      if(question.default) {
        text += ` (default=${question.default})`
      }
    }
    if(this.state.questionIndex == 0) {
      text = this.startText + "\n" + text
    }
    message.reply(text)

    this.state.questionIndex++
  }

  confirmResult(message) {
    let text = this.confirmText + "\n"
    this.questions.forEach((question)=> {
      text += this.confirmListMark + question.label + this.confirmListSeparator + this.state.result[question.name] + "\n"
    })
    message.reply(text) 
    this.state.confirming = true
  }

  handleConfirmationAnswer(message) {
    if(message.match[1] == "y") {
      this.callback(message, this.state.result)
      this.state = {started: false}
    } else if(message.match[1] == "n") {
      this.cancel(message)
    } else {
      message.reply(this.confirmErrorText)
    }
  }

  cancel(message) {
    message.reply(this.cancelText)
    this.state = {started: false}
  }
}
