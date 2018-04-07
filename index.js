const { show_system_reset_message: SHOW_SYSTEM_RESET_MESSAGE, reset_font_color: RESET_FONT_COLOR, flashing_notification: FLASHING_NOTIFICATION } = require('./config.json')

function SkillResets(dispatch) {
  let model = null

  dispatch.hook('S_LOGIN', (dispatch.base.majorPatchVersion >= 67) ? 10 : 9, event => {
    model = event.templateId
  })

  const showMessage = message => {
    dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
      message,
      unk1: FLASHING_NOTIFICATION ? 70 : 2,
      unk2: 0,
      unk3: 0
    })
  }

  dispatch.hook('S_CREST_MESSAGE', 2, ({ type, skill }) => {
    if (type === 6) {
      showMessage(
        `<img src="img://skill__0__${model}__${
          skill
        }" width="48" height="48" vspace="-20"/><font size="24" color="${
          RESET_FONT_COLOR
        }">&nbsp;Reset</font>`
      )
      if (!SHOW_SYSTEM_RESET_MESSAGE)
        return false
    }
  })
}

module.exports = function SkillResetsWrapper(dispatch) {
  if(!dispatch.base.protocolVersion)
    dispatch.hook('C_CHECK_VERSION', 1, (event) => { SkillResets(dispatch); })
  else
    SkillResets(dispatch)
}
